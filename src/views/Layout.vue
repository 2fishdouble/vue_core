<template>
  <Layout class="layout-root">
    <!-- 顶部导航 -->
    <LayoutHeader class="layout-header">
      <div class="layout-left">
        <div class="logo">宠物管理系统</div>
        <!-- 桌面端菜单 -->
        <Menu
            theme="light"
            mode="horizontal"
            :selectedKeys="[selectedKey]"
            class="layout-menu desktop-menu"
            :overflowedIndicator="null"
        >
          <MenuItem key="dog" @click="go('/layout/dog')">狗狗</MenuItem>
          <MenuItem key="cat" @click="go('/layout/cat')">猫猫</MenuItem>
          <MenuItem key="hk" @click="go('/layout/hk')">香港</MenuItem>
          <MenuItem key="sc" @click="go('/layout/sc')">四川</MenuItem>
          <MenuItem key="lion" @click="go('/layout/lion')">狮子</MenuItem>
          <MenuItem key="hook" @click="go('/layout/hook')">钩子</MenuItem>
          <MenuItem key="style" @click="go('/layout/style')">样式</MenuItem>
          <MenuItem key="sass" @click="go('/layout/sass')">sass</MenuItem>
          <MenuItem key="screen" @click="go('/layout/screen')">流量图</MenuItem>
        </Menu>
        
        <!-- 移动端下拉菜单 -->
        <Dropdown class="mobile-menu" :trigger="['click']">
          <Button type="text" class="mobile-menu-btn">
            ☰
          </Button>
          <template #overlay>
            <Menu
                :selectedKeys="[selectedKey]"
                @click="handleMobileMenuClick"
            >
              <MenuItem key="dog">狗狗</MenuItem>
              <MenuItem key="cat">猫猫</MenuItem>
              <MenuItem key="hk">香港</MenuItem>
              <MenuItem key="sc">四川</MenuItem>
              <MenuItem key="lion">狮子</MenuItem>
              <MenuItem key="hook">钩子</MenuItem>
              <MenuItem key="style">样式</MenuItem>
              <MenuItem key="sass">sass</MenuItem>
              <MenuItem key="screen">流量图</MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </div>
      <div class="logout-wrapper">
        <Button type="primary" ghost size="small" @click="logout">退出</Button>
      </div>
    </LayoutHeader>

    <!-- 内容区域 -->
    <LayoutContent class="layout-content">
<!--      会缓存组件，切换页面时不会重新渲染-->
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="['Lion']">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </LayoutContent>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  Menu,
  MenuItem,
  Button,
  Dropdown
} from 'ant-design-vue'
import Cookies from 'js-cookie';

const router = useRouter()
const route = useRoute()

const go = (path: string) => {
  router.push(path)
}

const logout = () => {
  // 可加入清除 token、用户信息等逻辑
  localStorage.removeItem('token')
  Cookies.remove('token');
  router.push('/login')
}

const selectedKey = computed(() => {
  return route.path.split('/').pop() || ''
})

const handleMobileMenuClick = ({ key }: { key: string | number }) => {
  go('/layout/' + String(key))
}
</script>

<style scoped>
/* 根容器撑满全屏，采用flex列布局 */
.layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #74ebd5, #9face6); /* 登录页主背景 */
}

/* 顶部导航，卡片风格 */
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 80px;
  background: #fff; /* 纯白背景 */
  border-radius: 16px; /* 和登录卡片圆角保持一致 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* 登录页卡片阴影 */
  margin: 20px 24px 0 24px; /* 顶部和左右留白 */
  color: #333;
  user-select: none;
  flex-shrink: 0; /* 不允许头部高度收缩 */
  min-width: 0; /* 允许flex子项收缩 */
}

/* 左侧：logo 和菜单水平排列 */
.layout-left {
  display: flex;
  align-items: center;
  flex: 1; /* 占据剩余空间 */
  min-width: 0; /* 允许收缩 */
  overflow: hidden; /* 防止内容溢出 */
}

.logo {
  font-weight: 700;
  font-size: 22px;
  color: #333;
  margin-right: 40px;
  flex-shrink: 0; /* logo不收缩 */
}

/* 菜单样式 */
.layout-menu {
  line-height: 80px; /* 高度和header一致 */
  color: #333;
  border-bottom: none !important; /* 去掉菜单底部默认下划线 */
  flex: 1; /* 占据剩余空间 */
  min-width: 0; /* 允许收缩 */
  overflow: hidden; /* 防止内容溢出 */
  display: flex; /* 使用flex布局 */
  flex-wrap: nowrap; /* 不换行 */
}

/* 菜单项样式优化 */
.layout-menu ::v-deep(.ant-menu-item) {
  padding: 0 12px !important; /* 减少内边距 */
  margin: 0 2px !important; /* 减少外边距 */
  white-space: nowrap; /* 防止文字换行 */
  flex-shrink: 0; /* 菜单项不收缩 */
}

/* 选中和悬停状态 */
.layout-menu ::v-deep(.ant-menu-item-selected) {
  background-color: #1890ff !important; /* 经典蓝色高亮 */
  color: #fff !important;
  border-radius: 12px;
}

.layout-menu ::v-deep(.ant-menu-item:hover) {
  background-color: rgba(24, 144, 255, 0.15);
  color: #1890ff;
  border-radius: 12px;
}

/* 退出按钮区域 */
.logout-wrapper {
  display: flex;
  align-items: center;
  flex-shrink: 0; /* 退出按钮不收缩 */
  margin-left: 16px; /* 与菜单保持距离 */
}

.logout-wrapper .ant-btn {
  font-weight: 600;
  border-radius: 12px;
  padding: 6px 20px;
  line-height: normal;           /* 重置默认行高 */
  display: flex;                /* flex布局 */
  align-items: center;          /* 垂直居中 */
  justify-content: center;      /* 水平居中 */
  transition: all 0.3s ease;
  white-space: nowrap; /* 防止按钮文字换行 */
}

.logout-wrapper .ant-btn:hover {
  filter: brightness(1.1);
}

/* 移动端菜单样式 */
.mobile-menu {
  display: none;
}

.mobile-menu-btn {
  font-size: 18px;
  padding: 8px 12px;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .logo {
    font-size: 20px;
    margin-right: 24px;
  }
  
  .layout-menu ::v-deep(.ant-menu-item) {
    padding: 0 8px !important;
    margin: 0 1px !important;
  }
}

@media (max-width: 992px) {
  .desktop-menu {
    display: none !important;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .logo {
    font-size: 18px;
    margin-right: 16px;
  }
  
  .layout-header {
    padding: 0 16px;
    margin: 16px 16px 0 16px;
  }
  
  .layout-left {
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .desktop-menu {
    display: none !important;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .layout-header {
    flex-direction: column;
    height: auto;
    padding: 16px;
    margin: 12px 12px 0 12px;
  }
  
  .layout-left {
    width: 100%;
    margin-bottom: 12px;
    justify-content: space-between;
  }
  
  .logo {
    margin-right: 16px;
  }
  
  .logout-wrapper {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}

/* 内容区自动撑满剩余空间 */
.layout-content {
  flex-grow: 1; /* 自动占满剩余高度 */
  background-color: #fff;
  margin: 24px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.1);
  overflow-y: auto; /* 内容溢出时出现滚动 */
}


</style>
