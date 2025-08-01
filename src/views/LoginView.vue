<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="jiraUrl">Jira URL:</label>
        <input type="text" id="jiraUrl" v-model="jiraUrl" required />
      </div>
      <div>
        <label for="token">Personal Access Token:</label>
        <input type="password" id="token" v-model="token" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';

const jiraUrl = ref('');
const token = ref('');
const authStore = useAuthStore();
const router = useRouter();

const login = () => {
  authStore.login(jiraUrl.value, token.value);
  if (authStore.isAuthenticated) {
    router.push('/');
  }
};
</script>
