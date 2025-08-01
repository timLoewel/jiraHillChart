<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Login from './components/Login.vue'
import UserProfile from './components/UserProfile.vue'

const isLoggedIn = ref(false)
const jiraHost = ref('')
const token = ref('')
const user = ref(null)

onMounted(() => {
  const storedToken = localStorage.getItem('jiraToken')
  const storedHost = localStorage.getItem('jiraHost')
  if (storedToken && storedHost) {
    token.value = storedToken
    jiraHost.value = storedHost
    // Here we would ideally verify the token and get user info
    // For now, we'll just assume it's valid if it exists
    isLoggedIn.value = true
  }
})

function handleLoginSuccess(host: string, apiToken: string, userData: any) {
  localStorage.setItem('jiraHost', host)
  localStorage.setItem('jiraToken', apiToken)
  jiraHost.value = host
  token.value = apiToken
  user.value = userData
  isLoggedIn.value = true
}

function handleLogout() {
  localStorage.removeItem('jiraHost')
  localStorage.removeItem('jiraToken')
  isLoggedIn.value = false
  token.value = ''
  jiraHost.value = ''
  user.value = null
}
</script>

<template>
  <div>
    <div v-if="isLoggedIn">
      <UserProfile :user="user" @logout="handleLogout" />
    </div>
    <div v-else>
      <Login @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>
