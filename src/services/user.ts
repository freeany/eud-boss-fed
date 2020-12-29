/**
 * 用户请求的相关模块
 */
import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string;
  password: string;
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data)
  })
}
