<template>
  <div class="dashboard-container  scroll-y">
    <div class="dashboard-editor-container">
<!--      头部汇总标签-->
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="unprocess" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">待处理</div>
              <span class="card-panel-num">{{ searchForm.unAppro }}</span>
              <!--<count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />-->
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="unmessage" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">未读消息</div>
              <span class="card-panel-num">{{ searchForm.unRead }}</span>
              <!--<count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />-->
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="unstack" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">待执行</div>
              <span class="card-panel-num">{{ searchForm.unStack }}</span>
              <!--<count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />-->
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shopping">
              <svg-icon icon-class="sucess" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">已完成</div>
              <span class="card-panel-num">{{ searchForm.sucess }}</span>
              <!-- <CountTo :start-val="0" :end-val="13600" class="card-panel-num" />-->
            </div>
          </div>
        </el-col>
      </el-row>
<!--      汇总标签结束-->
      <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="chart-wrapper">
            <text-aec />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="chart-wrapper">
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="24">
          <div class="chart-wrapper">
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="8">
        <el-col
          :xs="{ span: 24 }"
          :sm="{ span: 24 }"
          :md="{ span: 24 }"
          :lg="{ span: 12 }"
          :xl="{ span: 12 }"
          style="padding-right: 8px; margin-bottom: 30px"
        >
        </el-col>
        <el-col
          :xs="{ span: 24 }"
          :sm="{ span: 12 }"
          :md="{ span: 12 }"
          :lg="{ span: 6 }"
          :xl="{ span: 6 }"
          style="margin-bottom: 30px"
        >
        </el-col>
        <el-col
          :xs="{ span: 24 }"
          :sm="{ span: 12 }"
          :md="{ span: 12 }"
          :lg="{ span: 6 }"
          :xl="{ span: 6 }"
          style="margin-bottom: 30px"
        >
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import TextAec from './components/PieChart.vue'
import {useUserStore} from "@/store/user";
import {usePersonStore} from "@/store/person";
import { onMounted, reactive } from 'vue'

let searchForm = reactive({
  sucess: 0,
  unAppro: 0,
  unRead: 0,
  unStack: 0,
  app0: 0,
  app1: 0,
  app2: 0,
  app3: 0,
})

onMounted(() => {
    selectPageReq()
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
    console.log(resData)
    searchForm.sucess = resData.data.sucess
    searchForm.unAppro = resData.data.unAppro
    searchForm.unRead = resData.data.unRead
    searchForm.unStack = resData.data.unStack
  })
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
