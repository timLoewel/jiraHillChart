import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jiraApi } from '@/services/jiraApi'

// Define the structure of a Jira issue for type safety
export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string | null; // Description can be null
    project: {
      key: string;
      name: string;
    };
    status: {
      name: string;
    };
  };
}

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref<JiraIssue[]>([])
  const selectedTicketId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const projectFilter = ref('')
  const statusFilter = ref('')

  const selectedTicket = computed(() => {
    return tickets.value.find(t => t.id === selectedTicketId.value) || null;
  });

  const filteredTickets = computed(() => {
    return tickets.value.filter(ticket => {
      const projectMatch = projectFilter.value
        ? ticket.fields.project.key.toLowerCase().includes(projectFilter.value.toLowerCase())
        : true;
      const statusMatch = statusFilter.value
        ? ticket.fields.status.name.toLowerCase().includes(statusFilter.value.toLowerCase())
        : true;
      return projectMatch && statusMatch;
    });
  });

  async function fetchTickets() {
    isLoading.value = true
    error.value = null
    try {
      // Assuming getAssignedIssues returns an array of JiraIssue
      const issues: JiraIssue[] = await jiraApi.getAssignedIssues();
      tickets.value = issues;
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch tickets';
      tickets.value = []; // Clear tickets on error
    } finally {
      isLoading.value = false
    }
  }

  function selectTicket(ticketId: string | null) {
    selectedTicketId.value = ticketId;
  }

  return {
    tickets,
    selectedTicketId,
    selectedTicket,
    isLoading,
    error,
    projectFilter,
    statusFilter,
    filteredTickets,
    fetchTickets,
    selectTicket,
  }
})
