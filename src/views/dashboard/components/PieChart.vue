<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script setup>
import { useUserStore } from '@/store/user'
import {usePersonStore} from "@/store/person"
import { onMounted, getCurrentInstance, reactive, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
//获取store和router
defineProps({
  className: {
    type: String,
    default: 'chart'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '300px'
  }
})
const state = reactive({
  chart: null
})

//const routes = computed(() => {
//  });
// watch(() => props.name, (oldValue,newValue) => {
//
//   },
//   { immediate: true }
// );

// const store = useStore()
// const router = useRouter()

let searchForm = reactive({
  app0: 0,
  app1: 0,
  app2: 0,
  app3: 0,
  app4: 0,
})

onMounted(() => {
  nextTick(() => {
    selectPageReq()
    initChart()
  })
})

const userStore = useUserStore()
const personStore = usePersonStore()
const getSearchData = () => {
  // 用map实现动态键值对
  const mapObject = new Map();
  mapObject.set("userId",userStore.userId)
  mapObject.set("personId",personStore.personId)
  // 转成对象再赋值
  const data = Object.assign(Object.fromEntries(mapObject.entries()))
  // 清除空值
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  return data
}

// 统计数据接口
let selectPageReq = () => {
  let reqConfig = {
    url: '/system/user/countProval',
    method: 'post',
    data: getSearchData(),
    isParams: false,
    isAlertErrorMsg: false
  }
  axiosReq(reqConfig).then((resData) => {
    for (let i = 0;i < resData.data.all.length; i++){
      if (resData.data.all[i].prclaunchStatus === 0){
        searchForm.app0 = resData.data.all[i].num
      }else if (resData.data.all[i].prclaunchStatus === 1){
        searchForm.app1 = resData.data.all[i].num
      }else if (resData.data.all[i].prclaunchStatus === 2){
        searchForm.app2 = resData.data.all[i].num
      }else if (resData.data.all[i].prclaunchStatus === 3){
        searchForm.app3 = resData.data.all[i].num
      }else {
        searchForm.app4 = resData.data.all[i].num
      }
    }
    console.log(searchForm)
    initChart()
  })
}

onBeforeUnmount(() => {
  if (!state.chart) {
    return
  }
  state.chart.dispose()
  state.chart = null
})

const { proxy } = getCurrentInstance()
const initChart = () => {
  state.chart = echarts.init(proxy.$el, 'macarons')
  state.chart.setOption({
    title: {
      text: '总流程状态占比',
      left: 'left',
      top: 5,
      textStyle: {
        color: '#ccc'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      left: 'center',
      bottom: '10',
      data: ['审批中', '已完成', '待执行', '被驳回', '状态异常']
    },
    series: [
      {
        name: '流程状态统计',
        type: 'pie',
        roseType: 'radius',
        radius: [15, 95],
        center: ['50%', '38%'],
        data: [
          { value: searchForm.app0, name: '审批中' },
          { value: searchForm.app3, name: '已完成' },
          { value: searchForm.app1, name: '待执行' },
          { value: searchForm.app2, name: '被驳回' },
          { value: searchForm.app4, name: '状态异常' }
        ],
        animationEasing: 'cubicInOut',
        animationDuration: 2600
      }
    ]
  })
}
</script>

<style scoped lang="scss"></style>
