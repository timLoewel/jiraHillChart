<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['logout'])

const avatarUrl = computed(() => {
  return props.user?.avatarUrls?.['48x48'] || ''
})

const displayName = computed(() => {
  return props.user?.displayName || 'Guest'
})

function logout() {
  emit('logout')
}
</script>

<template>
  <div class="user-profile">
    <div v-if="user" class="user-info">
      <img :src="avatarUrl" alt="User Avatar" class="avatar">
      <span>Hello, {{ displayName }}</span>
    </div>
    <button @click="logout">Logout</button>
  </div>
</template>

<style scoped>
.user-profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
</style>
