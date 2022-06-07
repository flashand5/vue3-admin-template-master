<template>
<!--  弹窗修改页面-->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    :before-close="closeFormModal"
  >
    <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm" :rules="formRules" class="pr-5">
      <el-form-item label="用户名" prop="userName" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.userName" class="widthPx-150" placeholder="用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="userPass" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.userPass" class="widthPx-150" placeholder="密码" />
      </el-form-item>
      <el-form-item label="用户信息" prop="userDesc" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.userDesc" class="widthPx-150" placeholder="用户信息" />
      </el-form-item>
      <el-form-item label="员工编号" prop="personId" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.personId" class="widthPx-150" placeholder="员工编号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeFormModal">取 消</el-button>
        <el-button type="primary" @click="confirmBtnClick">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/*1.初始化引入和实例化*/
import { useCommon } from '@/hooks/global/useCommon'
// 接收父组件的方法
const emit = defineEmits(['selectPageReq', 'hideComp'])

/*2.modal新增和修改*/
//新增
const refForm = ref(null)
let subForm = reactive({
  userId: '',
  userName: '',
  userPass: '',
  userDesc: '',
  personId: '',
  personName: ''
})
// 确定事件
let confirmBtnClick = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (subForm.userId) {
        updateReq()
      } else {
        insertReq()
      }
    } else {
      return false
    }
  })
}
const { elMessage, formRules, elConfirm } = useElement()
// 新增请求
const insertReq = () => {
  const data = JSON.parse(JSON.stringify(subForm))
  delete data.id
  axiosReq({
    url: '/system/user/createUser',
    data: data,
    method: 'post',
    bfLoading: true
  }).then((res) => {
    elMessage('保存成功')
    emit('selectPageReq')
    emit('hideComp')
  })
}
//将父组件获得的数据放到子组件同名属性
const reshowData = (row) => {
  Object.keys(row).forEach((fItem) => {
    Object.keys(subForm).forEach((sItem) => {
      if (fItem === sItem) {
        subForm[sItem] = row[sItem]
      }
    })
  })
}
// 修改请求
let updateReq = () => {
  return axiosReq({
    url: '/system/user/updateUser',
    data: subForm,
    method: 'post',
    bfLoading: true
  }).then(() => {
    elMessage('更新成功')
    emit('selectPageReq')
    emit('hideComp')
  })
}

/*3.弹框相关*/
const { dialogTitle, dialogVisible } = useCommon()
let showModal = (isEdit, detailData) => {
  if (isEdit) {
    dialogTitle.value = `编辑【${detailData.userName}】`
    dialogVisible.value = true
    reshowData(detailData)
  } else {
    dialogTitle.value = '添加【员工】'
    dialogVisible.value = true
  }
}

//关闭弹框
let closeFormModal = () => {
  emit('hideComp')
}

//导出内部组件属性
defineExpose({
  showModal
})
//导出属性到页面中使用
// let {levelList} = toRefs(state);
</script>

<style scoped lang="scss">

</style>
