<template>
<el-card>
  <div class="scroll-y">
    <!--操作-->
    <div class="mr-3 rowSS">
      <el-button type="primary" @click="multiDelBtnClick">删除</el-button>
      <!--条件搜索-->
      <el-form ref="refsearchForm" :inline="true" class="demo-searchForm ml-3">
        <el-form-item label-width="0px" label="" prop="sn" label-position="left">
          <el-input v-model="searchForm.searchContent" class="widthPx-150" placeholder="搜索内容" />
        </el-form-item>
        <el-form-item label-width="0px" label="" prop="status" label-position="left">
          <el-select v-model="searchForm.status" clearable placeholder="搜索字段" class="widthPx-120">
            <el-option label="流程编号" value="prclaunchId" />
            <el-option label="流程描述" value="prclaunchDesc" />
            <el-option label="模板编号" value="prcInfoId" />
            <el-option label="员工编号" value="personId" />
          </el-select>
        </el-form-item>
        <div  style="margin-bottom: 10px">
          <el-tag style="height: 24px">流程优先级</el-tag>
          <el-radio-group v-model="radio1" @change="searchBtnClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="0">普通</el-radio-button>
            <el-radio-button label="1">重要</el-radio-button>
            <el-radio-button label="2">紧急</el-radio-button>
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
      <el-table-column align="center" prop="prclaunchId" label="流程编号" sortable="custom" min-width="95" />
      <el-table-column align="center" prop="prclaunchDesc" label="流程描述" sortable="custom" min-width="95" />
      <el-table-column align="center" prop="prclaunchPri" label="优先级" width="70" >
        <template #default="scope">
        <span v-if="scope.row.prclaunchPri===0">
              <el-tag type="success">普通</el-tag>
            </span>
          <span v-else-if="scope.row.prclaunchPri===1">
              <el-tag type="warning">重要</el-tag>
            </span>
          <span v-else-if="scope.row.prclaunchPri===2">
              <el-tag type="danger">紧急</el-tag>
            </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ifTransfer" label="转办" width="70" >
        <template #default="scopee">
        <span v-if="scopee.row.ifTransfer===0">
              <el-tag type="success">启用</el-tag>
            </span>
          <span v-else-if="scopee.row.ifTransfer===1">
              <el-tag type="danger">禁用</el-tag>
            </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="prctackStatus" label="任务状态" width="70" >
        <template #default="scoper">
        <span v-if="scoper.row.prctackStatus===0">
              <el-tag>不执行</el-tag>
            </span>
          <span v-else-if="scoper.row.prctackStatus===1">
              <el-tag type="info">锁定</el-tag>
            </span>
          <span v-else-if="scoper.row.prctackStatus===2">
              <el-tag type="danger">未执行</el-tag>
            </span>
          <span v-else-if="scoper.row.prctackStatus===3">
              <el-tag type="success">已完成</el-tag>
            </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="prclaunchTime" label="发起时间" width="70" />
      <el-table-column align="center" prop="prcInfoTitle" label="模板名称" width="70" />
      <el-table-column align="center" prop="personName" label="发起人" sortable="custom" min-width="95"></el-table-column>
        <el-table-column align="center" prop="prclaunchStatus" label="流程状态" width="90" >
          <template #default="scoper">
        <span v-if="scoper.row.prclaunchStatus===0">
              <el-tag>审批中</el-tag>
            </span>
            <span v-else-if="scoper.row.prclaunchStatus===1">
              <el-tag type="info">待执行任务</el-tag>
            </span>
            <span v-else-if="scoper.row.prclaunchStatus===2">
              <el-tag type="danger">流程被驳回</el-tag>
            </span>
            <span v-else-if="scoper.row.prclaunchStatus===3">
              <el-tag type="success">流程通过</el-tag>
            </span>
          </template>
        </el-table-column>
      <!--点击操作-->
      <el-table-column align="center" label="操作" fixed="right" width="120px">
        <template #default="{ row }">
          <el-button link ="true" type="success" size="small" v-if="row.prctackStatus===2" @click="stack(row)">执行任务</el-button>
          <el-button  size="small" v-else disabled>执行任务</el-button>
          <el-button link ="true" type="text" size="small" @click="tableEditClick(row)">编辑</el-button>
          <el-button link ="true" type="text" size="small" @click="tableDelClick(row)">删除</el-button>
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
    <VciForm v-if="showFrom" ref="refVciForm" @hideComp="hideComp" @selectPageReq="selectPageReq" />
  </div>
