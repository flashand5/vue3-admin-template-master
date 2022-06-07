<template>
<!--  流程展示-->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    :before-close="closeFormModal"
  >
    <el-card style="overflow-y: auto; height: 600px">
      <h2>模板信息</h2>
      <el-card>
        流程分类：{{ procFrom.classifyName }}
         |
        模板编号：{{ procFrom.prcInfoId }}
        <p>模板标题：{{ procFrom.prcInfoTitle }}</p>
        模板描述：{{ procFrom.prcInfoDesc }}
        <p>模板备注：{{ procFrom.prcInfoRemark }}</p>
        <el-divider />
        任务名：{{ procFrom.prcTaskName }}
        <p>任务指令：{{ procFrom.prcTaskComm }}</p>
      </el-card>
      <h2>流程信息</h2>
      <el-card>
        流程描述：{{ procFrom.prclaunchDesc }}
        &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
        优先级：{{ procFrom.prclaunchPri }}
        <p>发起时间：{{ procFrom.prclaunchTime }}</p>
        允许转办：{{ procFrom.ifTransfer }}
        &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
        任务状态：{{ procFrom.prctackStatus }}
        &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
        流程状态：{{ procFrom.prclaunchStatus }}
        <p>发起人：{{ procFrom.personName }}</p>
      </el-card>
      <h2 class="h2-margin">步骤</h2>
      <el-card>
        <el-scrollbar>
          <div class="scrollbar-flex-content">
            <p v-for="(item,key) in nodeCount" :key="key" class="scrollbar-demo-item">
              <b class="b-line">步骤：{{ item }}</b>
            <b class="b-line">审批人：{{ procFrom.perId[item - 1] }}</b>
            <b class="b-line">状态：{{ procFrom.prcAppStat[item - 1] }}</b>
            </p>
          </div>
        </el-scrollbar>
      </el-card>
      <el-card>
        <div v-for="(val,key) in nodeCount" :key="key">
          <div v-if="active === (val - 1)">
            <p>步骤名称：{{ procFrom.infoName[val - 1] }}</p>
            <p>步骤描述：{{ procFrom.infoDesc[val - 1] }}</p>
            审批编号：{{ procFrom.prcAppId[val - 1] }}
            &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
            步骤序号：{{ procFrom.level[val - 1] }}0
            &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
            下一级：{{ procFrom.nextLevel[val - 1] }}
            <p>时间限制：{{ procFrom.nodecontTimeLimit[val - 1] }}</p>
            部门类型：{{ procFrom.departmentId[val - 1] }}
            &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
            退回：{{ procFrom.sendBack[val - 1] }}
            &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
            审批人：{{ procFrom.perId[val - 1] }}
            &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
            备选审批人：{{ procFrom.sparId[val - 1] }}
        <el-divider />
            <p>审批状态：{{ procFrom.prcAppStat[val - 1] }}</p>
            <p>审批意见：{{ procFrom.prcAppOp[val - 1] }}</p>
            <p>驳回原因：{{ procFrom.rej[val - 1] }}</p>
            <p>审批时间：{{ procFrom.prcAppTime[val - 1] }}</p>
          </div>
        </div>
      </el-card>
      <h2>审批历史</h2>
<!--      <el-card>-->
<!--        <el-timeline>-->
<!--          <el-timeline-item-->
<!--            v-for="index in procFrom.prcAppId.length"-->
<!--            :key="index"-->
<!--            :timestamp="Date.parse(procFrom.prcAppTime[index])"-->
<!--          >-->
<!--            步骤序号：{{ procFrom.classifyName }}-->
<!--            审批状态：{{ procFrom.classifyName }}-->
<!--            审批意见：{{ procFrom.classifyName }}-->
<!--            驳回原因：{{ procFrom.classifyName }}-->
<!--          </el-timeline-item>-->
<!--        </el-timeline>-->
<!--      </el-card>-->
      <el-button type="primary" @click="closeFormModal">关闭</el-button>
    </el-card>
  </el-dialog>
</template>

<script setup>
/*1.初始化引入和实例化*/
import { useCommon } from '@/hooks/global/useCommon'
// 接收父组件的方法
const emit = defineEmits(['hideComp'])

const refForm = ref(null)
const active = ref(0)

const { elMessage, formRules, elConfirm } = useElement()

//步骤数量
let nodeCount = ref(0);

