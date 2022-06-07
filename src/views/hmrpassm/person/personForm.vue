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
      <el-form-item label="员工姓名" prop="personName" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.personName" class="widthPx-150" placeholder="员工姓名" />
      </el-form-item>
      <el-form-item label="员工状态" prop="personStatus" :rules="formRules.isNotNull" label-position="left">
        <el-select v-model="subForm.personStatus" clearable placeholder="员工状态" class="widthPx-150">
          <el-option label="正常" :value="0" />
          <el-option label="休假" :value="1" />
          <el-option label="离职" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="员工入职时间" prop="personInducTime" :rules="formRules.isNotNull" label-position="left">
        <el-date-picker v-model="subForm.personInducTime" class="widthPx-150" value-format="YYYY-MM-DD hh:mm:ss" type="datetime" placeholder="员工入职时间" :shortcuts="shortcuts"/>
      </el-form-item>
      <el-form-item label="员工离职时间" prop="personQuitTime" label-position="left">
        <el-date-picker v-model="subForm.personQuitTime" class="widthPx-150" value-format="YYYY-MM-DD hh:mm:ss" type="datetime" placeholder="员工离职时间" :shortcuts="shortcuts"/>
      </el-form-item>
      <el-form-item label="职位编号" prop="positionId" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.positionId" class="widthPx-150" placeholder="职位编号" />
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
// 时间处理
const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

/*1.初始化引入和实例化*/
import { useCommon } from '@/hooks/global/useCommon'
// 接收父组件的方法
const emit = defineEmits(['selectPageReq', 'hideComp'])

/*2.modal新增和修改*/
//新增
const refForm = ref(null)
let subForm = reactive({
  personId: '',
  personName: '',
  personStatus: '',
  personInducTime: '',
  personQuitTime: '',
  positionId: '',
  positionName: '',
  departmentId: '',
  departmentName: ''
})
// 确定事件
let confirmBtnClick = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (subForm.personId) {
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
  delete data.personId
  axiosReq({
    url: '/system/person/createPerson',
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
    url: '/system/person/updatePerson',
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
    dialogTitle.value = `编辑【${detailData.personName}】`
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

<style scoped>

</style>
