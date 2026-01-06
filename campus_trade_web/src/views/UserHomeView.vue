<template>
  <div class="user-home-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="app-logo">
          <span class="logo-emoji">🔄</span>
          <span class="logo-name">CampusTrade</span>
        </div>
      </div>

    <nav class="sidebar-nav">
        <div class="nav-group">
         <p class="group-label">发现</p>
         <a href="#" 
         class="nav-link" 
         :class="{ active: filterMode === 'all' }" 
         @click.prevent="filterMode = 'all'">
         <span>🏠</span> 探索广场
         </a>
         <a href="#" class="nav-link"><span>🏷️</span> 分类浏览</a>
        </div>
      <div class="nav-group">
        <p class="group-label">个人中心</p>
        <a href="#" 
        class="nav-link" 
        :class="{ active: filterMode === 'mine' }" 
        @click.prevent="filterMode = 'mine'">
        <span>📦</span> 我的发布 <span class="badge">{{ userPublishCount }}</span>
        </a>
        <a href="#" class="nav-link"><span>📜</span> 订单记录</a>
        <a href="#" class="nav-link"><span>❤️</span> 我的收藏</a>
        <a href="#" class="nav-link"><span>💬</span> 消息中心 <span class="badge red">3</span></a>
      </div>
   </nav>

      <div class="sidebar-footer">
        <div class="user-profile-card">
          <div class="avatar">{{ user.username?.charAt(0) || 'U' }}</div>
          <div class="user-info">
            <p class="username">{{ user.username || '未知用户' }}</p>
            <p class="status-tag" :class="{ verified: user.verifyStatus === 2 }" @click="showVerifyModal = true" style="cursor: pointer;">
              {{ user.verifyStatus === 2 ? '● 已实名' : (user.verifyStatus === 1 ? '● 审核中' : '○ 未实名 (点击认证)') }}
            </p>
          </div>
          <button class="logout-mini" @click="handleLogout" title="退出登录">🚪</button>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="content-header">
        <div class="header-left">
          <h1>探索校园好物</h1>
          <p class="date-string">{{ new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' }) }}</p>
        </div>
        
        <div class="header-right">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input v-model="searchKeyword" type="text" placeholder="搜索商品..." @keyup.enter="fetchData">
          </div>
          <button class="btn-primary" @click="user.verifyStatus === 2 ? (showAdd = true) : handleVerifyPrompt()">
            <span>+</span> 发布闲置
          </button>
        </div>
      </header>

      <section class="stats-row">
        <div class="mini-stat-card">
          <span class="stat-icon blue">🛒</span>
          <div class="stat-data"><p class="val">{{ stats.totalItems }}</p><p class="lab">在售物品</p></div>
        </div>
        <div class="mini-stat-card">
          <span class="stat-icon green">🤝</span>
          <div class="stat-data"><p class="val">1,204</p><p class="lab">累计交易</p></div>
        </div>
        <div class="mini-stat-card">
          <span class="stat-icon orange">🛡️</span>
          <div class="stat-data"><p class="val">100%</p><p class="lab">真实校友</p></div>
        </div>
      </section>

      <nav class="category-bar">
        <button 
          v-for="cat in categories" 
          :key="cat.id" 
          class="cat-item"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </button>
      </nav>

      <section class="goods-section">
        <div class="section-title-bar">
          <h2>最新上架</h2>
          <div class="filter-tabs">
            <button v-for="t in tabs" :key="t.id" :class="{active: activeTab === t.id}" @click="activeTab = t.id">{{t.name}}</button>
          </div>
        </div>

        <div class="goods-grid">
          <div class="goods-card" v-for="item in filteredItems" :key="item.id">
            <div class="card-image">
              <img 
                v-if="item.displayImage" 
                :src="item.displayImage" 
                class="real-product-img"
                style="width: 100%; height: 100%; object-fit: cover;" 
               />
              <span v-else class="placeholder-emoji">📦</span>
              <div class="price-tag">¥{{ item.price || '0' }}</div>
           </div>
            <div class="card-content">
              <h3>{{ item.title }}</h3>
              <p class="desc">{{ item.description }}</p>
              <div class="card-footer">
                <div class="owner-info">
                  <span class="owner-avatar">👤</span>
                  <span>{{ item.owner || '校友' }}</span>
                </div>
                <div class="card-actions">
                  <button class="action-icon" @click="toggleLike(item)">{{ item.liked ? '❤️' : '🤍' }}</button>
                  <button 
                    v-if="item.owner === user.username"
                    class="action-icon" 
                   @click.stop="confirmDelete(item.id)"
                    style="margin-right: 8px; color: #ff0000; cursor: pointer;"
                 >🗑️</button>
                 <button class="contact-btn" @click="contactSeller(item)">联系他</button>
               </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Transition name="sheet">
      <div v-if="showAdd" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3>发布新闲置</h3>
            <button class="close-btn" @click="showAdd = false">×</button>
          </div>
          <div class="modal-body">
            <div class="input-row">
              <label>物品名称</label>
              <input v-model="form.title" placeholder="起个吸引人的标题">
            </div>
            <div class="input-row">
              <label>物品图片</label>
              <div class="image-upload-wrapper">
                <input type="file" id="file-input" @change="handleImageChange" accept="image/*" style="display: none;">
                
                <label for="file-input" class="upload-placeholder" v-if="!selectedFileName">
                  <span class="upload-icon">📷</span>
                  <p>点击上传照片</p>
                </label>
                
                <div v-else class="file-info-bar">
                  <span class="file-icon">🖼️</span>
                  <span class="file-name">{{ selectedFileName }}</span>
                  <button class="clear-file-btn" @click.stop="clearFile">✕</button>
                </div>
              </div>
            </div>
            <div class="input-row">
              <label>预期价格</label>
              <input v-model="form.price" type="number" placeholder="¥ 0.00">
            </div>
            <div class="input-row">
              <label>所属分类</label>
              <select v-model="form.category" class="category-select">
                <option value="electronics">数码产品</option>
                <option value="books">书籍课本</option>
                <option value="daily">生活用品</option>
                <option value="others">其他</option>
              </select>
            </div>
            <div class="input-row">
              <label>详细描述</label>
              <textarea v-model="form.description" rows="4" placeholder="写写物品的新旧程度..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showAdd = false">取消</button>
            <button class="btn-confirm" @click="handleSubmit" :disabled="submitting">{{ submitting ? '发布中...' : '确认发布' }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="showVerifyModal" class="modal-overlay" style="z-index: 3000;">
      <div class="modal-card" style="width: 450px;">
        <div class="modal-header">
          <h3>学生实名身份认证</h3>
          <button class="close-btn" @click="showVerifyModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="input-row"><label>真实姓名</label><input v-model="vForm.realName" placeholder="请输入姓名"></div>
          <div class="input-row"><label>就读学校</label><input v-model="vForm.school" placeholder="请输入学校名称"></div>
          <div class="input-row" style="display: flex; gap: 10px;">
            <div style="flex: 1;"><label>学号</label><input v-model="vForm.studentId" placeholder="学号"></div>
            <div style="flex: 1;"><label>身份证号</label><input v-model="vForm.idCard" placeholder="18位身份证号"></div>
          </div>
          <div class="input-row">
            <label>相关证件照片</label>
            <input type="file" @change="onVerifyFileChange" accept="image/*" style="font-size: 12px;">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showVerifyModal = false">取消</button>
          <button class="btn-confirm" @click="submitVerify">提交认证资料</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
if (user.value.verifyStatus === undefined) user.value.verifyStatus = 0

const list = ref([])
const showAdd = ref(false)
const showVerifyModal = ref(false)
const submitting = ref(false)
const searchKeyword = ref('')
const activeTab = ref('latest')
const activeCategory = ref('all')
const filterMode = ref('all')
const form = ref({ title: '', description: '', price: '', category: 'others' })
const vForm = ref({ realName: '', school: '', studentId: '', idCard: '' })
const vFile = ref(null)
const stats = ref({ totalItems: 0 })

// 核心修改：移除 imagePreview，增加 selectedFileName
const selectedFileName = ref('')
const selectedFile = ref(null)

const categories = [
  { id: 'all', name: '全部', icon: '🌈' },
  { id: 'electronics', name: '数码产品', icon: '💻' },
  { id: 'books', name: '书籍课本', icon: '📚' },
  { id: 'daily', name: '生活用品', icon: '🧴' },
  { id: 'others', name: '其他', icon: '📦' }
]

const tabs = [{ id: 'latest', name: '最新' }, { id: 'popular', name: '热门' }]

const userPublishCount = computed(() => list.value.filter(i => i.owner === user.value.username).length)

const filteredItems = computed(() => {
  let items = [...list.value]
  if (filterMode.value === 'mine') items = items.filter(i => i.owner === user.value.username)
  if (searchKeyword.value) {
    items = items.filter(i => 
      i.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) || 
      i.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  if (activeCategory.value !== 'all') items = items.filter(i => i.category === activeCategory.value)
  return items
})

const fetchData = async () => {
  try {
    const res = await axios.get('http://localhost:8080/product/list')
    const remoteData = Array.isArray(res.data) ? res.data : (res.data.data || [])
    list.value = remoteData.map(i => ({
      ...i,
      displayImage: i.imageUrl ? `http://localhost:8080${i.imageUrl}` : null
    }))
    stats.value.totalItems = list.value.length
  } catch (e) { console.error("加载数据失败", e) }
}

const onVerifyFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    vFile.value = file;
  }
}

const submitVerify = async () => {
  if (!vForm.value.realName) return alert("姓名不能为空");
  if (!vFile.value) return alert("请上传证件照片"); 

  const fd = new FormData();
  fd.append('file', vFile.value); 
  fd.append('username', user.value.username);
  fd.append('realName', vForm.value.realName);
  fd.append('school', vForm.value.school);
  fd.append('studentId', vForm.value.studentId);
  fd.append('idCard', vForm.value.idCard);

  try {
    const res = await axios.post('http://localhost:8080/user/verify', fd);
    if (res.data.code == 200 || res.data.code == 1) { 
      alert("提交成功，请等待审核");
      showVerifyModal.value = false;
      user.value.verifyStatus = 1;
      localStorage.setItem('user', JSON.stringify(user.value));
    }
  } catch (err) {
    alert("服务器连接失败",err);
  }
}

const handleVerifyPrompt = () => {
  if (user.value.verifyStatus === 1) alert("审核中，请稍后")
  else if (confirm("发布商品需实名认证，是否现在认证？")) showVerifyModal.value = true
}

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  const formData = new FormData()
  Object.keys(form.value).forEach(key => formData.append(key, form.value[key]))
  formData.append('owner', user.value.username)
  if (selectedFile.value) formData.append('image', selectedFile.value)
  try {
    const res = await axios.post('http://localhost:8080/product/add', formData)
    if (res.status === 200 || res.data.code === 200) {
      alert("发布成功，请等待审核"); 
      showAdd.value = false; 
      fetchData();
      clearFile(); // 发布成功后重置
    }
  } finally { submitting.value = false }
}

const confirmDelete = async (id) => {
  if (confirm("确定下架吗？")) {
    await axios.delete(`http://localhost:8080/product/delete/${id}?username=${user.value.username}`)
    fetchData()
  }
}

// 核心修改：移除预览图生成逻辑，只存储文件名
const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) { 
    selectedFile.value = file; 
    selectedFileName.value = file.name; 
  }
}

