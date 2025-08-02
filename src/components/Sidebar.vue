<script setup lang="ts">
import { ref } from 'vue'
import { getTicket } from '../services/jira'

const props = defineProps({
  jiraHost: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['ticket-loaded'])

const searchQuery = ref('')
const recentTickets = ref<any[]>([])
const error = ref('')
const isLoading = ref(false)
const isRecentTicketsExpanded = ref(true)

async function search() {
  if (!searchQuery.value) {
    return
  }
  error.value = ''
  isLoading.value = true
  try {
    const ticket = await getTicket(props.jiraHost, props.token, searchQuery.value)
    if (!recentTickets.value.find((t) => t.id === ticket.id)) {
      recentTickets.value.unshift(ticket)
    }
    emit('ticket-loaded', ticket)
  } catch (err: any) {
    error.value = `Failed to load ticket: ${err.message}`
  } finally {
    isLoading.value = false
    searchQuery.value = ''
  }
}

function toggleRecentTickets() {
  isRecentTicketsExpanded.value = !isRecentTicketsExpanded.value
}
</script>

<template>
  <div class="sidebar">
    <div class="search-section">
      <form @submit.prevent="search">
        <input type="text" v-model="searchQuery" placeholder="Search for tickets" />
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Searching...' : 'Search' }}
        </button>
      </form>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
    <div class="recent-tickets-section">
      <h3 @click="toggleRecentTickets">Recent tickets</h3>
      <ul v-if="isRecentTicketsExpanded" class="recent-tickets-list">
        <li v-for="ticket in recentTickets" :key="ticket.id">
          {{ ticket.id }}: {{ ticket.fields.summary }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 300px;
  border-right: 1px solid #ccc;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-section,
.recent-tickets-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-tickets-section h3 {
  cursor: pointer;
  user-select: none;
}

.recent-tickets-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
}
</style>
