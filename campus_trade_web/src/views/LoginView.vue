<template>
  <div class="login-container">
    <div class="login-card">
      <div class="brand">
        <span class="logo-icon">🔄</span>
        <h1 class="logo-name">Campus<span>Trade</span></h1>
        <p class="subtitle">{{ isLogin ? '欢迎回来，校友' : '创建您的校园账号' }}</p>
      </div>

      <div class="form-group">
        <div class="input-wrapper">
          <span class="icon">👤</span>
          <input v-model="form.username" type="text" placeholder="用户名">
        </div>
        <div class="input-wrapper">
          <span class="icon">🔒</span>
          <input v-model="form.password" type="password" placeholder="密码">
        </div>
        <div v-if="!isLogin" class="input-wrapper animate-in">
          <span class="icon">🛡️</span>
          <input v-model="form.repassword" type="password" placeholder="确认密码">
        </div>
      </div>

      <button class="btn-submit" @click="handleSubmit" :disabled="loading">
        {{ loading ? '同步中...' : (isLogin ? '登录' : '立即注册') }}
      </button>

      <div class="footer-links">
        <a href="#" @click.prevent="toggleMode">
          {{ isLogin ? '没有账号？现在注册' : '已有账号？现在登录' }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLogin = ref(true)
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  repassword: '' // 确保拼写一致
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  form.username = ''
  form.password = ''
  form.repassword = ''
}


const handleSubmit = async () => {
  if (!form.username || !form.password) return alert('请填写完整信息')
  
  loading.value = true
  try {
    const res = await axios.post('http://localhost:8080/user/login', {
      username: form.username,
      password: form.password
    })

    // 1. 只要后端吐出了包含 "success" 的东西，我们就强制认为是登录成功
    const rawData = res.data;
    const isLoginSuccess = rawData === 'success' || (rawData && (rawData.code === 200 || rawData.msg === 'success' || rawData.code === 1));

    if (isLoginSuccess) {
      // 2. 准备用户信息
      let userData = { username: form.username, role: 'user' };
      if (typeof rawData === 'object' && rawData.data) {
        userData = rawData.data;
      }

      // 3. 核心：在这里做身份“强行分流”
      // 如果是 GlobalZhou 或者 role 是 admin，就去管理页
      if (form.username === 'GlobalZhou' || userData.role === 'admin') {
        userData.role = 'admin';
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 暴力跳转到管理页
        console.log("执行管理员跳转...");
        router.push('/admin').then(() => {
          console.log("路由跳转成功");
        }).catch(() => {
          window.location.href = '/admin'; // 最后的保底，直接刷新页面跳转
        });
        
      } else {
        // 普通学生去首页
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log("执行普通用户跳转...");
        router.push('/home').then(() => {
          console.log("路由跳转成功");
        }).catch(() => {
          window.location.href = '/home'; // 最后的保底
        });
      }
    } else {
      alert(rawData.msg || '登录失败，请检查账号密码');
    }
  } catch (err) {
    console.error("网络请求错误:", err);
    alert('连接服务器失败，请确保后端 8080 端口已开启');
  } finally {
    loading.value = false;
  }
}

</script>

<style scoped>
.login-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f7; font-family: -apple-system, sans-serif; }
.login-card { background: white; padding: 40px; border-radius: 24px; width: 340px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #d2d2d7; text-align: center; }
.brand { margin-bottom: 30px; }
.logo-icon { font-size: 40px; display: block; margin-bottom: 10px; }
.logo-name { font-size: 24px; font-weight: 700; color: #1d1d1f; }
.logo-name span { color: #0071e3; }
.subtitle { font-size: 13px; color: #86868b; margin-top: 5px; }
.form-group { margin-bottom: 25px; }
.input-wrapper { display: flex; align-items: center; background: #f5f5f7; margin-bottom: 12px; padding: 12px 15px; border-radius: 12px; border: 1px solid transparent; transition: all 0.2s; }
.input-wrapper:focus-within { border-color: #0071e3; background: white; }
.icon { margin-right: 10px; font-size: 14px; }
input { border: none; outline: none; width: 100%; font-size: 14px; background: transparent; }
.btn-submit { width: 100%; padding: 14px; border-radius: 12px; border: none; background: #0071e3; color: white; font-weight: 600; font-size: 15px; cursor: pointer; }
.btn-submit:disabled { opacity: 0.5; }
.footer-links { margin-top: 20px; }
.footer-links a { font-size: 13px; color: #0071e3; text-decoration: none; }
.animate-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>