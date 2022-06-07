<template>
  <div class="scroll-y">
    <!--操作-->
    <div class="mr-3 rowSS">
      <el-button type="primary" @click="addBtnClick">新增</el-button>
      <el-button type="primary" @click="multiDelBtnClick">删除</el-button>
      <!--条件搜索-->
      <el-form ref="refsearchForm" :inline="true" class="demo-searchForm ml-3">
        <el-form-item label-width="0px" label="" prop="sn" label-position="left">
          <el-input v-model="searchForm.searchContent" class="widthPx-150" placeholder="搜索内容" />
        </el-form-item>
        <el-form-item label-width="0px" label="" prop="status" label-position="left">
          <el-select v-model="searchForm.status" clearable placeholder="搜索字段" class="widthPx-120">
            <el-option label="员工编号" value="personId" />
            <el-option label="员工姓名" value="personName" />
            <el-option label="职位名称" value="positionName" />
            <el-option label="部门名称" value="departmentName" />
          </el-select>
        </el-form-item>
        <div  style="margin-bottom: 10px">
          <el-tag style="height: 24px">员工状态</el-tag>
          <el-radio-group v-model="radio1" @change="searchBtnClick">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="0">正常</el-radio-button>
            <el-radio-button label="1">休假</el-radio-button>
            <el-radio-button label="2">离职</el-radio-button>
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
      <el-table-column align="center" prop="personId" label="员工编号" sortable="custom" min-width="70" />
      <el-table-column align="center" prop="personName" label="员工姓名" sortable="custom" min-width="70" />
      <el-table-column align="center" prop="personStatus" label="员工状态" sortable="custom" width="100" >
        <template #default="scope">
        <span v-if="scope.row.personStatus===0">
              <el-tag type="success">工作</el-tag>
            </span>
        <span v-else-if="scope.row.personStatus===1">
              <el-tag type="warning">休假</el-tag>
            </span>
        <span v-else-if="scope.row.personStatus===2">
              <el-tag type="danger">离职</el-tag>
            </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="positionName" label="职位名称" sortable="custom" min-width="100" />
      <el-table-column align="center" prop="departmentName" label="部门名称" sortable="custom" min-width="100">
      </el-table-column>
      <!--点击操作-->
      <el-table-column align="center" label="操作" fixed="right" width="120px">
        <template #default="{ row }">
          <p><el-button v-if="row.personStatus!==2" link ="true" type="success" size="small" @click="tableRedClick(row)">&nbsp;解雇&nbsp;</el-button>
            <el-button  v-else size="small" disabled>解雇</el-button></p>
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
// 导入编辑弹窗的子组件
import VciForm from './personForm.vue'
//获取子组件实例（定义一个操作属性的方法）
const refVciForm = ref(null)
const radio1 = ref('')
/*2.表格操作和查询*/
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
let VcitableData = ref([])
let searchForm = reactive({
  personId: '',
  personName: '',
  personStatus: '',
  personInducTime: '',
  personQuitTime: '',
  positionId: '',
  positionName: '',
  departmentId: '',
  departmentName: '',
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
  mapObject.set("personStatus",radio1.value)
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
    url: '/system/person/selectListPerson',
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

//关闭弹窗
const hideComp = () => {
  showFrom.value = false
}

//删除
let { elMessage, elConfirm } = useElement()
let deleteByIdReq = (id) => {
  return axiosReq({
    url: '/system/person/deletePerson',
    data: { personId: id },
    isParams: false,
    method: 'post',
    bfLoading: true
  })
}
// 单个删除
let tableDelClick = async (row) => {
  await elConfirm('确定', `您确定要删除【${row.personName}】吗？`)
  deleteByIdReq(row.personId).then(() => {
    selectPageReq()
    elMessage(`【${row.personName}】删除成功`)
  })
}
//批量删除
const multiDelBtnClick = async () => {
  let rowDeleteIdArr = []
  let deleteNameTitle = ''
  rowDeleteIdArr = multipleSelection.value.map((mItem) => {
    deleteNameTitle = deleteNameTitle + mItem.personName + ','
    return mItem.personId
  })
  if (rowDeleteIdArr.length === 0) {
    elMessage('表格选项不能为空', 'warning')
    return
  }
  let stringLength = deleteNameTitle.length - 1
  await elConfirm('删除', `您确定要删除${deleteNameTitle.slice(0, stringLength)}吗`)
  const data = rowDeleteIdArr
  axiosReq({
    url: `/system/person/deleteBatchPerson`,
    data,
    method: 'post',
    bfLoading: true
  }).then(() => {
    elMessage('删除成功')
    selectPageReq()
  })
}

//解雇事件
let tableRedClick = async (row) => {
  await elConfirm('确定', `您确定要解雇【${row.personName}】吗？`)
  readByIdReq(row.personId).then(() => {
    selectPageReq()
    elMessage(`【${row.personName}】已解雇`)
  })
}
//阅读接口
let readByIdReq = (id) => {
  return axiosReq({
    url: '/system/person/dismissPersonById',
    data: { personId: id },
    isParams: false,
    method: 'post',
    bfLoading: true
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
