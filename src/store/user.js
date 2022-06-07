import { loginReq, logoutReq, getInfoReq } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'
import router, { asyncRoutes } from '@/router'
import { defineStore } from 'pinia'
import { usePermissionStore } from '@/store/permission'
import { useTagsViewStore } from '@/store/tagsView'

let { elMessage } = useElement()

// 重置路由
const resetRouter = () => {
  const asyncRouterNameArr = asyncRoutes.map((mItem) => mItem.name)
  asyncRouterNameArr.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}
// 定义 Store
export const useUserStore = defineStore('user', {
  // 这里存数据，类似data
  state: () => {
    return {
      userId: '',
      userName: '',
      avatar: '',
      roles: []
    }
  },
// 这里存方法
  actions: {
    M_userid(userId) {
      this.$patch((state) => {
        state.userId = userId
      })
    },
    M_username(userName) {
      this.$patch((state) => {
        state.userName = userName
      })
    },
    M_roles(roles) {
      this.$patch((state) => {
        state.roles = roles
      })
    },

    // 登录方法
    login(data) {
      return new Promise((resolve, reject) => {
        loginReq(data)
          .then((res) => {
            if (res.code === 20000 || res.code === 200) {
              //commit('SET_Token', res.data?.jwtToken)
              setToken(res?.data)
              resolve(null)
            } else {
              reject(res)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // get user info 获取角色
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfoReq()
          .then((response) => {
            const { code } = response
            const { message } = response
            if (code === 200){
              const { data } = response
              if (!data) {
                return reject('Verification failed, please Login again.')
              }
              const { roles, userName ,userId } = data
              this.M_userid(userId)
              this.M_username(userName)
              this.M_roles(roles)
              resolve(data)
            }else {
              console.log("用户失效，返回主页")
              elMessage("code："+code+"message:"+message,"error")
              router.push(`/login?redirect=/`)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 用户登出
    logout() {
      return new Promise((resolve, reject) => {
        logoutReq()
          .then(() => {
            this.resetState()
            resolve(null)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 登出后清除状态
    resetState() {
      return new Promise((resolve) => {
        this.M_username('')
        this.M_roles([])
        removeToken() // 必须先删除  token
        resetRouter() // 重置 router
        const permissionStore = usePermissionStore()
        permissionStore.M_isGetUserInfo(false)
        const tagsViewStore = useTagsViewStore()
        tagsViewStore.delAllViews()
        resolve(null)
      })
    }
  }
})
