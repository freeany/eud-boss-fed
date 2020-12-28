<template>
  <div id="app">
    <h1>App.vue</h1>
    <router-view />

    <div class="text">hello world</div>
  </div>
</template>
<script>
// export default {
//   name: 'App',
//   data() {
//     return {
//       a: 1,
//       b: '2'
//     }
//   },
//   methods: {
//     handleClick() {
//       this.a.test()  // 这种写法只会在运行阶段报错
//     }
//   }
// }
</script>
<script lang="ts">
// 1.  编译器给的类型提示
// 2.  ts编译期间的类型验证
// import Vue from 'vue'

// export default Vue.extend({
//   name: 'App',
//   data() {
//     return {
//       a: 1,
//       b: '2'
//     }
//   },
//   methods: {
//     handleClick() {
//       this.a.test() // 在编译期间就报错了
//     }
//   }
// })
</script>

<script lang="ts">
// https://class-component.vuejs.org/
import Vue from 'vue'
import Component from 'vue-class-component'

interface foo {
  a: string
  b: number
}

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
</script>
<style lang="scss" scoped>
// @import '~@/styles/index.scss';
.text {
  color: $warning-color;
}
</style>
