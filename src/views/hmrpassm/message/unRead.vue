<template>
<el-card>
  <template #header>
    <div class="card-header">
      <b>总数：{{ searchForm.total }}</b>
      <el-button class="button" style="float: right" @click="selectPageReq" text>重新获取</el-button>
    </div>
  </template>
  <el-collapse v-model="activeName" accordion @change ="collBtnClick">
    <el-empty v-if="pageList.length === 0" description="无未读消息" />
    <el-collapse-item v-for="(val, key) in pageList" :key="key" :title="'用户：'+val.senUserName+' | '+'标题：'+val.userMsgTitle" :name="key">
      &nbsp;&nbsp;{{ val.userMsgContent }}
      <p>时间：{{ val.userMsgSendTime }}</p>
    </el-collapse-item>
  </el-collapse>
</el-card>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import {useUserStore} from "@/store/user";

const activeName = ref('1')
let searchForm = reactive({
  userMsgId: '',
  userId: '',
  userMsgTitle: '',
  userMsgContent: '',
  userMsgSendTime: '',
  userMsgIfRead: '',
  senUserName: '',
  total: 0
})

let pageList = ref([])

const userStore = useUserStore()
onMounted(() => {
  searchForm.receiveUserId = userStore.userId
  selectPageReq()
})

// 查看用户接口
let selectPageReq = () => {
  let reqConfig = {
    url: '/system/usermessage/selectMySend',
    method: 'post',
    data: getSearchData(),
    isParams: false,
    isAlertErrorMsg: false
  }
  axiosReq(reqConfig).then((resData) => {
    pageList.value = resData.data?.list
    searchForm.total = resData.data?.total
  })
}

// 搜索表单时的数据处理
const getSearchData = () => {
  // 用map实现动态键值对
  const mapObject = new Map();
  mapObject.set("userMsgIfRead",1)
  mapObject.set("pageNum",1)
  mapObject.set("pageSize",80)
  mapObject.set("order","desc")
  mapObject.set("fieldName","userMsgSendTime")
  mapObject.set("receiveUserId",searchForm.receiveUserId)
  // 转成对象再赋值
  const data = Object.assign(Object.fromEntries(mapObject.entries()))
  // 清除空值
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  return data
}

let { elMessage, elConfirm } = useElement()
//折叠点击
const collBtnClick = (val) => {
  console.log(val)
  readByIdReq(pageList[val].userMsgId).then(() => {
    elMessage(`【${pageList[val].userMsgTitle}】设为已读`)
  })
}

//阅读接口
let readByIdReq = (id) => {
  return axiosReq({
    url: '/system/usermessage/readMessage',
    data: { userMsgId: id },
    isParams: false,
    method: 'post',
    bfLoading: true
  })
}


</script>

<style scoped>

</style>
