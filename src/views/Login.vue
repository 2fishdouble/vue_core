<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">欢迎登录</h2>
      <Form :model="form" @submit.prevent="onSubmit" class="login-form">
        <FormItem>
          <Input
              v-model:value="form.username"
              placeholder="请输入用户名"
              size="large"
              :prefix="h(UserOutlined)"
          />
        </FormItem>
        <FormItem>
          <Input.Password
              v-model:value="form.password"
              placeholder="请输入密码"
              size="large"
              :prefix="h(LockOutlined)"
          />
        </FormItem>
        <FormItem>
          <Button
              type="primary"
              block
              size="large"
              @click="onSubmit"
              class="login-button"
          >
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { Form, FormItem, Input, Button } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import Cookies from 'js-cookie';
const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

const onSubmit = () => {
  if (form.value.username && form.value.password) {
    localStorage.setItem('token', form.value.username + form.value.password)
    sessionStorage.setItem('token', form.value.username + form.value.password)
    Cookies.set('token', form.value.username + form.value.password, { expires: 7, path: '/' })
    router.push('/layout/dog')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #74ebd5, #9face6);
}

.login-card {
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
}

.login-button {
  font-weight: bold;
  transition: all 0.3s;
}

.login-button:hover {
  filter: brightness(1.1);
}
</style>
