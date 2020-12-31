/**
 * 用户请求的相关模块
 */
import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

// 登录接口
export const login = (data: User) => {
  // 如果 data 是普通对象，则 Content-Type 是 application/json
  // 如果 data 是 qs.stringify(data) 转换之后的数据：key=value&key=value，则 Content-Type 会被设置为 application/x-www-form-urlencoded
  // 如果 data 是 FormData 对象，则 Content-Type 是 multipart/form-data
  // axios默认的Content-type是application/json
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data)
  })
}

// 获取用户基本信息接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 退出的接口
// 退出的接口在后台处理应该是直接让该token过期。
export const logout = () => {
  return request({
    method: 'GET',
    url: '/front/user/logout'
  })
}
