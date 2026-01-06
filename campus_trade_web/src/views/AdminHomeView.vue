<template>
  <div class="mac-admin-container">
    <aside class="admin-sidebar">
      <div class="admin-profile">
        <div class="admin-avatar">A</div>
        <div class="admin-info">
          <p class="name">系统管理员</p>
          <p class="role">根权限 (Root)</p>
        </div>
      </div>

      <nav class="admin-nav">
        <div class="nav-section">
          <p class="section-title">内容管理</p>
          <a href="#" 
            class="nav-item" 
            :class="{ active: activeTab === 'product' }" 
            @click.prevent="switchTab('product')">
            <span>🛡️</span> 商品审核
          </a>
          <a href="#" 
            class="nav-item" 
            :class="{ active: activeTab === 'user' }" 
            @click.prevent="switchTab('user')">
            <span>👥</span> 用户管理
          </a>
          <a href="#" class="nav-item"><span>🚩</span> 举报处理</a>
        </div>
        
        <div class="nav-section">
          <p class="section-title">系统工具</p>
          <a href="#" class="nav-item"><span>📊</span> 运行分析</a>
          <a href="#" class="nav-item"><span>⚙️</span> 全局设置</a>
        </div>
      </nav>

      <button class="mac-logout-btn" @click="logout">
        <span>退出系统</span>
      </button>
    </aside>

    <main class="admin-main">
      <header class="admin-header">
        <div class="path-nav">
          <span class="parent">后台管理</span>
          <span class="sep">/</span>
          <span class="current">商品审核控制台</span>
        </div>
        <div class="header-actions">
          <span class="data-count">在线商品总数: {{ list.length }}</span>
          <button class="refresh-btn" @click="getList">🔄 刷新数据</button>
        </div>
      </header>

      <div class="admin-content">
        <div v-if="activeTab === 'product'" class="data-table-card">
          <div class="table-header">
            <span class="col-id">编号</span>
            <span class="col-title">商品标题</span>
            <span class="col-owner">发布者</span>
            <span class="col-status">状态</span>
            <span class="col-action">管理操作</span>
          </div>

           <TransitionGroup name="list" tag="div" class="table-body">
            <div v-for="item in pendingProducts" :key="item.id" class="table-row">
             <span class="col-id">#{{ item.id }}</span>
              <span class="col-title">
                {{ item.title }}
                <br/>
                <small style="color:#86868b; font-size: 11px;">{{ item.description?.substring(0,15) }}...</small>
                <small v-if="item.description" style="color:#86868b; font-size: 11px;"> {{ item.description.length > 15 ? item.description.substring(0,15) + '...' : item.description }}
                </small>
              </span>
            <span class="col-owner">{{ item.owner || '未知用户' }}</span>
            <span class="col-status">
            <span class="status-dot" style="background: #ff9500;"></span> 待审核
            </span>
            <div class="col-action">
  <button class="btn-detail" 
          style="background: #e5e5ea;" 
          @click="openProductImage(item.imageUrl)">
    🖼️ 实物
  </button>
  
  <button class="btn-detail" @click="viewDetail(item)">详情</button>
  <button class="btn-detail" style="background:#34c759; color:white; border:none;" @click="handleProductAudit(item.id, 1)">准许</button>
  <button class="btn-delete" @click="handleProductAudit(item.id, 2)">拒绝</button>
</div>
            </div>
         </TransitionGroup>

  <div v-if="pendingProducts.length === 0" class="empty-holder">
    <p>📭 暂无待审核商品</p>
  </div>
