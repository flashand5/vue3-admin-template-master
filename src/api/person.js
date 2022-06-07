
import request from "@/utils/axiosReq";
// 获取角色接口
export function getPersonReq(data) {
  return request({
    url: '/system/user/getUserInfo',
    data,
    bfLoading: false,
    method: 'post',
    isAlertErrorMsg: false
  })
}
