<script setup lang="ts">
import { ref, computed } from 'vue';
import { searchForInProgressTickets } from '../services/jira';

const emit = defineEmits(['ticket-selected', 'close']);

const projectKey = ref('');
const searchQuery = ref('');
const tickets = ref<any[]>([]);
const isLoading = ref(false);
const error = ref('');

async function fetchTickets() {
  if (!projectKey.value) return;
  isLoading.value = true;
  error.value = '';
  try {
    tickets.value = await searchForInProgressTickets(projectKey.value);
  } catch (err: any) {
    error.value = `Failed to fetch tickets: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
}

function selectTicket(ticket: any) {
  emit('ticket-selected', ticket);
  emit('close');
}

function closeDialog() {
  emit('close');
}

const filteredTickets = computed(() => {
    if (!searchQuery.value) {
        return tickets.value;
    }
    return tickets.value.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
</script>

<template>
  <div class="ticket-selector-dialog">
    <div class="dialog-content">
      <button @click="closeDialog" class="close-button">X</button>
      <h3>Select a Ticket</h3>
      <form @submit.prevent="fetchTickets">
        <label for="projectKey">Project Key:</label>
        <input id="projectKey" v-model="projectKey" type="text" placeholder="e.g., PROJ" @keyup.enter="fetchTickets" />
      </form>
      <div v-if="tickets.length > 0">
        <input v-model="searchQuery" type="text" placeholder="Filter by title..." class="filter-input" />
        <ul class="ticket-list">
          <li v-for="ticket in filteredTickets" :key="ticket.id" @click="selectTicket(ticket)">
            <strong>{{ ticket.id }}</strong> - {{ ticket.title }}
          </li>
        </ul>
      </div>
      <p v-if="isLoading">Loading...</p>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.ticket-selector-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-content {
  background-color: white;
  padding: 2em;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
  position: relative;
}
.close-button {
    position: absolute;
    top: 1em;
    right: 1em;
}
.filter-input {
    margin-top: 1em;
    width: 100%;
}
.ticket-list {
  list-style: none;
  padding: 0;
  margin-top: 1em;
  max-height: 300px;
  overflow-y: auto;
}
.ticket-list li {
  padding: 0.5em;
  cursor: pointer;
}
.ticket-list li:hover {
  background-color: #f0f0f0;
}
</style>