</div>

  <div v-else-if="activeTab === 'user'" class="data-table-card">
    <div class="table-header">
      <span class="col-id" style="width: 120px;">用户名</span>
      <span class="col-title" style="flex: 1;">真实姓名</span>
      <span class="col-owner" style="flex: 1.5;">就读学校 / 学号</span>
      <span class="col-status" style="flex: 1;">认证材料</span>
      <span class="col-action" style="flex: 1;">审核决策</span>
    </div>

    <TransitionGroup name="list" tag="div" class="table-body">
      <div v-for="user in pendingUsers" :key="user.username" class="table-row">
        <span class="col-id" style="width: 120px;">{{ user.username }}</span>
        <span class="col-title" style="flex: 1;">{{ user.realName }}</span>
        <span class="col-owner" style="flex: 1.5;">
          {{ user.school }} <br/>
          <small style="color: #86868b; font-size: 11px;">ID: {{ user.studentId }}</small>
        </span>
        <span class="col-status" style="flex: 1;">
          <button class="btn-detail" @click="openImage('http://localhost:8080' + user.idCardImg)">查看证件</button>
        </span>
        <div class="col-action" style="flex: 1; display: flex; gap: 8px;">
          <button class="btn-detail" style="background: #34c759; color: white;" @click="handleAudit(user.username, 2)">通过</button>
          <button class="btn-delete" @click="handleAudit(user.username, 0)">驳回</button>
        </div>
      </div>
    </TransitionGroup>

    <div v-if="pendingUsers.length === 0" class="empty-holder">
      <p>☕️ 暂无待处理的实名认证申请</p>
    </div>
  </div>
</div>
    </main>
    <Transition name="fade">
      <div v-if="showImageModal" class="mac-modal-overlay" @click.self="closeImage">
        <div class="mac-image-card">
          <div class="modal-header">
            <span>证件原图核验</span>
            <div class="header-controls">
              <button class="close-dot" @click="closeImage"></button>
            </div>
          </div>
          <div class="modal-body">
            <img :src="previewUrl" alt="证件大图" />
          </div>
          <div class="modal-footer">
            <button class="mac-btn-done" @click="closeImage">完成阅读</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const list = ref([])
const activeTab = ref('product') // 默认显示商品审核
const pendingUsers = ref([])    // 存放待审核的实名用户列表
const showImageModal = ref(false)// 控制弹窗显示和图片地址
const previewUrl = ref('')
const pendingProducts = ref([])

// 获取列表
const getList = async () => {
  try {
    const res = await axios.get('http://localhost:8080/product/list')
    if (res.data.code === 200) {
      list.value = res.data.data
    }
  } catch (err) {
    console.error("后台获取数据失败:", err)
  }
}

// 强制下架逻辑
/* const del = async (id) => {
  if (confirm(`确定要强制下架编号为 #${id} 的商品吗？此操作不可撤销。`)) {
    try {
      await axios.delete(`http://localhost:8080/product/delete/${id}`)
      getList() 
    } catch {
      alert("操作失败，请检查后端接口")
    }
  }
} */

const viewDetail = (item) => {
  alert(`商品详情摘要：\n标题：${item.title}\n描述：${item.description}\n价格：${item.price}`)
}

const logout = () => {
  localStorage.removeItem('user')
  router.push('/')
}

// 获取待审核用户列表
const getPendingUsers = async () => {
  try {
    const res = await axios.get('http://localhost:8080/user/verify/list')
    if (res.data.code === '200' || res.data.code === 200) {
      pendingUsers.value = res.data.data
    }
  } catch (err) {
    console.error("获取实名列表失败:", err)
  }
}

// 审核用户函数
const handleAudit = async (username, status) => {
  try {
    const res = await axios.post(`http://localhost:8080/user/verify/audit?username=${username}&status=${status}`)
    if (res.data.code === '200' || res.data.code === 200) {
      alert("操作成功")
      getPendingUsers() // 刷新列表
    }
  } catch {
    alert("审核请求失败")
  }
}

// 切换面板的函数
const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'product') getPendingProducts()
  if (tab === 'user') getPendingUsers()
}

// 打开预览的方法
const openImage = (url) => {
  if (!url || url.includes('null')) {
    alert("该用户未上传图片")
    return
  }
  previewUrl.value = url
  showImageModal.value = true
}

// 关闭预览
const closeImage = () => {
  showImageModal.value = false
}

// 获取待审核商品
const getPendingProducts = async () => {
  const res = await axios.get('http://localhost:8080/product/admin/pending')
  if (res.data.code == 200) {
    pendingProducts.value = res.data.data
  }
}

// 审核商品操作
const handleProductAudit = async (id, status) => {
  const res = await axios.post(`http://localhost:8080/product/admin/audit?id=${id}&status=${status}`)
  if (res.data.code == 200) {
    alert(status === 1 ? '✅ 商品已上架' : '❌ 已拒绝该商品')
    getPendingProducts() // 刷新列表
  }
}



onMounted(getList)
</script>

