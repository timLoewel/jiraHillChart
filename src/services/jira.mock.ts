/**
 * Mock Jira Service for testing purposes.
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

const mockTickets = {
    'PROJ-123': {
        id: 'PROJ-123',
        title: 'A really cool feature',
        project: 'PROJ',
        status: 'In Progress',
    },
    'PROJ-124': {
        id: 'PROJ-124',
        title: 'Another important task',
        project: 'PROJ',
        status: 'In Progress',
    },
    'PROJ-125': {
        id: 'PROJ-125',
        title: 'A cool bug fix',
        project: 'PROJ',
        status: 'In Progress',
    },
    'ANOTHER-1': {
        id: 'ANOTHER-1',
        title: 'Some other ticket',
        project: 'ANOTHER',
        status: 'In Progress',
    }
};

function simulateDelay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function verifyTokenAndGetUser(host: string, token: string): Promise<any> {
  await simulateDelay();
  if (host !== 'https://mock-jira.example.com') {
    throw new Error(`Host not found: ${host}`);
  }
  const user = (mockUsers as any)[token];
  if (user) {
    return user;
  }
  throw new Error('Unauthorized: Invalid token');
}

export async function searchForInProgressTickets(project: string): Promise<any[]> {
    await simulateDelay();
    const tickets = Object.values(mockTickets).filter(
        ticket => ticket.project === project && ticket.status === 'In Progress'
    );
    return tickets;
}

export async function getTicket(ticketId: string): Promise<any> {
    await simulateDelay();
    const ticket = (mockTickets as any)[ticketId];
    if (ticket) {
        return ticket;
    }
    throw new Error(`Ticket not found: ${ticketId}`);
}

export async function updateTicketTitle(ticketId: string, newTitle: string): Promise<void> {
    await simulateDelay();
    const ticket = (mockTickets as any)[ticketId];
    if (ticket) {
        ticket.title = newTitle;
        console.log(`Mock Jira: Updated ticket ${ticketId} title to "${newTitle}"`);
        return;
    }
    throw new Error(`Ticket not found: ${ticketId}`);
}
