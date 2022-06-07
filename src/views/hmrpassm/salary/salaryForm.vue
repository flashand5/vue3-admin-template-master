<template>
  <!--  弹窗修改页面-->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    :before-close="closeFormModal"
  >
    <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm" :rules="formRules" @change="autoTotal" class="pr-5">
      <el-form-item label="固定工资" prop="salaryFixed" :rules="formRules.isInt" label-position="left">
        <el-input v-model="subForm.salaryFixed" class="widthPx-150" placeholder="固定工资" ><template v-slot:append>元</template></el-input>
      </el-form-item>
      <el-form-item label="绩效工资" prop="salaryMerit" :rules="formRules.isInt" label-position="left">
        <el-input v-model="subForm.salaryMerit" class="widthPx-150" placeholder="绩效工资" ><template v-slot:append>元</template></el-input>
      </el-form-item>
      <el-form-item label="工龄工资" prop="salarySeniority" :rules="formRules.isInt" label-position="left">
        <el-input v-model="subForm.salarySeniority" class="widthPx-150" placeholder="工龄工资" ><template v-slot:append>元</template></el-input>
      </el-form-item>
      <el-form-item label="补助" prop="salaryAllowance" :rules="formRules.isInt" label-position="left">
        <el-input v-model="subForm.salaryAllowance" class="widthPx-150" placeholder="补助" ><template v-slot:append>元</template></el-input>
      </el-form-item>
      <el-form-item label="业绩分享" prop="salaryBenefit" :rules="formRules.isInt" label-position="left">
        <el-input v-model="subForm.salaryBenefit" class="widthPx-150" placeholder="业绩分享" ><template v-slot:append>元</template></el-input>
      </el-form-item>
      <el-form-item label="补贴" prop="salarySubsidy" :rules="formRules.isInt" label-position="left">
        <el-input v-model="subForm.salarySubsidy" class="widthPx-150" placeholder="补贴" ><template v-slot:append>元</template></el-input>
      </el-form-item>
      <el-form-item label="其他" prop="salaryOrder" :rules="formRules.isInt" label-position="left">
        <el-input v-model="subForm.salaryOrder" class="widthPx-150" placeholder="其他" ><template v-slot:append>元</template></el-input>
      </el-form-item>
      <el-form-item label="总计" prop="total" label-position="left">
        <el-input v-model="total" class="widthPx-150" placeholder="总计" disabled><template v-slot:append>元</template></el-input>
      </el-form-item>
      <el-form-item label="薪酬发放时间" prop="salaryTime" :rules="formRules.isNotNull" label-position="left">
        <el-date-picker v-model="subForm.salaryTime" type="date" placeholder="薪酬发放时间" />
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
  salaryId: '',
  salaryTime: '',
  salaryFixed: 0,
  salaryMerit: 0,
  salarySeniority: 0,
  salaryAllowance: 0,
  salaryBenefit: 0,
  salarySubsidy: 0,
  salaryOrder: 0,
  personId: '',
})
let total = ref(subForm.salaryFixed+subForm.salaryMerit+subForm.salarySeniority+subForm.salaryAllowance+subForm.salaryBenefit+subForm.salarySubsidy+subForm.salaryOrder)
// 确定事件
let confirmBtnClick = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (subForm.salaryId) {
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
  delete data.salaryId
  axiosReq({
    url: '/system/salary/createSalary',
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
    url: '/system/salary/updateSalary',
    data: subForm,
    method: 'post',
    bfLoading: true
  }).then(() => {
    elMessage('更新成功')
    emit('selectPageReq')
    emit('hideComp')
  })
}

//动态计算总和
let autoTotal = () => {
  total.value = parseInt(subForm.salaryFixed)+parseInt(subForm.salaryMerit)+parseInt(subForm.salarySeniority)+parseInt(subForm.salaryAllowance)+parseInt(subForm.salaryBenefit)+parseInt(subForm.salarySubsidy)+parseInt(subForm.salaryOrder)
}

/*3.弹框相关*/
const { dialogTitle, dialogVisible } = useCommon()
let showModal = (isEdit, detailData) => {
  if (isEdit) {
    dialogTitle.value = `编辑工资编号【${detailData.salaryId}】`
    dialogVisible.value = true
    reshowData(detailData)
  } else {
    dialogTitle.value = '新增【工资条】'
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
