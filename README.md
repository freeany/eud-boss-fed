# edu-boss-fed

1. .editorconfig 的配置
2. note 笔记中没有的

## 使用 TypeScript 开发 vue 项目

## 在 vue 项目中启用 TypeScript 支持

```js
两种方式
（1） 全新的项目： 使用vue-cli 脚手架工具创建vue项目
（2） 已有项目： 添加vue官方配置的TypeScript插件
      使用@vue/cli 安装TypeScript插件
      vue add @vue/typescript
```

## 关于编译器

要使用 TypeScript 开发 vue 应用程序， 我们强烈建议您使用 vscode， 它为 ts 提供了极好的开箱即用支持，如果你正在使用单文件组件（SFC）， 可以安装提供 SFC 支持以及其他更多实用的 Vetur 插件。

TypeScript 相关配置介绍
（1） 安装了 TS 相关的依赖
dependencies 依赖
依赖项 说明
vue-class-component 提供使用 class 语法写 vue 组件
vue-property-decorator 在 class 语法基础上提供了一些辅助修饰器

dependencies 依赖：
依赖项 说明
@typescript-eslint/eslint-plugin 使用 eslint 校验 ts 代码
@typescript-eslint/parse 将 ts 转换为 ast 供 eslint 校验使用
@vue/cli-plugin-typescript 使用 ts+ts-loader+fork-ts-checker-webpack-plugin 进行更快的类型检查。
@vue/eslint-config-typescript 兼容 eslint 的 ts 校验规则
typescript ts 编译器，提供类型校验和转换 js 功能

## shims-vue.d.ts 文件的作用

```js
// 主要用于ts识别.vue文件模块
// ts默认不支持导入.vue模块，这个文件告诉ts导入.vue文件模块都按照VueConstructor<Vue> 类型识别处理
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
```

## shims-tsx.d.ts

```js
// 为jsx组件模版补充类型的声明
import Vue, { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
```

## ts 模块

TypeScript 模块都使用.ts 后缀

## 定义组件的方式

## 使用 options APIs

- 组件仍然可以使用以前的方式定义(导出组件选项对象，或者使用 Vue.extend())
- 但是当我们导出的是一个普通对象，此时 ts 无法推断出对应的类型
- 至于 vscode 可以推断出类型成员的原因是因为我们使用了 vue 插件
- 这个插件明确知道我们这里导出的是一个 vue 对象
- 所以我们必须使用 Vue.extends() 方法确保 TypeScript 能够有正常的类型推断

```js
const Component = {
  //  这里不会有类型推断
  // 因为ts不能确认这是vue组件的选项
}
```

