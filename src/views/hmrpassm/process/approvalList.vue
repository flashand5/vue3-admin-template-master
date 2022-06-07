<template>
<el-card>
  <div class="scroll-y">
    <!--操作-->
    <div class="mr-3 rowSS">
      <!--条件搜索-->
      <el-form ref="refsearchForm" :inline="true" class="demo-searchForm ml-3">
        <el-form-item label-width="0px" label="" prop="sn" label-position="left">
          <el-input v-model="searchForm.searchContent" class="widthPx-150" placeholder="搜索内容" />
        </el-form-item>
        <el-form-item label-width="0px" label="" prop="status" label-position="left">
          <el-select v-model="searchForm.status" clearable placeholder="搜索字段" class="widthPx-120">
            <el-option label="审批编号" value="prcApprovalId" />
            <el-option label="模板步骤编号" value="nodeinfoId" />
            <el-option label="审批人编号" value="personId" />
            <el-option label="流程编号" value="prclaunchId" />
          </el-select>
        </el-form-item>
        <div  style="margin-bottom: 10px">
          <el-tag style="height: 24px">审批状态</el-tag>
          <el-radio-group v-model="radio1" @change="searchBtnClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="0">审批中</el-radio-button>
            <el-radio-button label="1">审批通过</el-radio-button>
            <el-radio-button label="2">审批驳回</el-radio-button>
          </el-radio-group>
        </div>
      </el-form>
      <!--查询按钮-->
      <el-button type="primary" @click="searchBtnClick">搜索</el-button>
    </div>
    <!--表格和分页-->
    <el-table
      id="resetElementDialog"
      ref="refuserTable"
      height="calc(100vh - 280px)"
      border
      :data="VcitableData"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" prop="prcApprovalId" label="流程步骤编号" sortable="custom" min-width="70" />
      <el-table-column align="center" prop="prcInfoTitle" label="模板名称" sortable="custom" min-width="70" />
      <el-table-column align="center" prop="prclaunchDesc" label="流程描述" min-width="70" />
      <el-table-column align="center" prop="nodecontLevel" label="流程节点" min-width="70" />
      <el-table-column align="center" prop="personName" label="审批人" min-width="70" />
      <el-table-column align="center" prop="prcApprovalStatus" label="审批状态" min-width="70" >
        <template #default="scope">
        <span v-if="scope.row.prcApprovalStatus===0">
              <el-tag type="warning">审批中</el-tag>
            </span>
          <span v-else-if="scope.row.prcApprovalStatus===1">
              <el-tag type="success">通过</el-tag>
            </span>
          <span v-else-if="scope.row.prcApprovalStatus===2">
              <el-tag type="danger">驳回</el-tag>
            </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="prcApprovalTime" label="完成时间" min-width="70" />
      <!--点击操作-->
      <el-table-column align="center" label="操作" fixed="right" width="120px">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="tableCheckClick(row)">查看</el-button>
          <el-button type="text" size="small" v-if="row.prcApprovalStatus===0" @click="showProc(row)">通过</el-button>
          <el-button type="text" size="small" v-if="row.prcApprovalStatus===0" @click="showRejec(row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block columnCC mt-2 mb-5">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--    用户编辑，弹窗子组件-->
    <VciForm v-if="showFrom" ref="refVciForm" @hideComp="hideComp"/>
    <el-dialog
    v-model="show"
    width="600px"
    :close-on-click-modal="false"
    :before-close="closeShow"
    >
      <el-form ref="refForm" label-width="150px" :inline="false" :model="procForm" :rules="formRules" class="pr-5">
        <el-form-item label="审批意见" prop="prcApprovalOpin" :rules="formRules.isNotNull" label-position="left">
          <el-input v-model="procForm.prcApprovalOpin" class="widthPx-150" placeholder="审批意见" />
        </el-form-item>
        <el-form-item label="驳回原因" v-if="procForm.rejectStatus" prop="rejectReason" :rules="formRules.isNotNull" label-position="left">
          <el-input v-model="procForm.rejectReason" class="widthPx-150" placeholder="驳回原因" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeShow">取 消</el-button>
        <el-button type="primary" @click="procBtnClick">确 定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</el-card>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const radio1 = ref('')
// 导入编辑弹窗的子组件
import VciForm from './process.vue'
//获取子组件实例（定义一个操作属性的方法）
const refVciForm = ref(null)

const personStore = usePersonStore()

