<script setup lang="ts">
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['logout'])

function logout() {
  emit('logout')
}
</script>

<template>
  <div>
    <h2>Welcome</h2>
    <div v-if="user">
      <img :src="user.avatarUrls['48x48']" alt="User Avatar">
      <p>Hello, {{ user.displayName }}</p>
    </div>
    <button @click="logout">Logout</button>
  </div>
</template>
