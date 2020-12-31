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

// 跳转到登录页
function redirectLogin() {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

// 刷新token的方法
function refreshToken() {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token 只能同时被使用1次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

let requests: Function[] = [] // 存储刷新 token 期间过来的 401 请求

// 定义是否正在刷新权限的变量，一个节流阀
let isRefreshing = false

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
        // 如果页面在同一时间都多个请求的话，那么这些请求都会401，那么会多次去刷新token，而且会多次去请求失败返回401的接口。refreshToken不能被连续调用两次, 否则第二次的content会返回null， 原因不明
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
        // 如果使用request发请求是因为这个接口的refresh_token如果无效或者过期会返回401从而造成死循环
        // 如果有 refresh_token 则尝试使用 refresh_token获取新的access_token

        if (!isRefreshing) {
          // 如果当三个请求同时发过来，第一个请求到这里正在刷新的过程中，那么其他的请求需要挂起到一个队列中。如果不挂起到队列中，那么在第一个请求正在刷新权限的时候，其他的请求就丢失了，不会将此失败的请求重新发出去了。
          isRefreshing = true // 将刷新状态置为正在刷新
          return refreshToken()
            .then(res => {
              if (!res.data.success) {
                throw new Error('刷新 Token 失败')
              }
              store.commit('setUser', res.data.content)
              // 成功之后， 将requests队列中的请求重新发出去。
              requests.forEach(cb => cb())
              // 仔细看request中的函数，执行函数，则执行resolve，状态不再pending
              // 都发出去了然后重置request队列
              requests = []
              return request(error.config) // error.config是401的配置信息
            })
            .catch(err => {
              console.log(err)
              Message.warning('登录已过期，请重新登录')
              store.commit('setUser', null)
              // 2. 跳转到登录页
              redirectLogin()
              return Promise.reject(error) // return不再继续执行
            })
            .finally(() => {
              isRefreshing = false // 重置刷新状态
            })
        }
        // 没有抛出异常则成功了，成功了 --> 把本此失败的请求重新发出去
        // 1. 把刷新拿到的新的 access_token 更新到容器和本地存储中
        // 2. 把本此失败的请求重新发出去
        // 失败了
        // 1. 把当前登录用户状态清除

        // 刷新状态下，把请求挂起放到 requests 数组中
        // 当在刷新状态下， 向外界返回promise，此promise被挂起，当token被重新刷新之后，在去逐个调用requests数组中的函数，执行resolve，这个时候此promise被resolve
        // 返回promise，此时外界(401的那个请求函数 ps: axios行为与浏览器无关， 在浏览器上不会显示被pending)一直被挂起，当执行requests数组中的函数的时候，状态被resolve
        return new Promise(resolve => {
          requests.push(() => {
            resolve(request(error.config))
          })
        })
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
