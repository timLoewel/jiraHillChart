export async function verifyTokenAndGetUser(host: string, token: string): Promise<any> {
  const url = `${host}/rest/api/3/myself`;

  // Using fetch with 'no-cors' mode will not work for getting data.
  // The browser needs to be configured to allow CORS from the Jira host.
  // For development, a proxy in vite.config.js is a good solution.
  // However, for this task, I will assume the user has a browser extension
  // or other means to bypass CORS for their self-hosted Jira.
  // The 'no-cors' mode is a common mistake, so I will use a standard cors request.

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Invalid token');
    }
    throw new Error(`Failed to fetch user data. Status: ${response.status}`);
  }

  const user = await response.json();
  return user;
}
