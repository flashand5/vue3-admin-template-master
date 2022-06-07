<template>
  <!--  弹窗修改密码-->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    :before-close="closeFormModal"
  >
    <h3>修改密码</h3>
    <el-form ref="refForm" label-width="150px" :inline="false" :model="resPassForm" :rules="formRules" class="pr-5">
      <el-form-item label="用户名" prop="userName" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="resPassForm.userName" class="widthPx-150" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="resPassForm.email" class="widthPx-150" placeholder="请输入邮箱" />
      </el-form-item>
      <div>
        <el-form-item label="验证码" prop="code" :rules="formRules.isNotNull" label-position="left">
          <el-input v-model="resPassForm.code" class="widthPx-150" placeholder="请输入获得的验证码" />
        </el-form-item>
        <el-button @click="sendEmail">发送验证码</el-button>
      </div>
      <el-form-item label="新的密码" prop="password" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="resPassForm.password" class="widthPx-150" placeholder="请输入新的密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeFormModal">返回</el-button>
        <el-button type="primary" @click="updatePass">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/*1.初始化引入和实例化*/
import { useCommon } from '@/hooks/global/useCommon'
// 语法糖，获取父组件的方法
const emit = defineEmits(['hideComp'])

/*2.modal新增和修改*/
//新增
const refForm = ref(null)
// 建立局部数据
let resPassForm = reactive({
  userName: '',
  email: '',
  code: '',
  password: ''
})
// 导入表单校验功能
const { elMessage, formRules, elConfirm } = useElement()
// 发送验证码请求
let sendEmail = () => {
  return axiosReq({
    url: '/system/user/sendEmail',
    data: {
      email: resPassForm.email,
      userName: resPassForm.userName
    },
    method: 'post',
    bfLoading: true
  }).then((res) => {
    if (res.code === 200) {
      elMessage('发送成功')
    }else {
      elMessage(res.message)
    }
  })
}
// 修改密码请求
let updatePass = () => {
  return axiosReq({
    url: '/system/user/checkEmailCode',
    data: resPassForm,
    method: 'post',
    bfLoading: true
  }).then((res) => {
    if (res.code === 200){
      elMessage('修改成功，请返回重新登录')
      emit('hideComp')
    }else {
      elMessage(res.message)
    }

  })
}

/*3.弹框相关*/
const { dialogTitle, dialogVisible } = useCommon()
let showModal = () => {
    dialogTitle.value = `修改密码`
    dialogVisible.value = true
}

//关闭弹框
let closeFormModal = () => {
  emit('hideComp')
}

//导出内部组件属性（暴露给父组件）
defineExpose({
  showModal
})
//导出属性到页面中使用
// let {levelList} = toRefs(state);
</script>

<style scoped lang="scss">

</style>
