<template>
  <div class="ticket-sidebar">
    <div class="header">
      <h3>Jira Hill Chart</h3>
      <button @click="handleLogout">Logout</button>
    </div>

    <div class="filters">
      <input type="text" v-model="ticketsStore.projectFilter" placeholder="Filter by project (e.g., PROJ)" />
      <input type="text" v-model="ticketsStore.statusFilter" placeholder="Filter by status..." />
    </div>

    <div v-if="ticketsStore.isLoading" class="loading-container">
      <div class="spinner"></div>
    </div>
    <div v-else-if="ticketsStore.error" class="error">
      {{ ticketsStore.error }}
    </div>
    <ul v-else class="ticket-list">
      <li
        v-for="ticket in ticketsStore.filteredTickets"
        :key="ticket.id"
        :class="{ 'selected': ticket.id === ticketsStore.selectedTicketId }"
        @click="ticketsStore.selectTicket(ticket.id)"
      >
        <div class="ticket-key">{{ ticket.key }}</div>
        <div class="ticket-summary">{{ ticket.fields.summary }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTicketsStore } from '@/stores/tickets.store';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';

const ticketsStore = useTicketsStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  ticketsStore.fetchTickets();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.ticket-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ccc;
}
.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
input {
  width: 100%;
  padding: 0.5rem;
}
.ticket-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}
.ticket-list li {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.ticket-list li:hover {
  background-color: #e9f5ff;
}
.ticket-list li.selected {
  background-color: #cce7ff;
  font-weight: bold;
}
.ticket-key {
  font-size: 0.8rem;
  color: #666;
}
.ticket-summary {
  font-size: 1rem;
}
.error {
  color: #d9534f;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
