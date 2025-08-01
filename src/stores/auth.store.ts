import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const jiraUrl = ref<string | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!jiraUrl.value)

  function login(url: string, pat: string) {
    // Basic validation
    if (!url.startsWith('http')) {
      alert('Jira URL must start with http or https');
      return;
    }
    jiraUrl.value = url.endsWith('/') ? url.slice(0, -1) : url;
    token.value = pat
    localStorage.setItem('jiraUrl', jiraUrl.value)
    localStorage.setItem('jiraToken', pat)
  }

  function logout() {
    jiraUrl.value = null
    token.value = null
    localStorage.removeItem('jiraUrl')
    localStorage.removeItem('jiraToken')
  }

  function loadCredentialsFromStorage() {
    const storedUrl = localStorage.getItem('jiraUrl')
    const storedToken = localStorage.getItem('jiraToken')
    if (storedUrl && storedToken) {
      jiraUrl.value = storedUrl
      token.value = storedToken
    }
  }

  return {
    jiraUrl,
    token,
    isAuthenticated,
    login,
    logout,
    loadCredentialsFromStorage,
  }
})
