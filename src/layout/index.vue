<template>
  <div class="Layout">
    <el-container>
      <el-aside>
        <app-aside></app-aside>
      </el-aside>
      <el-container>
        <el-header>
          <app-header></app-header>
        </el-header>
        <el-main>
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