let procFrom = reactive({
  classifyName: '',
  ifTransfer: '',
  prcInfoId: '',
  prcInfoTitle: '',
  prcInfoDesc: '',
  prcInfoRemark: '',
  prcTaskName: '',
  prcTaskComm: '',
  prclaunchDesc: '',
  prclaunchId: '',
  prclaunchPri: '',
  prclaunchStatus: '',
  prclaunchTime: '',
  prctackStatus: '',
  classifyId: '',
  nodecontId: [],
  level: [],
  nextLevel: [],
  nodecontTimeLimit: [],
  departmentId: [],
  sendBack: [],
  sendBackHandle: [],
  processinfoId: [],
  prcAppStat: [],
  prcAppOp: [],
  rej: [],
  prcAppTime: [],
  prcAppId: [],
  infoId: [],
  infoName: [],
  infoDesc: [],
  perId: [],
  sparId: []
})

//将父组件获得的数据放到子组件同名属性
const reshowData = (row) => {
  Object.keys(row).forEach((fItem) => {
    Object.keys(procFrom).forEach((sItem) => {
      if (fItem === sItem) {
        procFrom[sItem] = row[sItem]
      }
    })
  })
}

// 流程模板内容获取
const selectInfo = () => {
  axiosReq({
    url: '/system/processlaunch/selectAllLaunch',
    data: { prclaunchId: procFrom.prclaunchId },
    method: 'post',
    bfLoading: true
  }).then((resData) => {
    console.log(resData)
    elMessage('流程获取成功')
    procFrom.prcInfoId = resData.data.processinfo.prcInfoId
    procFrom.prcInfoDesc = resData.data.processinfo.prcInfoDesc
    procFrom.prcInfoRemark = resData.data.processinfo.prcInfoRemark
    procFrom.prcTaskName = resData.data.processtask.prcTaskName
    procFrom.prcTaskComm = resData.data.processtask.prcTaskComm
    procFrom.prclaunchPri = resData.data.processlaunch.prclaunchPri
    procFrom.prclaunchTime = resData.data.processlaunch.prclaunchTime
    procFrom.ifTransfer = resData.data.processlaunch.ifTransfer
    procFrom.prctackStatus = resData.data.processlaunch.prctackStatus
    procFrom.prclaunchStatus = resData.data.processlaunch.prclaunchStatus
    procFrom.personName = resData.data.processlaunch.personName
    nodeCount.value = resData.data.nodeconts.length
    for (let i = 0;i < resData.data.nodeconts.length; i++){
      //解决某些变量报错，手动赋值
      procFrom.level[i] = resData.data.nodeconts[i].nodecontLevel
      procFrom.nextLevel[i] = resData.data.nodeconts[i].nodecontNextLevel
      procFrom.infoId[i] = resData.data.nodeinfos[i].nodeinfoId
      procFrom.infoName[i] = resData.data.nodeinfos[i].nodeinfoName
      procFrom.infoDesc[i] = resData.data.nodeinfos[i].nodeinfoDesc
      procFrom.perId[i] = resData.data.procs[i].personId
      procFrom.sparId[i] = resData.data?.procs[i].sparePersonId
      if (i < resData.data.processapprovals.length){
        procFrom.prcAppId[i] = resData.data?.processapprovals[i].prcApprovalId
        procFrom.rej[i] = resData.data?.processapprovals[i].rejectReason
        procFrom.prcAppOp[i] = resData.data?.processapprovals[i].prcApprovalOpin
        procFrom.prcAppStat[i] = resData.data?.processapprovals[i].prcApprovalStatus
        procFrom.prcAppTime[i] = resData.data?.processapprovals[i].prcApprovalTime
      }
      Object.keys(resData.data.classify).forEach((fItem) => {
        Object.keys(procFrom).forEach((sItem) => {
          if (fItem === sItem) {
            procFrom[sItem] = resData.data.classify[sItem]
          }
        })
      })
      Object.keys(resData.data.nodeconts[i]).forEach((fItem) => {
        Object.keys(procFrom).forEach((sItem) => {
          if (fItem === sItem) {
            procFrom[sItem][i] = resData.data.nodeconts[i][sItem]
          }
        })
      })
      Object.keys(resData.data.nodeinfos[i]).forEach((fItem) => {
        Object.keys(procFrom).forEach((sItem) => {
          if (fItem === sItem) {
            procFrom[sItem][i] = resData.data.nodeinfos[i][sItem]
          }
        })
      })
    }
  })
}

/*3.弹框相关*/
const { dialogTitle, dialogVisible } = useCommon()
let showModal = (isEdit, detailData) => {
  dialogTitle.value = `流程【${detailData.prcInfoTitle}】内容`
  dialogVisible.value = true
  reshowData(detailData)
  selectInfo()
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
.scrollbar-flex-content {
  display: flex;
}
.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 80px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
  cursor: pointer;
}
.h2-margin{
  padding-top: 5px;
  padding-bottom: 5px;
}
.b-line{
  display: block;
}
</style>