## 关于装饰器语法

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class App extends Vue {
  a = 1
  b = '1'
  c = []
  test() {
    console.log(this.b, this.c)
    // console.log(this.b.test()) // 在运行期间就报错了
  }
}
```

> 装饰器是 es 草案的一个新特性， 不过这个草案可能会发生重大调整，所以不建议在生产环境中使用。

@Component 是一个名称叫 Component 的函数，装饰到类上之后会将这个类作为函数的参数，然后执行一次 Component 函数

经过我们查阅发现 vue-class-component 的写法有些繁琐，所以这里扩展一下另外一个基于 vue-class-component 的插件
https://github.com/kaorun343/vue-property-decorator 使用这个插件之后的写法更加方便和轻量。

## 总结

创建组件的三种方式

1. Options APIs

```js
// 1.  编译器给的类型提示
// 2.  ts编译期间的类型验证
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  data() {
    return {
      a: 1,
      b: '2'
    }
  },
  methods: {
    handleClick() {
      this.a.test() // 在编译期间就报错了
    }
  }
})
```

2. class APIs

```js
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class App extends Vue {
  a = 1
  b = '1'
  c = []
  test() {
    console.log(this.b, this.c)
    // console.log(this.b.test()) // 在运行期间就报错了
  }
}
```

3. class APIs + decorator

```js
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Prop(Number) readonly propA: number | undefined
  @Prop({ default: 'default value' }) readonly propB!: string
  @Prop([String, Boolean]) readonly propC: string | boolean | undefined
}
```

个人建议： No class APIs， 只使用 Options APIs

> Class 语法仅仅是一种写法而已，最终还是要转换成普通的数据结构。
> 装饰器语法还没有正式发布，建议了解即可，正式发布之后在选择使用也可。

使用 options APIs 最好是使用 `export default Vue.extends({...})` 而不是 `export default {...}`





interface 报错

```js
Expected a semicolon  @typescript-eslint/member-delimiter-style
```

.eslintrc.js中rules添加一行

` '@typescript-eslint/member-delimiter-style': 'off'`





## 项目

1. 最外层的布局容器， 需要左侧菜单栏和头部header保持固定，动态变化路由的内容

   ```html
     <div class="Layout">
       <el-container>
         <el-aside>
           <!-- 左侧边栏 - 保持 -->
           <app-aside></app-aside>
         </el-aside>
         <el-container>
           <el-header>
             <!-- 头部 - 保持 -->
             <app-header></app-header>
           </el-header>
           <el-main>
             <!-- 路由的内容 - 随路由的变化而变化 -->
             <router-view />
           </el-main>
         </el-container>
       </el-container>
     </div>
   ```

2. 登录的操作

   1. 表单验证
   2. 开启登录按钮的loading状态
   3. 验证通过提交表单
   4. 处理请求结果
      1. 失败，给出提示
      2. 成功
         1. 将登录成功后拿到的登录状态存到vuex容器中能够全局访问
         2. 跳转原来的页面或者首页
         3. 在访问需要登录的页面的时候判断有没有登录状态（路由拦截器）
         4. 提示登录成功
   5. 不管成功或失败关闭登录按钮的loading状态

   本地存储只是为了持久化登录状态，防止用户刷新vuex丢失的问题，接口需要的token与路由权限判断vuex中是否存储了登录接口的数据，都是与vuex进行对接的。

   **登录的处理函数**

   ```js
   async onSubmit() {
       this.isLogining = true // 登陆时网速过慢不允许重复点击的问题, 登录按钮上添加:loading="isLogining"
       try {
           await (this.$refs.form as Form).validate() // 表单校验的方法返回promise，失败则抛出异常
           const { data } = await login(this.form)
           if (data.state !== 1) {
               // 接口返回 登陆失败
               this.$message.error(data.message)
           } else {
               // 登录成功
               // 将用户状态保存到vuex中
               this.$store.commit('setUser', data.content)
               this.$router.push(this.$route.query.redirect as string || '/')
               this.$message.success('登录成功')
           }
       } catch (error) {
           console.log(error, '登陆失败')
       } finally {
           this.isLogining = false
       }
   }
   ```

   **全局路由前置守卫**

   ```js
   // 全局前置守卫：任何页面的访问都要经过这里
   // to：要去哪里的路由信息
   // from：从哪里来的路由信息
   // next：通行的标志
   router.beforeEach((to, from, next) => {
     // to.matched 是一个数组（匹配到是路由记录), 会匹配到to去往的那个路由的及其所有的祖先路由
     // 如果路由的meta标签上写了requiresAuth: true，则这个路由及其子路由只有登录才能访问。如果没写，则都可以访问
     if (to.matched.some(record => record.meta.requiresAuth)) {
       if (!store.state.user) {
         // 跳转到登录页面
         next({
           name: 'login',
           query: {
             // 通过 url 传递查询字符串参数
             redirect: to.fullPath // 把登录成功需要返回的页面告诉登录页面
           }
         })
       } else {
         next() // 允许通过
       }
     } else {
       next() // 允许通过
     }
   })
   ```

   封装请求模块

   ```js
   interface User {
     phone: string
     password: string
   }
   
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
   ```



#### ts引入图片

https://blog.csdn.net/yozora999/article/details/106410133

使用ts编译的文件，无法使用图片资源，需要手动配置声明文件，声明图片

1. 新建一个ts声明文件：images.d.ts

   ```js
   declare module '*.svg'
   declare module '*.png'
   declare module '*.jpg'
   declare module '*.jpeg'
   declare module '*.gif'
   declare module '*.bmp'
   declare module '*.tiff'
   ```

2. 将images.d.ts配置到tsconfig.json中：

   ```js
   "include": [
   	"./typings/images.d.ts" //文件路径
   ]
   ```



#### 处理token过期

- 如果token设置的过期时间比较短，那么会让用户频繁的去登录，显然不好，为什么access_token会设置的比较短呢？这是因为安全的问题。因为token代表了用户的标识，假如用户的token遭到了泄露，就不好了，将token过期时间设置比较短的话，可以减少风险。但是如果真正的用户操作的话，如果过期了那么可以尝试使用refresh_token获取一个新的token来进行后续的操作。

  - 方法一： 在请求发起前拦截每个请求，判断token的有效时间是否已经过期，若已经过期，则将请求挂起，先刷新token后再继续请求

    ```js
    优点： 在请求前拦截，能节省请求，省流量
    缺点:  需要后端额外提供一个token过期的时间段，使用了本地时间判断，若本地时间被篡改，特别是本地时间比服务器时间慢，拦截会失败。
    ```

    

  - 方法二：不在请求前拦截，而是拦截返回后的数据，先发起请求，接口返回过期后，先刷新token，再进行一次尝试。

    ```js
    优点：不需要额外的token过期字段，不需要判断时间
    缺点：会消耗多一次请求，耗流量
    ```

  - 综上： 方法一和方法二优缺点是互补的，方法一有校验失败的风险（本地时间被篡改时，当然也没有用户闲的去改本地时间），方法二更简单粗暴，等知道服务器已经过期了再重试一次，只是会多消耗一次请求。



#### token和refreshToken的关系

```js
传统的认证方式一般采用cookie/session来实现，这是我们的出发点。

