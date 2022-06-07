<template>
  <div class="scroll-y">
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
      <el-table-column align="center" prop="roleId" label="角色编号" sortable="custom" min-width="70" />
      <el-table-column align="center" prop="roleName" label="角色名称" sortable="custom" min-width="70" />
      <el-table-column align="center" prop="roleDesc" label="角色描述" width="240" />
      <!--点击操作-->
      <el-table-column align="center" label="操作" fixed="right" width="120px">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="tableEditClick(row)">编辑</el-button>
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
// 导入编辑弹窗的子组件
import VciForm from './roleForm.vue'
//获取子组件实例（定义一个操作属性的方法）
const refVciForm = ref(null)

/*2.表格操作和查询*/
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
let VcitableData = ref([])
let searchForm = reactive({
  roleId: '',
  roleName: '',
  roleDesc: '',
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

const { totalPage, startEndArr } = useCommon()

// 查看用户接口
let selectPageReq = () => {
  let reqConfig = {
    url: '/system/role/selectListRole',
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

</script>

<style scoped>

</style>
