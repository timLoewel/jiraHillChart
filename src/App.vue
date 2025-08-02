<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Login from './components/Login.vue'
import UserProfile from './components/UserProfile.vue'
import Sidebar from './components/Sidebar.vue'

const isLoggedIn = ref(false)
const jiraHost = ref('')
const token = ref('')
const user = ref(null)
const selectedTicket = ref<any>(null)

onMounted(() => {
  const storedToken = localStorage.getItem('jiraToken')
  const storedHost = localStorage.getItem('jiraHost')
  if (storedToken && storedHost) {
    token.value = storedToken
    jiraHost.value = storedHost
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
  selectedTicket.value = null
}

function handleTicketLoaded(ticket: any) {
  selectedTicket.value = ticket
}
</script>

<template>
  <div class="app-container">
    <div v-if="isLoggedIn" class="main-layout">
      <Sidebar :jira-host="jiraHost" :token="token" @ticket-loaded="handleTicketLoaded" />
      <div class="main-panel">
        <UserProfile :user="user" @logout="handleLogout" />
        <div v-if="selectedTicket" class="ticket-display">
          <h3>{{ selectedTicket.fields.summary }}</h3>
          <p>{{ selectedTicket.fields.description }}</p>
        </div>
      </div>
    </div>
    <div v-else class="login-layout">
      <Login @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.main-layout {
  display: flex;
  width: 100%;
}

.main-panel {
  flex-grow: 1;
  padding: 1rem;
}

.login-layout {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
