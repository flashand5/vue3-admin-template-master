<template>
<!--  重置密码界面-->
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item label="原始密码" prop="password">
      <el-input v-model.number="ruleForm.password" />
    </el-form-item>
    <el-form-item label="新的密码" prop="newPassword">
      <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="再次确认" prop="checkPass">
      <el-input
        v-model="ruleForm.checkPass"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
      >提交</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">清空</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
// 导入表单校验
import {useUserStore} from "@/store/user";

import { reactive, ref } from 'vue'
import {ElMessageBox} from "element-plus";

const { proxy } = getCurrentInstance()

const userS = useUserStore();


const ruleFormRef = ref()

// 原始密码校验
const checkAge = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入原始密码'))
  }
}
// 新密码校验
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新的密码'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
// 再次输入密码校验
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新的密码'))
  } else if (value !== ruleForm.newPassword) {
    callback(new Error("两次输入不匹配!"))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  userName: userS.userName,
  newPassword: '',
  checkPass: '',
  password: '',
})

const rules = reactive({
  newPassword: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  password: [{ validator: checkAge, trigger: 'blur' }],
})

// 提交点击事件
const submitForm = (formEl) => {
  // 接口参数
  let resetPassConfig = {
    url: '/system/user/resetPass',
    method: 'post',
    data: ruleForm,
    isParams: false,
    bfLoading: false,
    isAlertErrorMsg: false
  }
  // 接口响应
  axiosReq(resetPassConfig).then((resData) => {
    if (resData.code === 200){
      ElMessageBox.alert('您的密码已修改成功' , '成功', {
        confirmButtonText: 'OK',
      })
    }else {
      ElMessageBox.alert(resData.message , resData.code, {
        confirmButtonText: 'OK',
      })
    }
  })
}

// 清空点击事件
const resetForm = (formEl) => {
  console.log(formEl)
  if (!formEl) return
  formEl.resetFields()
}


</script>

<style scoped>

</style>
