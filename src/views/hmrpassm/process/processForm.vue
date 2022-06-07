<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    :before-close="closeFormModal"
  >
    <el-card>
<!--      顶部流程模板步骤条，可点击-->
      <el-steps :active="active" finish-status="success">
        <el-step class="step-style" @click="send($event)" title="开始流程" />
        <el-step class="step-style" @click="send($event)" title="审批步骤" />
        <el-step class="step-style" @click="send($event)" title="完成流程" />
      </el-steps>
      <el-button type="success" class="btn-1" @click="addNode" round>添加步骤</el-button>
      <el-button type="primary" class="btn-1" @click="submi" round>提交模板</el-button>
      <div v-if="active === 0">
        <el-form ref="refForm" label-width="150px" :inline="false" :model="subForm" :rules="formRules" class="pr-5">
          <el-form-item label="流程标题" prop="prcInfoTitle" :rules="formRules.isNotNull" label-position="left">
            <el-input v-model="subForm.prcInfoTitle" class="widthPx-150" placeholder="流程标题" />
          </el-form-item>
          <el-form-item label="流程描述" prop="prcInfoDesc" :rules="formRules.isNotNull" label-position="left">
            <el-input v-model="subForm.prcInfoDesc" class="widthPx-150" placeholder="流程描述" />
          </el-form-item>
          <el-form-item label="流程备注" prop="prcInfoRemark" :rules="formRules.isNotNull" label-position="left">
            <el-input v-model="subForm.prcInfoRemark" class="widthPx-150" placeholder="流程备注" />
          </el-form-item>
          <el-form-item label="流程状态" prop="prcInfoStatus" :rules="formRules.isNotNull" label-position="left">
            <el-select v-model="subForm.prcInfoStatus" clearable placeholder="流程状态" class="widthPx-150">
              <el-option label="审批中" :value="0" />
              <el-option label="待执行任务" :value="1" />
              <el-option label="流程被驳回" :value="2" />
              <el-option label="流程结束" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="分类编号" prop="classifyId" :rules="formRules.isNotNull" label-position="left">
            <el-input v-model="subForm.classifyId" class="widthPx-150" placeholder="分类编号" />
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active === 1" >
        <el-row class="el-row" justify="space-between">
          <!--流程节点条，可点击-->
          <el-col :span="5">
            <el-card class="el-card">
              <el-steps direction="vertical" :active="active1">
                <el-step v-for="(val,key) in nodeCount" class="step-style" @click="send1($event)" :key="key" :title="'步骤 '+val" />
              </el-steps>
          </el-card>
          </el-col>
          <!--流程步骤内容-->
          <el-col :span="18">
            <el-card class="el-card">
              <div v-for="(val,key) in nodeCount" :key="key">
                <div v-if="active1 === (val - 1)">
                  <h3>审批步骤 {{ val }}</h3>
                  <el-divider/>
                  <el-form ref="refNodeForm" label-width="150px" :inline="false" :model="subForm" :rules="formRules" class="pr-5">
                    <el-form-item label="流程步骤等级" prop="nodecontLevel" :rules="formRules.isNotNull" label-position="left">
                      <el-input v-model="subForm.nodecontLevel[val - 1]" class="widthPx-150" placeholder="流程步骤等级" disabled/>
                    </el-form-item>
                    <el-form-item label="下一级步骤等级" prop="nodecontNextLevel" :rules="formRules.isNotNull" label-position="left">
                      <el-input v-model="subForm.nodecontNextLevel[val - 1]" class="widthPx-150" placeholder="下一级步骤等级" disabled/>
                    </el-form-item>
                    <el-form-item label="步骤操作时限" prop="nodecontTimeLimit" :rules="formRules.isNotNull" label-position="left">
                      <el-input v-model="subForm.nodecontTimeLimit[val - 1]" class="widthPx-150" placeholder="步骤操作时限" />
                    </el-form-item>
                    <el-form-item label="办理人部门类型" prop="departmentId" :rules="formRules.isNotNull" label-position="left">
                      <el-input v-model="subForm.departmentId[val - 1]" class="widthPx-150" placeholder="办理人部门类型" />
                    </el-form-item>
                    <el-form-item label="是否允许退回" prop="sendBack" :rules="formRules.isNotNull" label-position="left">
                      <el-select v-model="subForm.sendBack[val - 1]" clearable placeholder="是否允许退回" class="widthPx-150">
                        <el-option label="允许" :value="0" />
                        <el-option label="不允许" :value="1" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="退回操作" prop="sendBackHandle" :rules="formRules.isNotNull" label-position="left">
                      <el-select v-model="subForm.sendBackHandle[val - 1]" clearable placeholder="退回操作" class="widthPx-150">
                        <el-option label="退回上一级" :value="0" />
                        <el-option label="退回创建者" :value="1" />
                        <el-option label="直接结束" :value="2" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="流程步骤名称" prop="nodeinfoName" :rules="formRules.isNotNull" label-position="left">
                      <el-input v-model="subForm.nodeinfoName[val - 1]" class="widthPx-150" placeholder="流程步骤名称" />
                    </el-form-item>
                    <el-form-item label="流程步骤描述" prop="nodeinfoDesc" :rules="formRules.isNotNull" label-position="left">
                      <el-input v-model="subForm.nodeinfoDesc[val - 1]" class="widthPx-150" placeholder="流程步骤描述" />
                    </el-form-item>
                    <el-form-item label="流程审批人编号" prop="nodeinfoDesc" :rules="formRules.isNotNull" label-position="left">
                      <el-input v-model="subForm.personId[val - 1]" class="widthPx-150" placeholder="流程步骤描述" />
                    </el-form-item>
                    <el-form-item label="备选审批人编号" prop="nodeinfoDesc" :rules="formRules.isNotNull" label-position="left">
                      <el-input v-model="subForm.sparePersonId[val - 1]" class="widthPx-150" placeholder="流程步骤描述" />
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div v-if="active === 2">
        <el-form ref="refNodeForm" label-width="150px" :inline="false" :model="subForm" :rules="formRules" class="pr-5">
          <el-form-item label="流程任务编号" prop="taskId" :rules="formRules.isNotNull" label-position="left">
            <el-input v-model="subForm.taskId" class="widthPx-150" placeholder="流程任务编号" />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </el-dialog>
