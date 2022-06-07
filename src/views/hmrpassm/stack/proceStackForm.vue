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
      <el-form-item label="任务名称" prop="prcTaskName" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.prcTaskName" class="widthPx-150" placeholder="任务名称" />
      </el-form-item>
      <el-form-item label="任务信息" prop="prcTaskDesc" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.prcTaskDesc" class="widthPx-150" placeholder="任务信息" />
      </el-form-item>
      <el-form-item label="任务描述" prop="prcTaskInfo" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.prcTaskInfo" class="widthPx-150" placeholder="任务描述" />
      </el-form-item>
      <el-form-item label="任务指令" prop="prcTaskComm" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.prcTaskComm" :autosize="{ minRows: 5, maxRows: 40 }" type="textarea" class="widthPx-150" placeholder="任务指令" />
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
import { usePersonStore} from "@/store/person";
const personStore = usePersonStore()
const personId = computed( () => {
  return personStore.personId
})
// 接收父组件的方法
const emit = defineEmits(['selectPageReq', 'hideComp'])

/*2.modal新增和修改*/
//新增
const refForm = ref(null)
let subForm = reactive({
  prcTaskId: '',
  prcTaskName: '',
  prcTaskDesc: '',
  prcTaskInfo: '',
  prcTaskComm: '',
  personId: ''
})
// 确定事件
let confirmBtnClick = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (subForm.prcTaskId) {
        updateReq()
      } else {
        subForm.personId = personStore.personId;
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
  delete data.prcTaskId
  axiosReq({
    url: '/system/processtack/createProcesstack',
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
    url: '/system/processtack/updateProcesstack',
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
    dialogTitle.value = `编辑【${detailData.prcTaskName}】`
    dialogVisible.value = true
    reshowData(detailData)
  } else {
    dialogTitle.value = '添加【流程任务】'
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

<style scoped>

</style>