/*2.表格操作和查询*/
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
let VcitableData = ref([])
let searchForm = reactive({
  prcApprovalId: '',
  rejectReason: '',
  prcApprovalOpin: '',
  prcApprovalStatus: '',
  prcApprovalTime: '',
  nodeinfoId: '',
  personId: '',
  prclaunchId: '',
  prclaunchDesc: '',
  prcInfoTitle: '',
  nodecontLevel: '',
  nodecontNextLevel: '',
  nodeinfoName: '',
  nodeinfoDesc: '',
  personName: '',
  status: '',
  searchContent: '',
  fieldName: '',
  order: '',
})

let procForm = reactive({
  prcApprovalId: '',
  prcApprovalStatus: 0,
  prcApprovalOpin: '',
  rejectReason: '',
  personId: '',
  rejectStatus: false,
})

const router = useRouter()
// 挂载完数据后的钩子函数
onMounted(() => {
  if (router.currentRoute.value.name === "myAppr"){
    searchForm.personId = personStore.personId
  }
  selectPageReq()
})

// 表单排序事件
const handleSortChange = (val) => {
  searchForm.fieldName = val.prop
  if (val.order === "ascending"){
    searchForm.order = "asc"
  }else if (val.order === "descending"){
    searchForm.order = "desc"
  }else {
    searchForm.order = ""
  }
  selectPageReq()
}

// 搜索表单时的数据处理
const getSearchData = () => {
  // 用map实现动态键值对
  const mapObject = new Map();
  mapObject.set(searchForm.status,searchForm.searchContent)
  mapObject.set("prcApprovalStatus",radio1.value)
  mapObject.set("pageNum",pageNum.value)
  mapObject.set("pageSize",pageSize.value)
  mapObject.set("order",searchForm.order)
  mapObject.set("fieldName",searchForm.fieldName)
  mapObject.set("personId",searchForm.personId)
  // 转成对象再赋值
  const data = Object.assign(Object.fromEntries(mapObject.entries()))
  console.log(data)
  // 清除空值
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  return data
}

const { totalPage, startEndArr } = useCommon()

// 查看用户接口
let selectPageReq = () => {
  let reqConfig = {
    url: '/system/processapproval/selectProcessapproval',
    method: 'post',
    data: getSearchData(),
    isParams: false,
    isAlertErrorMsg: false
  }
  axiosReq(reqConfig).then((resData) => {
    VcitableData.value = resData.data?.list
    totalPage.value = resData.data?.total
  })
}

import tablePageHook from '@/hooks/useTablePage'
import {usePersonStore} from "@/store/person";
let { pageNum, pageSize, handleCurrentChange, handleSizeChange } = tablePageHook(selectPageReq)

// 搜索点击事件
const searchBtnClick = () => {
  //此处要重置页数，也是常出的bug
  pageNum.value = 1
  selectPageReq()
}

// 定义一个开启和关闭弹窗显示的变量
let showFrom = ref(false)
let show = ref(false)
//添加点击事件
let addBtnClick = () => {
  showFrom.value = true
  nextTick(() => {
    refVciForm.value.showModal()
  })
}
// 查看点击事件
let tableCheckClick = (row) => {
  console.log(row)
  showFrom.value = true
  nextTick(() => {
    refVciForm.value.showModal(true, row)
  })
}

// 审批点击事件
let showProc = (row) => {
  show.value = true
  procForm.prcApprovalId = row.prcApprovalId
  procForm.prcApprovalStatus = 1
  procForm.rejectStatus = false
  procForm.personId = personStore.personId
  console.log(procForm)
}

// 驳回点击事件
let showRejec = (row) => {
  console.log(row)
  show.value = true
  procForm.prcApprovalId = row.prcApprovalId
  procForm.prcApprovalStatus = 2
  procForm.rejectStatus = true
  procForm.personId = personStore.personId
}

//提交审批
let procBtnClick = () => {
  const data = JSON.parse(JSON.stringify(procForm))
  console.log(data)
  axiosReq({
    url: '/system/processapproval/updateProcessapproval',
    data: data,
    method: 'post',
    bfLoading: true
  }).then((res) => {
    elMessage('审批完成')
    closeShow()
  })
}

//关闭弹窗
const hideComp = () => {
  showFrom.value = false
}

//关闭审批
const closeShow = () => {
  show.value = false
}

const { elMessage, formRules, elConfirm } = useElement()

</script>

<style scoped>

</style>
