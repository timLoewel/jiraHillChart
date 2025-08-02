/**
 * Mock Jira Service for testing purposes.
 * This service simulates the behavior of the real Jira API without making actual network requests.
 */

// A simple mock database of users and their tokens.
const mockUsers = {
  'valid-token-for-user1': {
    accountId: '12345',
    emailAddress: 'user1@example.com',
    displayName: 'Test User 1',
    active: true,
    avatarUrls: {
      '48x48': 'https://via.placeholder.com/48/0000FF/FFFFFF?text=U1',
    },
  },
  'valid-token-for-user2': {
    accountId: '67890',
    emailAddress: 'user2@example.com',
    displayName: 'Test User 2',
    active: true,
    avatarUrls: {
      '48x48': 'https://via.placeholder.com/48/FF0000/FFFFFF?text=U2',
    },
  },
};

export async function verifyTokenAndGetUser(host: string, token: string): Promise<any> {
  console.log(`Mock Jira Service: verifyTokenAndGetUser called with host: ${host}, token: ${token}`);

  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (host !== 'https://mock-jira.example.com') {
        return reject(new Error(`Host not found: ${host}`));
      }

      const user = (mockUsers as any)[token];

      if (user) {
        console.log('Mock Jira Service: Found user', user);
        resolve(user);
      } else {
        console.log('Mock Jira Service: Token invalid');
        reject(new Error('Unauthorized: Invalid token'));
      }
    }, 500);
  });
}

const mockTickets = {
  'TICKET-1': {
    id: 'TICKET-1',
    fields: {
      summary: 'Implement search feature',
      description: 'Implement the search feature for tickets in the sidebar.',
    },
  },
};

export async function getTicket(host: string, token: string, ticketId: string): Promise<any> {
  console.log(`Mock Jira Service: getTicket called with host: ${host}, token: ${token}, ticketId: ${ticketId}`);

  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (host !== 'https://mock-jira.example.com') {
        return reject(new Error(`Host not found: ${host}`));
      }

      if (!(token in mockUsers)) {
        return reject(new Error('Unauthorized: Invalid token'));
      }

      const ticket = (mockTickets as any)[ticketId];

      if (ticket) {
        console.log('Mock Jira Service: Found ticket', ticket);
        resolve(ticket);
      } else {
        console.log('Mock Jira Service: Ticket not found');
        reject(new Error(`Ticket not found: ${ticketId}`));
      }
    }, 500);
  });
}
