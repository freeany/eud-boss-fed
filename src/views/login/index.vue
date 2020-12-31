<template>
  <section class="login">
    <header>
      <h1>
        <a href="/edu-boss-fed/#/" class="router-link-active" tabindex="-1">Edu boss管理系统</a>
      </h1>
    </header>
    <el-form class="login-form" label-position="top" ref="form" :rules="rules" :model="form" label-width="80px">
      <h2>登录</h2>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" @click="onSubmit" :loading="isLogining">登录</el-button>
      </el-form-item>
    </el-form>

    <footer>← 回到 <a href="https://edufront.lagou.com">用户端</a></footer>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
// 导入Form组件，ts验证规则
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data() {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      },
      isLogining: false // 登陆时网速过慢不允许重复点击的问题
    }
  },
  methods: {
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
          this.$router.push((this.$route.query.redirect as string) || '/')
          this.$message.success('登录成功')
        }
      } catch (error) {
        console.log(error, '登陆失败')
      } finally {
        this.isLogining = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  width: 95%;
  max-width: 22rem;
  margin: 1rem auto;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-direction: column;
  header {
    margin-bottom: 1rem;
    h1 {
      margin: 4.5rem 0 3.5rem;
      text-align: center;
      letter-spacing: 0.1em;
      a {
        margin: 0;
        color: rgba(0, 0, 0, 0.5);
        font-size: 3rem;
        font-weight: 300;
        text-decoration: none;
        transition: text-shadow 0.3s;
      }
    }
  }
  .login-form {
    display: block;
    margin-bottom: 2.5rem;
    padding: 1.875rem 1.25rem;
    background: #fff;
    h2 {
      margin: 0 0 1rem;
      font-weight: 400;
      font-size: 1.5rem;
    }
  }
  .login-btn {
    width: 100%;
  }

  footer {
    margin-bottom: 1rem;
    padding: 0.625rem;
    border: 0.0625rem solid rgba(0, 0, 0, 0.1);
    font-size: 0.75rem;
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
    a {
      color: inherit;
      text-decoration: none;
    }
  }
}
</style>
