import axios from 'axios'
import { Message } from 'element-ui'
import qs from 'qs'
import store from '@/store'
import router from '@/router'

const errorStatus = new Map([
  [400, () => Message.error('请求参数错误')],
  [403, () => Message.error('没有权限，请联系管理员')],
  [404, () => Message.error('请求资源不存在')]
  // [500, () => Message.error('服务端错误，请联系管理员')]
])

function redirectLogin() {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}
const request = axios.create({
  // 配置选项
  // baseURL,
  // timeout
})

// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    const { user } = store.state
    if (user && user.access_token) {
      config.headers.Authorization = user.access_token
    }
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
// 错误分两种，一种后台都返回的是200，但是会自定义状态码，另一种直接返回的是http状态码
request.interceptors.response.use(
  function(response) {
    // 状态码为2xx 都会进入这里
    // 对响应数据做点什么
    // console.log('请求响应成功了...', response)
    // 如果是自定义错误状态码。错误处理就写到这里
    return response
  },
  async function(error) {
    // 超出2xx状态码都执行这里
    // 对响应错误做点什么
    // 如果是使用的http状态码，错误处理就写到这里
    // 对错误的不同情况进行处理
    if (error.response) {
      const { status } = error.response
      // 请求发出去了，但是没有收到响应，状态码超出了2xx范围
      // 400 401 403 404 500
      // 具体的代码逻辑还是要看和后端约定的逻辑
      if (errorStatus.has(status)) {
        errorStatus.get(status)
      } else if (status >= 500) {
        Message.error('服务器错误，请联系管理员')
      } else if (status === 401) {
        // 需要单独进行处理, 使用refreshToken重新刷新权限
        // token 和 refreshToken 见readme
        // token无效（没有提供token、token是无效的，token过期了）
        if (!store.state.user) {
          // 如果连存储token的user都没有，
          // 那么直接跳转到登录页
          redirectLogin()
          return Promise.reject(error) // return不再继续执行
        }
        // 如果提供了token， 没有权限的话，说明token被修改或者无效了，尝试使用refreshToken获取新的token
        try {
          // 如果使用request发请求是因为这个接口的refresh_token如果无效或者过期会返回401从而造成死循环
          // 如果有 refresh_token 则尝试使用 refresh_token获取新的access_token
          const { data } = await axios.create()({
            method: 'POST',
            url: '/front/user/refresh_token',
            data: qs.stringify({
              refreshtoken: store.state.user.refresh_token
            })
          })
          // 没有抛出异常则成功了，成功了 --> 把本此失败的请求重新发出去
          // 1. 把刷新拿到的新的 access_token 更新到容器和本地存储中
          store.commit('setUser', data.content)
          // 2. 把本此失败的请求重新发出去
          return request(error.config) // error.config是401的配置信息
        } catch (err) {}
        // 失败了
        // 1. 把当前登录用户状态清除
        store.commit('setUser', null)
        // 2. 跳转到登录页
        redirectLogin()
        return Promise.reject(error) // return不再继续执行
      }
    } else if (error.request) {
      // 请求发出去了但是没有收到响应，比如请求超时、网络断开
      Message.error('请求超时，请刷新重试')
    } else {
      // 请求的时候，设置请求时触发了一个错误， 一般是未知的。
      Message.error(`请求失败：${error.message}`)
    }
    // 抛出异常, 扔给调用者
    return Promise.reject(error)
  }
)

export default request
