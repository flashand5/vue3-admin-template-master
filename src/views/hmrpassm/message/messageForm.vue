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
      <el-form-item label="收信人" prop="receiveUserId" :rules="formRules.isInt" label-position="left">
        <el-input v-model="subForm.receiveUserId" class="widthPx-310" placeholder="收信人" />
<!--        <el-cascader-->
<!--          placeholder="选择收信用户"-->
<!--          :props="props"-->
<!--          :options="options"-->
<!--          filterable-->
<!--          @visible-change="getData($event)"-->
<!--        />-->
      </el-form-item>
      <el-form-item label="标题" prop="userMsgTitle" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.userMsgTitle" class="widthPx-310" placeholder="标题" />
      </el-form-item>
      <el-form-item label="内容" prop="userMsgContent" :rules="formRules.isNotNull" label-position="left">
        <el-input v-model="subForm.userMsgContent" type="textarea" :rows="20"  style="width: 100%" placeholder="内容" />
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
import { useUserStore } from '@/store/user'
// 接收父组件的方法
const emit = defineEmits(['selectPageReq', 'hideComp'])
const userStore = useUserStore()

/*2.modal新增和修改*/
//新增
const refForm = ref(null)
let subForm = reactive({
  userMsgId: '',
  userId: '',
  userMsgTitle: '',
  userMsgContent: '',
  receiveUserId: '',
})

// //动态加载级联选择数据
// let id = 0
// const props = {
//   lazy: true,
//   lazyLoad(node, resolve) {
//     const { level } = node
//     const nodes = Array.from({ length: level + 1 }).map((item) => ({
//       value: ++id,
//       label: `Option - ${id}`,
//       leaf: level >= 2,
//     }))
//     // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
//     resolve(nodes)
//   },
// }
//
// let options = [
//   {
//     value: '',
//     label: 'sdd',
//     children: []
//   }
// ]
// //级联选择器获取后台数据
// const getData = (callback) => {
//   if (callback){
//     let reqConfig = {
//       url: '/system/person/getAllPerson',
//       method: 'post',
//       isParams: false,
//       isAlertErrorMsg: false
//     }
//     axiosReq(reqConfig).then((resData) => {
//       console.log(resData)
//       options = resData.data.map(({ personId, personName }) => ({
//         value: personId,
//         label: personName,
//       }));
//       console.log(options)
//     })
//   }
// }

// 确定事件
let confirmBtnClick = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (subForm.userMsgId) {
        updateReq()
      } else {
        subForm.userId = userStore.userId
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
  delete data.userMsgId
  axiosReq({
    url: '/system/usermessage/sendMessage',
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
    url: '/system/usermessage/updateMsg',
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
    dialogTitle.value = `编辑【${detailData.userMsgTitle}】`
    dialogVisible.value = true
    reshowData(detailData)
  } else {
    dialogTitle.value = '发送【消息】'
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