</template>

<script setup>

/*1.初始化引入和实例化*/
import { useCommon } from '@/hooks/global/useCommon'
// 接收父组件的方法
const emit = defineEmits(['selectPageReq', 'hideComp'])

const refForm = ref(null)
const active = ref(0)
const active1 = ref(0)

const { elMessage, formRules, elConfirm } = useElement()

//步骤数量
let nodeCount = ref(0);

let subForm = reactive({
  prcInfoId: '',
  prcInfoTitle: '',
  prcInfoDesc: '',
  prcInfoRemark: '',
  taskId: '',
  prcInfoStatus: '',
  classifyId: '',
  classifyName: '',
  nodecontId: [],
  nodecontLevel: [],
  nodecontNextLevel: [],
  nodecontTimeLimit: [],
  departmentId: [],
  sendBack: [],
  sendBackHandle: [],
  processinfoId: [],
  nodeinfoId: [],
  nodeinfoName: [],
  nodeinfoDesc: [],
  personId: [],
  sparePersonId: []
})

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

// 头部步骤条点击事件
const send = ( evnet ) => {
  active.value = evnet.explicitOriginalTarget.innerText - 1
}

// 侧面步骤条点击事件
const send1 = ( evnet ) => {
  active1.value = evnet.explicitOriginalTarget.innerText - 1
}

//添加步骤事件
const addNode = () => {
  nodeCount.value = nodeCount.value + 1
  //配置步骤等级和下一等级
  for (let i = 0; i < nodeCount.value; i++){
    subForm.nodecontLevel[i] = i - 1 + 2
    if (i - 1 + 2 < nodeCount.value){
      subForm.nodecontNextLevel[i] = i -1 + 3
    }else {
      subForm.nodecontNextLevel[i] = ""
    }
  }
}

//提交事件
const submi = () => {
      if (subForm.positionId) {
        // updateReq()
      } else {
        if (nodeCount.value === 0){
          elMessage(
            "当前模板未设置审批步骤，请添加步骤",
            'warning'
          )
        }else {
          insertReq()
        }
      }
}

// 流程模板添加请求
const insertReq = () => {
  const data = JSON.parse(JSON.stringify(subForm))
  console.log(data)
  delete data.prcInfoId
  axiosReq({
    url: '/system/processinfo/createProcess',
    data: data,
    method: 'post',
    bfLoading: true
  }).then((res) => {
    elMessage('流程模板保存成功')
    emit('selectPageReq')
    emit('hideComp')
  })
}

// 流程模板内容获取
const selectInfo = () => {
  axiosReq({
    url: '/system/processinfo/selectProcessInfo',
    data: { prcInfoId: subForm.prcInfoId },
    method: 'post',
    bfLoading: true
  }).then((resData) => {
    elMessage('流程模板获取成功')
    nodeCount.value = resData.data.nodeconts.length
    for (let i = 0;i < resData.data.nodeconts.length; i++){
      Object.keys(resData.data.nodeconts[i]).forEach((fItem) => {
        Object.keys(subForm).forEach((sItem) => {
          if (fItem === sItem) {
            subForm[sItem][i] = resData.data.nodeconts[i][sItem]
          }
        })
      })
      Object.keys(resData.data.nodeinfos[i]).forEach((fItem) => {
        Object.keys(subForm).forEach((sItem) => {
          if (fItem === sItem) {
            subForm[sItem][i] = resData.data.nodeinfos[i][sItem]
          }
        })
      })
      Object.keys(resData.data.procs[i]).forEach((fItem) => {
        Object.keys(subForm).forEach((sItem) => {
          if (fItem === sItem) {
            subForm[sItem][i] = resData.data.procs[i][sItem]
          }
        })
      })
    }
  })
}

/*3.弹框相关*/
const { dialogTitle, dialogVisible } = useCommon()
let showModal = (isEdit, detailData) => {
  if (isEdit) {
    dialogTitle.value = `编辑【${detailData.prcInfoTitle}】`
    dialogVisible.value = true
    reshowData(detailData)
    selectInfo()
  } else {
    dialogTitle.value = '添加【流程模板】'
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
</script>

<style scoped lang="scss">
.step-style{
  cursor: pointer;
}

.btn-1{
  margin-top: 20px;
  margin-bottom: 20px;
}

.el-row {
  margin-bottom: 20px;
  display:flex;
  flex-wrap: wrap;
}
.el-row  .el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all .5s;
}

</style>