1.为什么选用token而不选用cookie/session？
本质上token和cookie/session都是字符串，然而token是自带加密算法和用户信息(比如用户id)，；而cookie本身不包含用户信息，它指向的是服务器上用户的 session，而由session保存用户信息。这点差别，决定token可以很容易的跨服务器，只要不同服务器实现相同解密算法即可；而cookie/session是存在于某一台服务器上，

要实现跨服务器比较困难，这是任何基于cookie/session应用天生的短板。

2.token需要过期时间吗？
token即是获取受保护资源的凭证，当然必须有过期时间。否则一次登录便可永久使用，认证功能就失去了其意义。非但必须有个过期时间，而且过期时间还不能太长，

参考各个主流网站的token过期时间，一般不超过1h.

3.token过期该怎么办？
token过期，就要重新获取。那么重新获取有两种方式，一是重复第一次获取token的过程(比如登录，扫描授权等)，这样做的缺点是用户体验不好，每一小时强制登录一次几乎是无法忍受的。那么还剩第二种方法，那就是主动去刷新token. 主动刷新token的凭证是refresh token，也是加密字符串，并且和token是相关联的。相比获取各种资源的token，refresh token的作用仅仅是获取新的token，因此其作用和安全性要求都大为降低，所以其过期时间也可以设置得长一些。

4.refresh token需要过期时间么？
客户端需要保存token和refresh token，以便下一次访问能继续。如果客户端是浏览器，那么两个token都需要设置过期时间；但是可以设置得长一点，可以以天为单位（例如7天、15天）；如果客户端是一个服务器，那么refresh token可以永久有效，直到下一次登录，refresh token本身被更新为止。

以上几个问题是层层递进的，虽说如此，也无法从逻辑上/理论上保证认证系统的绝对安全。但是，我觉得任何一种认证方式，都不能做到逻辑上的绝对安全和毫无漏洞。但是如果给攻击者造成了足够的麻烦，使其破解成本大大提升，那么我们就认为认证系统足够安全了。认证功能最后的落地实现，总是和现实想妥协的结果。
```

-  token 每次都传,  为了在多次传输中被劫获,  所以要隔一段时间换一下， refresh  token  因为不是每次都被传,  所以被 劫获 的可能也小一些。还是那句话，安全是相对的。



### 用户与权限

权限

	1. 不同的用户能看到的菜单是不一样的。
 	2. 不同的用户所能操作的资源也不一样。 资源就是接口，即该用户有没有对接口的使用权限。
 	3. 用户可以分配不同的角色，角色有不同的权限。权限代表可以操作的菜单和资源。
 	4. 角色：权限的一个分组。每个角色有菜单和资源，角色可以分配菜单和资源。拥有这个角色的用户就可以看到和使用分配的菜单和资源了。
 	5. 菜单： 可以添加和修改和删除菜单
 	6. 资源： 添加、编辑、删除资源
 	7. 用户： 分配角色，禁用此用户

分析模块开发流程

1. 用户依赖角色，但是角色依赖菜单和资源，所以先做菜单 -- 资源 -- 角色 -- 用户



#### 开发菜单

1. menu和menu-create路由页面。