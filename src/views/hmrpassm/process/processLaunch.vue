<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
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
      <el-form-item label="是否允许转办" prop="ifTransfer" :rules="formRules.isNotNull" label-position="left">
        <el-select v-model="subForm.ifTransfer" clearable placeholder="是否允许转办" class="widthPx-150">
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="任务启用" prop="prctackStatus" v-if="subForm.taskId != ''" :rules="formRules.isNotNull" label-position="left">
        <el-switch
          v-model="Statusvalue"
          class="ml-2"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label="流程任务状态" prop="prctackStatus" :rules="formRules.isNotNull" label-position="left">
        <el-select v-model="subForm.prctackStatus" clearable placeholder="流程任务状态" class="widthPx-150">
          <el-option label="不执行" :value="0" />
          <el-option label="执行" :value="1" />
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
import { usePersonStore} from "@/store/person";
const personStore = usePersonStore()

const Statusvalue = ref(true)
const refForm = ref(null)

let subForm = reactive({
  prclaunchDesc: '',
  prclaunchPri: '',
  ifTransfer: '',
  prctackStatus: '',
  prcInfoId: '',
  taskId: '',
  personId: ''
})

// 确定事件
let confirmBtnClick = () => {
  refForm.value.validate((valid) => {
    if (valid) {
        subForm.personId = personStore.personId;
        if (subForm.taskId === ''){
          subForm.prctackStatus = 0;
        }else if (Statusvalue.value){
          subForm.prctackStatus = 1;
        } else {
          subForm.prctackStatus = 0;
        }
        insertReq()
    } else {
      return false
    }
  })
}

const { elMessage, formRules, elConfirm } = useElement()
// 新增请求
const insertReq = () => {
  const data = JSON.parse(JSON.stringify(subForm))
  console.log(data)
  axiosReq({
    url: '/system/processlaunch/createLaunch',
    data: data,
    method: 'post',
    bfLoading: true
  }).then((res) => {
    elMessage('流程发起成功，可在【我的流程】查看')
    emit('hideComp')
  })
}

// 接收父组件的方法
const emit = defineEmits([ 'hideComp'])

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

/*3.弹框相关*/
const { dialogTitle, dialogVisible } = useCommon()
let showModal = (detailData) => {
  console.log(detailData)
  dialogTitle.value = `发起流程【${detailData.prcInfoTitle}】`
  dialogVisible.value = true
  reshowData(detailData)
}
//关闭弹框
let closeFormModal = () => {
  emit('hideComp')
}

//导出内部组件属性
defineExpose({
  showModal
})
</script>

<style scoped>

</style>
