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

暂未解决

