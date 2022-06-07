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
      <el-form-item label="流程描述" prop="prclaunchDesc" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.prclaunchDesc" class="widthPx-150" placeholder="流程描述" />
      </el-form-item>
      <el-form-item label="流程优先级" prop="prclaunchPri" :rules="formRules.isNotNull" label-position="left">
        <el-select v-model="subForm.prclaunchPri" clearable placeholder="流程优先级" class="widthPx-150">
          <el-option label="普通" :value="0" />
          <el-option label="重要" :value="1" />
          <el-option label="紧急" :value="2" />
        </el-select>
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
  prclaunchId: '',
  prclaunchDesc: '',
  prclaunchTime: '',
  prclaunchPri: '',
  ifTransfer: '',
  prctackStatus: '',
  prcInfoId: '',
  personId: ''
})
// 确定事件
let confirmBtnClick = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (subForm.prclaunchId) {
        updateReq()
      } else {
        elMessage('未获取到数据')
      }
    } else {
      return false
    }
  })
}
const { elMessage, formRules, elConfirm } = useElement()
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
    url: '/system/processlaunch/updateProcLaunch',
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
    dialogTitle.value = `编辑流程【${detailData.prclaunchId}】`
    dialogVisible.value = true
    reshowData(detailData)
  } else {
    elMessage('弹窗错误')
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

<style scoped>

</style>
