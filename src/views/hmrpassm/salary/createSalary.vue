<template>
  <el-row>
    <el-col>
      <el-card>
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
import { ref, reactive } from 'vue'
import {usePersonStore} from "@/store/person";
const { elMessage, formRules, elConfirm } = useElement()

const personStore = usePersonStore()
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
//动态计算总和
let autoTotal = () => {
  total.value = parseInt(subForm.salaryFixed)+parseInt(subForm.salaryMerit)+parseInt(subForm.salarySeniority)+parseInt(subForm.salaryAllowance)+parseInt(subForm.salaryBenefit)+parseInt(subForm.salarySubsidy)+parseInt(subForm.salaryOrder)
}

// 确定事件
let sendBtnClick = () => {
  const data = JSON.parse(JSON.stringify(subForm))
  axiosReq({
    url: '/system/salary/createSalary',
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