</el-card>
</template>

<script setup>
const radio1 = ref('')
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'
// 导入编辑弹窗的子组件
import VciForm from './processLaunchForm.vue'
//获取子组件实例（定义一个操作属性的方法）
const refVciForm = ref(null)

/*2.表格操作和查询*/
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
let VcitableData = ref([])
let searchForm = reactive({
  prclaunchId: '',
  prclaunchDesc: '',
  prclaunchTime: '',
  prclaunchPri: '',
  ifTransfer: '',
  prctackStatus: '',
  prclaunchStatus: '',
  prcInfoId: '',
  prcInfoTitle: '',
  personId: '',
  personName: '',
  status: '',
  searchContent: '',
  fieldName: '',
  order: '',
})
// 挂载完数据后的钩子函数
onMounted(() => {
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
  mapObject.set("prclaunchPri",radio1.value)
  mapObject.set("pageNum",pageNum.value)
  mapObject.set("pageSize",pageSize.value)
  mapObject.set("order",searchForm.order)
  mapObject.set("fieldName",searchForm.fieldName)
  // 转成对象再赋值
  const data = Object.assign(Object.fromEntries(mapObject.entries()))
  // 清除空值
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  return data
}

// 任务执行接口
let stack = (row) => {
  console.log(row)
  console.log(row.prclaunchId)
  let reqConfig = {
    url: '/system/processtack/execTack',
    method: 'post',
    data: {prclaunchId: row.prclaunchId},
    isParams: false,
    isAlertErrorMsg: false
  }
  axiosReq(reqConfig).then((resData) => {
    elMessage(resData.message,'error')
    selectPageReq()
  })
}

const { totalPage, startEndArr } = useCommon()

// 查看用户接口
let selectPageReq = () => {
  let reqConfig = {
    url: '/system/processlaunch/selectProcLaunch',
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
let { pageNum, pageSize, handleCurrentChange, handleSizeChange } = tablePageHook(selectPageReq)

// 搜索点击事件
const searchBtnClick = () => {
  //此处要重置页数，也是常出的bug
  pageNum.value = 1
  selectPageReq()
}

// 定义一个开启和关闭弹窗显示的变量
let showFrom = ref(false)
// 修改点击事件
let tableEditClick = (row) => {
  showFrom.value = true
  nextTick(() => {
    refVciForm.value.showModal(true, row)
  })
}

//关闭弹窗
const hideComp = () => {
  showFrom.value = false
}

//删除
let { elMessage, elConfirm } = useElement()
let deleteByIdReq = (id) => {
  return axiosReq({
    url: '/system/processlaunch/deleteProcLaunch',
    data: { prclaunchId: id },
    isParams: false,
    method: 'post',
    bfLoading: true
  })
}
// 单个删除
let tableDelClick = async (row) => {
  await elConfirm('确定', `您确定要删除流程【${row.prclaunchId}】吗？`)
  deleteByIdReq(row.prclaunchId).then(() => {
    selectPageReq()
    elMessage(`【${row.prclaunchId}】删除成功`)
  })
}
//批量删除
const multiDelBtnClick = async () => {
  let rowDeleteIdArr = []
  let deleteNameTitle = ''
  rowDeleteIdArr = multipleSelection.value.map((mItem) => {
    deleteNameTitle = deleteNameTitle + mItem.prclaunchId + ','
    return mItem.prclaunchId
  })
  if (rowDeleteIdArr.length === 0) {
    elMessage('表格选项不能为空', 'warning')
    return
  }
  let stringLength = deleteNameTitle.length - 1
  await elConfirm('删除', `您确定要删除${deleteNameTitle.slice(0, stringLength)}吗`)
  const data = rowDeleteIdArr
  axiosReq({
    url: `/system/processlaunch/deleteBatchProcLaunch`,
    data,
    method: 'post',
    bfLoading: true
  }).then(() => {
    elMessage('删除成功')
    selectPageReq()
  })
}

</script>

<style scoped lang="scss">
/*详情*/
.detail-container {
  flex-wrap: wrap;
}

.detail-container-item {
  min-width: 40%;
  margin-bottom: 20px;
}

.detailDialog-title {
  margin-bottom: 14px;
  font-weight: bold;
  font-size: 16px;
}
</style>
