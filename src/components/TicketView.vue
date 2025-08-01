<template>
  <div class="ticket-view">
    <div v-if="ticket">
      <h2>{{ ticket.key }}: {{ ticket.fields.summary }}</h2>

      <div class="hill-chart-container">
        <HillChart />
      </div>

      <div class="todo-list-container">
        <TodoList />
      </div>
    </div>
    <div v-else class="no-ticket-selected">
      <p>Select a ticket from the sidebar to view its details.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTicketsStore } from '@/stores/tickets.store';
import { computed } from 'vue';
import TodoList from './TodoList.vue';
import HillChart from './HillChart.vue';

const ticketsStore = useTicketsStore();
const ticket = computed(() => ticketsStore.selectedTicket);
</script>

<style scoped>
.ticket-view {
  padding: 1rem;
}
.hill-chart-container {
  margin-top: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
}
.todo-list-container {
  margin-top: 1rem;
}
.no-ticket-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #777;
  font-size: 1.2rem;
}
</style>
