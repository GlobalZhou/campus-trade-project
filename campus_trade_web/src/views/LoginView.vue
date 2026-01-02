<template>
  <div class="apple-container">
    <div class="apple-card">
      <div class="header-section">
        <div class="app-logo">
          <div class="logo-circle"></div>
        </div>
        <h2>欢迎回来</h2>
        <p class="slogan">发现校园好物，开启绿色循环生活</p>
      </div>

      <div class="form-section">
        <div class="input-group">
          <label>账号</label>
          <input v-model="loginData.username" type="text" placeholder="学号 / 用户名" />
        </div>
        <div class="input-group">
          <label>密码</label>
          <input v-model="loginData.password" type="password" placeholder="请输入您的密码" @keyup.enter="doLogin" />
        </div>
      </div>

      <div class="button-section">
        <button class="primary-btn" @click="doLogin">登录</button>
        <button class="secondary-btn">创建新账号</button>
      </div>

      <div class="footer-section">
        <a href="#">忘记密码？</a>
        <span class="divider">|</span>
        <a href="#">隐私政策</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router' // 引入路由工具

const loginData = ref({ 
  username: '', 
  password: '' 
})

const router = useRouter() // 初始化

const doLogin = async () => {
  if (!loginData.value.username || !loginData.value.password) {
    alert('请填写完整的账号和密码')
    return
  }

  try {
    // 这里的地址对应后端的 8080 端口
    const response = await axios.post('http://localhost:8080/user/login', loginData.value)
    
    if(response.data.code === 200) {
      console.log('登录成功')
      // 关键步骤：成功后自动跳转到 /home
      router.push('/home') 
    } else {
      alert('登录失败：' + response.data.msg)
    }
  } catch (error) {
    console.error('请求异常：', error)
    alert('连接失败：请检查后端服务是否开启')
  }
}
</script>

<style scoped>
.apple-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f7;
  font-family: -apple-system, sans-serif;
  margin: 0;
}

.apple-card {
  width: 100%;
  max-width: 420px;
  padding: 50px 40px;
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.04);
  text-align: center;
}

.logo-circle {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #0071e3, #40a9ff);
  border-radius: 16px;
  margin: 0 auto 24px;
}

h2 {
  font-size: 28px;
  color: #1d1d1f;
  font-weight: 600;
  margin: 0 0 10px;
}

.slogan {
  font-size: 15px;
  color: #86868b;
  margin-bottom: 40px;
}

.input-group {
  text-align: left;
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 13px;
  color: #86868b;
  margin-left: 4px;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 16px;
  background: #f5f5f7;
  border: 1px solid transparent;
  border-radius: 14px;
  font-size: 16px;
  box-sizing: border-box;
  outline: none;
}

input:focus {
  background: #ffffff;
  border-color: #0071e3;
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}

.primary-btn {
  width: 100%;
  padding: 16px;
  background: #0071e3;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
}

.secondary-btn {
  width: 100%;
  padding: 16px;
  background: transparent;
  color: #0071e3;
  border: none;
  font-size: 15px;
  cursor: pointer;
  margin-top: 10px;
}

.footer-section {
  margin-top: 32px;
  font-size: 13px;
  color: #86868b;
}

.footer-section a { color: #06c; text-decoration: none; }
.divider { color: #d2d2d7; margin: 0 10px; }
</style>