<style scoped>
.mac-admin-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.admin-sidebar {
  width: 220px;
  background: #1e1e1e;
  color: #d1d1d1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  flex-shrink: 0;
}

/* 增加了个人资料卡片的顶部间距，代替原来的圆点位置 */
.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  margin-top: 10px; /* 调整后的间距 */
  margin-bottom: 25px;
}

.admin-avatar {
  width: 36px; height: 36px; background: #5e5ce6; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;
}
.admin-info .name { font-size: 13px; font-weight: 600; margin: 0; color: white; }
.admin-info .role { font-size: 11px; margin: 0; opacity: 0.6; }

.nav-section { margin-bottom: 25px; }
.section-title { font-size: 11px; font-weight: 600; color: #555; margin-left: 10px; margin-bottom: 8px; text-transform: uppercase; }

.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  color: #aaa; text-decoration: none; font-size: 14px; border-radius: 8px; margin-bottom: 4px; transition: 0.2s;
}
.nav-item:hover { background: rgba(255,255,255,0.05); color: white; }
.nav-item.active { background: #323232; color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }

.mac-logout-btn {
  margin-top: auto; padding: 10px; background: rgba(255,59,48,0.1);
  color: #ff3b30; border: 1px solid rgba(255,59,48,0.2); border-radius: 8px; cursor: pointer;
}

.admin-main { flex: 1; background: hsla(240, 15%, 76%, 0.507); display: flex; flex-direction: column; min-width: 0; }
.admin-header {
  padding: 20px 40px; display: flex; justify-content: space-between; align-items: center;
  background: white; border-bottom: 1px solid #e5e5e5;
}
.path-nav { font-size: 14px; }
.path-nav .parent { color: #86868b; }
.path-nav .sep { margin: 0 8px; color: #d2d2d7; }
.path-nav .current { color: #1d1d1f; font-weight: 600; }

.header-actions { display: flex; align-items: center; gap: 20px; }
.data-count { font-size: 12px; color: #86868b; }
.refresh-btn { background: none; border: 1px solid #d2d2d7; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; }

.admin-content { padding: 30px 40px; flex: 1; overflow-y: auto; }

.data-table-card {
  background: white; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.table-header {
  display: flex; padding: 12px 20px; background: #fbfbfd;
  border-bottom: 1px solid #e5e5e5; font-size: 12px; font-weight: 600; color: #86868b;
}
.table-row {
  display: flex; padding: 16px 20px; border-bottom: 1px solid #f5f5f7;
  align-items: center; font-size: 14px; transition: 0.2s;
}
.table-row:hover { background: #fbfbfd; }

.col-id { width: 80px; color: #86868b; font-family: monospace; }
.col-title { flex: 2; font-weight: 500; }
.col-owner { flex: 1; color: #424245; }
.col-status { flex: 1; display: flex; align-items: center; gap: 6px; }
.status-dot { width: 8px; height: 8px; background: #34c759; border-radius: 50%; }
.col-action { flex: 1; display: flex; gap: 10px; justify-content: flex-end; }

.btn-detail { background: #f2f2f7; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
.btn-delete { background: #fff2f2; color: #ff3b30; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
.btn-delete:hover { background: #ff3b30; color: white; }

.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(30px); }

.empty-holder { padding: 60px; text-align: center; color: #86868b; }

.mac-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px); /* 核心：高斯模糊效果 */
  display: flex; align-items: center; justify-content: center;
  z-index: 2000; /* 确保在最上层 */
}

.mac-image-card {
  background: white;
  width: 90%; max-width: 700px;
  border-radius: 12px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  overflow: hidden;
  animation: modalShow 0.3s ease-out;
}

.modal-header {
  padding: 10px 16px; background: #f6f6f6;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #e5e5e5;
}

.close-dot {
  width: 12px; height: 12px; background: #ff5f56;
  border: none; border-radius: 50%; cursor: pointer;
}

.modal-body { background: #1e1e1e; display: flex; justify-content: center; }
.modal-body img { max-height: 70vh; width: auto; object-fit: contain; }

.modal-footer { padding: 12px; text-align: right; background: #f6f6f6; }
.mac-btn-done {
  background: #007aff; color: white; border: none;
  padding: 6px 20px; border-radius: 6px; cursor: pointer;
}

@keyframes modalShow {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>