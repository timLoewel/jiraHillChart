<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Login from './components/Login.vue';
import UserProfile from './components/UserProfile.vue';
import ActiveTicketBar from './components/ActiveTicketBar.vue';
import TicketSelector from './components/TicketSelector.vue';
import { getTicket } from './services/jira';

const isLoggedIn = ref(false);
const jiraHost = ref('');
const token = ref('');
const user = ref(null);
const activeTicket = ref<any>(null);
const showTicketSelector = ref(false);

onMounted(async () => {
  const storedToken = localStorage.getItem('jiraToken');
  const storedHost = localStorage.getItem('jiraHost');
  const storedTicketId = localStorage.getItem('activeTicketId');

  if (storedToken && storedHost) {
    token.value = storedToken;
    jiraHost.value = storedHost;
    isLoggedIn.value = true; // Assume logged in, could re-verify token here

    if (storedTicketId) {
        try {
            activeTicket.value = await getTicket(storedTicketId);
        } catch (error) {
            console.error('Failed to fetch stored active ticket:', error);
            localStorage.removeItem('activeTicketId');
        }
    }
  }
});

function handleLoginSuccess(host: string, apiToken: string, userData: any) {
  localStorage.setItem('jiraHost', host);
  localStorage.setItem('jiraToken', apiToken);
  jiraHost.value = host;
  token.value = apiToken;
  user.value = userData;
  isLoggedIn.value = true;
}

function handleLogout() {
  localStorage.removeItem('jiraHost');
  localStorage.removeItem('jiraToken');
  localStorage.removeItem('activeTicketId');
  isLoggedIn.value = false;
  token.value = '';
  jiraHost.value = '';
  user.value = null;
  activeTicket.value = null;
}

function handleTicketSelected(ticket: any) {
    activeTicket.value = ticket;
    localStorage.setItem('activeTicketId', ticket.id);
    showTicketSelector.value = false;
}

</script>

<template>
  <div>
    <div v-if="isLoggedIn">
      <UserProfile :user="user" @logout="handleLogout" />
      <ActiveTicketBar
        v-if="activeTicket"
        :ticket="activeTicket"
        :jira-host="jiraHost"
        @select-ticket-dialog="showTicketSelector = true"
      />
      <div v-else class="no-ticket-selected">
        <button @click="showTicketSelector = true">Select a Ticket</button>
      </div>
      <TicketSelector
        v-if="showTicketSelector"
        @ticket-selected="handleTicketSelected"
        @close="showTicketSelector = false"
      />
    </div>
    <div v-else>
      <Login @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<style scoped>
.no-ticket-selected {
    padding: 1em;
    text-align: center;
}
</style>
