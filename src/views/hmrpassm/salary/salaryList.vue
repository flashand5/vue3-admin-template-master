<template>
  <div class="scroll-y">
    <!--操作-->
    <div class="mr-3 rowSS">
      <el-button type="primary" @click="addBtnClick">新增</el-button>
      <el-button type="primary" @click="multiDelBtnClick">删除</el-button>
      <!--条件搜索-->
      <el-form ref="refsearchForm" :inline="true" class="demo-searchForm ml-3">
        <el-form-item label-width="0px" label="" prop="searchContent" label-position="left">
          <el-input v-model="searchForm.searchContent" class="widthPx-150" placeholder="搜索内容" />
        </el-form-item>
        <el-form-item label-width="0px" label="" prop="status" label-position="left">
          <el-select v-model="searchForm.status" clearable placeholder="搜索字段" class="widthPx-120">
            <el-option label="薪酬编号" value="salaryId" />
            <el-option label="员工编号" v-if="searchForm.personId === ''" value="personId" />
            <el-option label="固定工资" value="salaryFixed" />
          </el-select>

        </el-form-item>
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
      <el-table-column align="center" prop="salaryId" label="薪酬编号" sortable="custom" min-width="70" />
      <el-table-column align="center" prop="total" label="总工资" sortable="custom" min-width="70" />
      <el-table-column align="center" prop="salaryTime" label="薪酬发放时间" sortable="custom" min-width="70" />
      <el-table-column align="center" prop="personId" label="员工编号" sortable="custom" min-width="70">
      </el-table-column>
      <!--点击操作-->
      <el-table-column align="center" label="操作" fixed="right" width="120px">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="check(row)">查看</el-button>
          <el-button type="text" size="small" @click="tableEditClick(row)">编辑</el-button>
          <el-button type="text" size="small" @click="tableDelClick(row)">删除</el-button>
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
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {usePersonStore} from "@/store/person";
// 导入编辑弹窗的子组件
import VciForm from './salaryForm.vue'
//获取子组件实例（定义一个操作属性的方法）
const refVciForm = ref(null)

/*2.表格操作和查询*/
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
let VcitableData = ref([])
let searchForm = reactive({
  salaryId: '',
  salaryTime: '',
  salaryFixed: '',
  salaryMerit: '',
  salarySeniority: '',
  salaryAllowance: '',
  salaryBenefit: '',
  salarySubsidy: '',
  salaryOrder: '',
  personId: '',
  total: '',
  status: '',
  searchContent: '',
  fieldName: '',
  order: '',
})
const router = useRouter()
const personStore = usePersonStore()
// 挂载完数据后的钩子函数
onMounted(() => {
  if (router.currentRoute.value.name === "mySalary"){
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
  mapObject.set("pageNum",pageNum.value)
  mapObject.set("pageSize",pageSize.value)
  mapObject.set("order",searchForm.order)
  mapObject.set("fieldName",searchForm.fieldName)
  mapObject.set("personId",searchForm.personId)
  // 转成对象再赋值
  const data = Object.assign(Object.fromEntries(mapObject.entries()))
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
    url: '/system/salary/selectListSalary',
    method: 'post',
    data: getSearchData(),
    isParams: false,
    isAlertErrorMsg: false
  }
  axiosReq(reqConfig).then((resData) => {
    let list = resData.data?.list
    for (let i = 0 ;i < list.length ; i++){
      //插入总数数据
      Object.defineProperty(list[i], "total", {
        value:parseInt(list[i].salaryFixed)+parseInt(list[i].salaryMerit)+parseInt(list[i].salarySeniority)+parseInt(list[i].salaryAllowance)+parseInt(list[i].salaryBenefit)+parseInt(list[i].salarySubsidy)+parseInt(list[i].salaryOrder)+"元",
        enumerable:true, // 是否可以遍历
        writable:true, // 是否可以被修改
        configurable:true  // 是否可以被删除
      })
    }
    VcitableData.value = list
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
//添加点击事件
let addBtnClick = () => {
  showFrom.value = true
  nextTick(() => {
    refVciForm.value.showModal()
  })
}
// 修改点击事件
let tableEditClick = (row) => {
  showFrom.value = true
  nextTick(() => {
    refVciForm.value.showModal(true, row)
  })
}

let check = (row) => {
  console.log("薪资详情")
}

//关闭弹窗
const hideComp = () => {
  showFrom.value = false
}

//删除
let { elMessage, elConfirm } = useElement()
let deleteByIdReq = (id) => {
  return axiosReq({
    url: '/system/salary/deleteSalary',
    data: { salaryId: id },
    isParams: false,
    method: 'post',
    bfLoading: true
  })
}
// 单个删除
let tableDelClick = async (row) => {
  await elConfirm('确定', `您确定要删除编号为【${row.salaryId}】的工资条吗？`)
  deleteByIdReq(row.salaryId).then(() => {
    selectPageReq()
    elMessage(`【${row.salaryId}】删除成功`)
  })
}
//批量删除
const multiDelBtnClick = async () => {
  let rowDeleteIdArr = []
  let deleteNameTitle = ''
  rowDeleteIdArr = multipleSelection.value.map((mItem) => {
    deleteNameTitle = deleteNameTitle + mItem.salaryId + ','
    return mItem.salaryId
  })
  if (rowDeleteIdArr.length === 0) {
    elMessage('表格选项不能为空', 'warning')
    return
  }
  let stringLength = deleteNameTitle.length - 1
  await elConfirm('删除', `您确定要删除${deleteNameTitle.slice(0, stringLength)}吗`)
  const data = rowDeleteIdArr
  axiosReq({
    url: `/system/salary/deleteBatchSalary`,
    data,
    method: 'post',
    bfLoading: true
  }).then(() => {
    elMessage('删除成功')
    selectPageReq()
  })
}

</script>

<style scoped>

</style>
