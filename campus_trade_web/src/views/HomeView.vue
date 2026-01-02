<template>
  <div class="home-container">
    <nav class="top-nav">
      <div class="nav-content">
        <div class="logo">CAMPUS<span>TRADE</span></div>
        <div class="nav-links">
          <a href="#">首页</a>
          <a href="#">电子产品</a>
          <a href="#">图书教材</a>
          <a href="#">生活用品</a>
        </div>
        <div class="user-control">
          <div class="user-badge">管理员</div>
          <button class="exit-link" @click="handleLogout">退出</button>
        </div>
      </div>
    </nav>

    <main class="main-wrapper">
      <header class="page-header">
        <h1 class="main-title">发现。<span>独一无二的好物</span></h1>
        <p class="section-desc">来自全校同学的精选闲置，品质生活触手可及。</p>
      </header>

      <div class="product-grid">
        <div class="apple-product-card" v-for="i in 8" :key="i">
          <div class="card-image">
            <div class="badge">新品</div>
            <div class="icon-box">📦</div>
          </div>
          <div class="card-content">
            <p class="category">电子产品</p>
            <h3 class="item-title">示例商品名称</h3>
            <div class="price-row">
              <span class="price">¥299</span>
              <button class="buy-btn">查看详情</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const handleLogout = () => {
  router.push('/')
}
</script>

<style scoped>
/* 全球通用苹果背景 */
.home-container {
  min-height: 100vh;
  background-color: #fbfbfd;
  font-family: -apple-system, "SF Pro Display", "PingFang SC", sans-serif;
  color: #1d1d1f;
  margin: 0;
}

/* 1. 顶栏：追求极简透明感 */
.top-nav {
  position: sticky;
  top: 0;
  width: 100%;
  height: 48px;
  background: rgba(251, 251, 253, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  z-index: 1000;
}

.nav-content {
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo { font-size: 16px; font-weight: 600; letter-spacing: 1px; }
.logo span { color: #86868b; font-weight: 400; }

.nav-links a {
  font-size: 12px;
  color: #424245;
  text-decoration: none;
  margin: 0 15px;
  transition: color 0.3s;
}
.nav-links a:hover { color: #0071e3; }

.user-control { display: flex; align-items: center; gap: 15px; }
.user-badge { font-size: 12px; background: #e8e8ed; padding: 2px 8px; border-radius: 4px; }
.exit-link { background: none; border: none; font-size: 12px; color: #06c; cursor: pointer; }

/* 2. 标题区：追求大标题张力 */
.main-wrapper { max-width: 1000px; margin: 0 auto; padding: 80px 20px; }

.page-header { margin-bottom: 60px; }
.main-title { font-size: 48px; font-weight: 700; letter-spacing: -1.5px; margin-bottom: 10px; }
.main-title span { color: #86868b; }
.section-desc { font-size: 20px; color: #86868b; }

/* 3. 商品卡片：Apple Store 卡片式设计 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.apple-product-card {
  background: #ffffff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.apple-product-card:hover {
  transform: scale(1.03) translateY(-10px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.1);
}

.card-image {
  height: 240px;
  background: #f5f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 60px;
}

.badge {
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 11px;
  font-weight: 700;
  color: #bf4800;
  text-transform: uppercase;
}

.card-content { padding: 25px; text-align: left; }
.category { font-size: 12px; color: #bf4800; font-weight: 600; margin-bottom: 5px; }
.item-title { font-size: 19px; font-weight: 600; margin: 0 0 15px; color: #1d1d1f; }

.price-row { display: flex; justify-content: space-between; align-items: center; }
.price { font-size: 17px; font-weight: 400; color: #424245; }

.buy-btn {
  background: #0071e3;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
</style>