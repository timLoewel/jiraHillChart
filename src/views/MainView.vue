<template>
  <div class="main-view">
    <aside class="sidebar">
      <TicketSidebar />
    </aside>
    <main class="content">
      <TicketView />
    </main>
  </div>
</template>

<script setup lang="ts">
import TicketSidebar from '@/components/TicketSidebar.vue';
import TicketView from '@/components/TicketView.vue';
</script>

<style scoped>
.main-view {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 300px;
  border-right: 1px solid #ccc;
  padding: 1rem;
  overflow-y: auto;
}

.content {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}
</style>
