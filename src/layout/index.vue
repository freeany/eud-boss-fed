<template>
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
</template>
<script lang="ts">
import Vue from 'vue'
import appAside from './components/app-aside.vue'
import appHeader from './components/app-header.vue'
export default Vue.extend({
  name: 'layoutIndex',
  components: {
    appAside,
    appHeader
  },
  data() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;
  // min-width: 980px;
}
.el-aside {
  background: #d3dce6;
}
.el-header {
  background: #fff;
}
.el-main {
  background: #e9eef3;
}
</style>
