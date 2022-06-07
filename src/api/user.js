import request from '@/utils/axiosReq'
// 用户通用接口

// 登录接口
export function loginReq(data) {
  return request({
    // url: '/integration-front/user/loginValid',
    url: '/login',
    data,
    method: 'post',
    bfLoading: false,
    isParams: false,
    isAlertErrorMsg: false
  })
}

// 获取角色接口
export function getInfoReq() {
  return request({
    url: '/system/role/getRole',
    bfLoading: false,
    method: 'post',
    isAlertErrorMsg: false
  })
}

// 退出登录接口
export function logoutReq() {
  return request({
    url: '/system/role/logOut',
    method: 'post'
  })
}