const clearFile = () => {
  selectedFileName.value = '';
  selectedFile.value = null;
  const input = document.getElementById('file-input');
  if (input) input.value = '';
}

const handleLogout = () => { if(confirm("退出？")) { localStorage.clear(); router.push('/') } }

onMounted(fetchData)
</script>

<style scoped>
.user-home-container { display: flex; width: 100%; height: 100vh; background: #fbfbfd; color: #1d1d1f; overflow: hidden; font-family: -apple-system, sans-serif; }
.sidebar { width: 240px; background: #f2f2f7; border-right: 1px solid rgba(0,0,0,0.1); display: flex; flex-direction: column; padding: 24px 12px; flex-shrink: 0; }
.app-logo { display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 30px; }
.logo-name { font-weight: 700; font-size: 18px; }
.nav-link { display: flex; align-items: center; padding: 10px 12px; border-radius: 8px; color: #424245; text-decoration: none; font-size: 14px; margin-bottom: 4px; }
.nav-link.active { background: #0071e3; color: white; }
.main-content { flex: 1; overflow-y: auto; padding: 40px 60px; }
.content-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
.btn-primary { background: #0071e3; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: 600; }
.stats-row { display: flex; gap: 20px; margin-bottom: 40px; }
.mini-stat-card { flex: 1; background: white; padding: 16px; border-radius: 16px; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
.goods-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
.goods-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); }
.card-image { height: 180px; background: #f2f2f7; position: relative; }
.price-tag { position: absolute; bottom: 12px; left: 12px; background: white; padding: 4px 10px; border-radius: 8px; font-weight: 700; }
.user-profile-card { background: white; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 10px; }
.avatar { width: 32px; height: 32px; background: #0071e3; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.status-tag { font-size: 10px; color: #ff3b30; }
.status-tag.verified { color: #34c759; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-card { background: white; width: 400px; border-radius: 16px; padding: 24px; }
.input-row { margin-bottom: 15px; }
.input-row label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 5px; }
.input-row input, .category-select, textarea { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #d2d2d7; outline: none; box-sizing: border-box; }
.category-bar { display: flex; gap: 12px; margin-bottom: 30px; }
.cat-item { padding: 8px 16px; background: white; border-radius: 20px; cursor: pointer; border: 1px solid rgba(0,0,0,0.05); }
.cat-item.active { background: #0071e3; color: white; }

/* 修复的文件展示样式 */
.image-upload-wrapper { width: 100%; margin-top: 5px; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed #d2d2d7; border-radius: 12px; padding: 20px; cursor: pointer; }
.file-info-bar { display: flex; align-items: center; gap: 8px; background: rgba(0, 113, 227, 0.05); padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(0, 113, 227, 0.2); }
.file-name { font-size: 13px; color: #1d1d1f; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
.clear-file-btn { background: #86868b; color: white; border: none; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; }
.clear-file-btn:hover { background: #ff3b30; }
</style>