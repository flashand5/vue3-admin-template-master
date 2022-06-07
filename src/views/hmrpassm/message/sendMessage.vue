<template>
  <el-row>
    <el-col>
      <el-card>
        <el-form ref="refForm" :inline="false" :model="subForm" :rules="formRules" class="pr-5">
          <el-form-item label="收信人" prop="receiveUserId" :rules="formRules.isNotNull" label-position="left">
            <el-input-number v-model="subForm.receiveUserId" :min="1" class="widthPx-310" placeholder="收信人" />
          </el-form-item>
          <el-form-item label="标题" prop="userMsgTitle" :rules="formRules.isNotNull" label-position="left">
            <el-input v-model="subForm.userMsgTitle" class="widthPx-310" placeholder="标题" />
          </el-form-item>
          <el-form-item label="内容" prop="userMsgContent" :rules="formRules.isNotNull" label-position="left">
            <el-input v-model="subForm.userMsgContent" type="textarea" :rows="20"  style="width: 100%" placeholder="内容" />
          </el-form-item>
        </el-form>
      <span class="dialog-footer">
        <el-button @click="emptyClick(refForm)">清 空</el-button>
        <el-button type="primary" @click="sendBtnClick">发 送</el-button>
      </span>
      </el-card>
    </el-col>
    <el-col></el-col>
  </el-row>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'
import { useUserStore } from '@/store/user'
const { elMessage, formRules, elConfirm } = useElement()

const userStore = useUserStore()
const refForm = ref(null)
let subForm = reactive({
  userId: '',
  userMsgTitle: '',
  userMsgContent: '',
  receiveUserId: 1,
})
// 挂载完数据后的钩子函数
onMounted(() => {
  subForm.userId = userStore.userId
})

// 确定事件
let sendBtnClick = () => {
  const data = JSON.parse(JSON.stringify(subForm))
  axiosReq({
    url: '/system/usermessage/sendMessage',
    data: data,
    method: 'post',
    bfLoading: true
  }).then((res) => {
    if (res.code == 200){
      elMessage('发送成功')
    }else {
      elMessage('出现错误:'+res.code,'error')
    }
  })
}

//表单清空
let emptyClick = (searchForm) => {
  if (!searchForm) return
  searchForm.resetFields()

}
</script>

<style scoped>

</style>
