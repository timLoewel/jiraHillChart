import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const getApiClient = () => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated || !authStore.jiraUrl || !authStore.token) {
    throw new Error('User is not authenticated');
  }

  // A simple CORS proxy can be used for development if needed.
  // For this exercise, we assume the browser can directly access the Jira API,
  // or a proxy is configured elsewhere.
  const baseURL = `${authStore.jiraUrl}/rest/api/2`;

  const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
      'Authorization': `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  apiClient.interceptors.response.use(
    response => response,
    error => {
      // Basic error handling
      if (error.response) {
        console.error('Jira API Error:', error.response.status, error.response.data);
        alert(`Jira API Error: ${error.response.status} ${error.response.data.errorMessages?.join(', ')}`);
      } else {
        console.error('Jira API Error:', error.message);
        alert(`Jira API Error: ${error.message}`);
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export const jiraApi = {
  async getAssignedIssues() {
    const apiClient = getApiClient();
    const response = await apiClient.get('/search?jql=assignee=currentUser() AND resolution=Unresolved');
    return response.data.issues;
  },

  async updateTicketDescription(issueKey: string, description: string) {
    const apiClient = getApiClient();
    // Jira uses a PUT request to update issues
    await apiClient.put(`/issue/${issueKey}`, {
      fields: {
        description: description
      }
    });
  }
};
