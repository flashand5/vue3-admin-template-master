<template>
  <div class="scroll-y">
    <!--    <teleport to="body">-->
    <!--      <div>i come from ErrorLogTest.vue</div>-->
    <!--    </teleport>-->
    <div class="mt-2">throw unhandledrejection</div>
    <el-button type="primary" @click="handle">unhandledrejection</el-button>

    <div class="mt-2">throw console.error</div>
    <el-button type="primary" @click="consoleErrorFun">控制台异常</el-button>

    <div class="mt-2">throw normalError</div>
    <el-button type="primary" @click="normalError">标准异常</el-button>

    <!--req relative-->
    <div class="mt-2">throw req cross origin</div>
    <el-button type="primary" @click="reqCrossOrigin">reqCrossOrigin</el-button>
    <div class="mt-2">抛出请求 404 异常</div>
    <el-button type="primary" @click="req404">请求404</el-button>
    <!-- resource load error   -->
    <div class="mt-2">抛出图像加载异常</div>
    <el-button type="primary" @click="errorLogImg">图像加载异常</el-button>
    <!--image load error demo-->
    <img v-if="imgShow" src="http://img.png" />
  </div>
</template>

<script setup>
const appStore = useAppStore()
let settings = computed(() => {
  return appStore.settings || {}
})

const handle = () => {
  new Promise((resolve, reject) => {
    reject('reject promise')
  }).then((res) => {
    console.log('ok')
  })
}

let flag = ref(null)

//发出控制台异常事件
const consoleErrorFun = () => {
  console.error('console.error')
}

//抛出标准异常事件
const normalError = () => {
  throw new Error(' throw new Error("")\n')
}
let reqCrossOrigin = () => {
  axiosReq({
    baseURL: 'http://8.135.1.141/micro-service-test',
    url: '/integration-front/brand/updateBy',
    data: { id: 'fai' },
    method: 'put',
    isParams: true,
    bfLoading: true
  }).then(() => {})
}

import axiosReq from '@/utils/axiosReq'
import { useAppStore } from '@/store/app'
let req404 = () => {
  axiosReq({
    // baseURL: 'http://8.135.1.141/micro-service-test',
    url: '/integration-front/brand/updateBy1',
    data: { id: 'fai' },
    method: 'put',
    isParams: true,
    bfLoading: true
  }).then((res) => {})
  //the error will collection to unhandledrejection if you  no catch
  // .catch((err) => {})
}

//图像加载异常测试
let imgShow = ref(false)
const errorLogImg = () => {
  imgShow.value = !imgShow.value
}
</script>

<style scoped lang="scss"></style>
