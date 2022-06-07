//https://blog.csdn.net/weixin_34865745/article/details/113992767
import request from '@/utils/axiosReq'
import setting from '@/settings'
import bus from '@/utils/bus'
import pack from '../../package.json'
import { jsErrorCollection } from 'js-errorlog-collection'
// 记录错误日志
const errorLogReq = (errLog) => {
  request({
    url: '/system/weberrlog/insert',
    data: {
      pageUrl: window.location.href,
      errorLog: errLog,
      browserType: navigator.userAgent,
      version: pack.version
    },
    method: 'post',
    bfLoading: false,
    isAlertErrorMsg: true
  }).then(() => {
    bus.emit('reloadErrorPage', {})
  })
}

export default function () {
  /*
   * 类型判断
   * base type  using 'type of'
   * Reference type using 'instance of'
   * recommend to reading https://www.jianshu.com/p/ddc7f189d130
   * */
  const checkNeed = () => {
    //获取.env上的环境变量
    const env = import.meta.env.VITE_APP_ENV
    const { errorLog } = setting
    if (typeof errorLog === 'string') {
      return env === errorLog
    }
    if (errorLog instanceof Array) {
      return errorLog.includes(env)
    }
    return false
  }
  console.log("是否开启日志记录："+checkNeed())
  if (checkNeed()) {
    // 记录全局日志
    jsErrorCollection({ runtimeError: true, rejectError: true, consoleError: true }, (errLog) => {
      errorLogReq(errLog)
    })
  }
}
