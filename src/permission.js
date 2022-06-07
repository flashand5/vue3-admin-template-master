import router, { asyncRoutes } from '@/router'
import settings from './settings'
import { getToken, setToken } from '@/utils/auth'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false }) // NProgress 配置
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/getPageTitle'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import {usePersonStore} from "@/store/person";

const whiteList = ['/login', '/404', '/401'] // 没有重定向白名单
/**
 * 在router准备跳转前执行
 */
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  if (settings.isNeedNprogress) NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  if (!settings.isNeedLogin) setToken(settings.tmpToken)
  const hasToken = getToken()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const personStore = usePersonStore()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
    } else {
      //判断 isGetUserInfo
      const isGetUserInfo = permissionStore.isGetUserInfo
      if (isGetUserInfo) {
        next()
      } else {
        try {
          let accessRoutes = []
          if (settings.isNeedLogin) {
            // 获取用户信息
            // 注意：角色必须是对象数组！如：['admin'] 或 ,['developer','editor']
            const { roles } = await userStore.getInfo()
            accessRoutes = await permissionStore.generateRoutes(roles)
            let userName = {userName: userStore.userName };
            personStore.getPerson(userName)
          } else {
            accessRoutes = asyncRoutes
          }
          // 将 constRouters 和 accessRoutes 设置为 vuex ，以便 sideBar 使用
          permissionStore.M_routes(accessRoutes)
          // 动态添加可访问路由
          //router4 addRoutes 销毁
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          //已经获得用户信息
          permissionStore.M_isGetUserInfo(true)
          // hack 方法来确保 addRoutes 是完整的
          // 设置replace：true，所以导航不会留下历史记录
          next({ ...to, replace: true })
        } catch (err) {
          await userStore.resetState()
          next(`/login?redirect=${to.path}`)
          if (settings.isNeedNprogress) NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      if (settings.isNeedNprogress) NProgress.done()
    }
  }
})

router.afterEach(() => {
  if (settings.isNeedNprogress) NProgress.done()
})
