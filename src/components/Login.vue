<script setup lang="ts">
import { ref } from 'vue'
import { verifyTokenAndGetUser } from '../services/jira'

const emit = defineEmits(['login-success'])

const jiraHost = ref('')
const token = ref('')
const error = ref('')
const isLoading = ref(false)

async function login() {
  if (!jiraHost.value || !token.value) {
    error.value = 'Jira Host and Token are required.'
    return
  }
  error.value = ''
  isLoading.value = true
  try {
    const user = await verifyTokenAndGetUser(jiraHost.value, token.value)
    emit('login-success', jiraHost.value, token.value, user)
  } catch (err: any) {
    error.value = `Login failed: ${err.message}`
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h2>Jira Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="jiraHost">Jira Host:</label>
        <input id="jiraHost" v-model="jiraHost" type="text" placeholder="https://your-jira.atlassian.net" required>
      </div>
      <div>
        <label for="token">Personal Access Token:</label>
        <input id="token" v-model="token" type="password" required>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </form>
  </div>
</template>
