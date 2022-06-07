<template>
  <div>
  <el-card>
    <template #header>
      <div class="card-header">
        <b>角色数：{{ total }}</b>
        <el-button class="button" style="float: right" @click="selectPageReq" text>刷新</el-button>
      </div>
    </template>
    <el-collapse v-model="activeName" accordion @change ="collBtnClick">
      <el-empty v-if="pageList.length === 0" description="无角色" />
      <el-collapse-item v-for="(val, key) in pageList" :key="key" :title="'角色编号：'+val.roleId+' | '+'角色名：'+val.roleName" :name="key">
        <el-table
          id="resetElementDialog"
          ref="refuserTable"
          stripe
          style="width: 100%"
          :data="VcitableData"
        >
          <el-table-column align="center" prop="personId" label="员工编号" min-width="70" />
          <el-table-column align="center" prop="personName" label="员工姓名" min-width="70" />
          <el-table-column align="center" prop="personStatus" label="员工状态" width="100" >
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
          <el-table-column align="center" prop="positionName" label="职位名称" min-width="100" />
          <el-table-column align="center" prop="departmentName" label="部门名称" min-width="100">
          </el-table-column>
      </el-table>
      </el-collapse-item>
    </el-collapse>
  </el-card>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'

let total = ref(0)
const activeName = ref('1')
let VcitableData = ref([])
let roleForm = reactive({
  roleId: '',
  roleName: '',
  roleDesc: '',
})

let pageList = ref([])

onMounted(() => {
  selectPageReq()
})

let { elMessage, elConfirm } = useElement()
//折叠点击
const collBtnClick = (val) => {
  if (val !== ''){
    roleForm.roleId = pageList.value[val].roleId
    selectPerPageReq()
  }
}

// 搜索表单时的数据处理
const getSearchData = () => {
  // 用map实现动态键值对
  const mapObject = new Map();
  mapObject.set("pageNum",1)
  mapObject.set("pageSize",80)
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
    pageList.value = resData.data?.list
    total.value = resData.data?.total
  })
}

// 搜索表单时的数据处理
const getPersonData = () => {
  // 用map实现动态键值对
  const mapObject = new Map();
  mapObject.set("pageNum",1)
  mapObject.set("pageSize",1000)
  mapObject.set("roleId",roleForm.roleId)
  // 转成对象再赋值
  const data = Object.assign(Object.fromEntries(mapObject.entries()))
  // 清除空值
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  return data
}

// 查看用户接口
let selectPerPageReq = () => {
  let reqConfig = {
    url: '/system/person/selectListPerson',
    method: 'post',
    data: getPersonData(),
    isParams: false,
    isAlertErrorMsg: false
  }
  axiosReq(reqConfig).then((resData) => {
    VcitableData.value = resData.data?.list
  })
}

</script>

<style scoped>

</style>
