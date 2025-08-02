# How to Use the Mock Jira Service in Tests

The `src/services/jira.mock.ts` file provides a mock implementation of the Jira service that can be used in unit and component tests. This allows you to test your components' behavior without making real network requests, which makes your tests faster and more reliable.

## Usage with Vitest or Jest

Most modern JavaScript testing frameworks, like [Vitest](https://vitest.dev/) and [Jest](https://jestjs.io/), have built-in support for mocking modules. You can use this feature to replace the real `jira.ts` service with the mock `jira.mock.ts` service in your test files.

Here is an example of how you might test the `Login.vue` component using Vitest and [Vue Test Utils](https://test-utils.vuejs.org/).

### Example: `Login.vue.test.ts`

```typescript
// src/components/__tests__/Login.vue.test.ts

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Login from '../Login.vue';

// 1. Mock the module
// This tells Vitest that whenever any file imports '../services/jira',
// it should receive the mock implementation instead of the real one.
vi.mock('../services/jira', async () => {
  const actual = await vi.importActual('../services/jira.mock');
  return actual;
});

describe('Login.vue', () => {
  it('emits login-success on successful login', async () => {
    const wrapper = mount(Login);

    // 2. Fill in the form
    await wrapper.find('input[id="jiraHost"]').setValue('https://mock-jira.example.com');
    await wrapper.find('input[id="token"]').setValue('valid-token-for-user1');

    // 3. Trigger the login
    await wrapper.find('form').trigger('submit.prevent');

    // 4. Assert that the component emitted the 'login-success' event
    //    with the correct user data from the mock service.
    expect(wrapper.emitted('login-success')).toBeTruthy();
    expect(wrapper.emitted('login-success')[0]).toEqual([
      'https://mock-jira.example.com',
      'valid-token-for-user1',
      {
        accountId: '12345',
        emailAddress: 'user1@example.com',
        displayName: 'Test User 1',
        active: true,
        avatarUrls: {
          '48x48': 'https://via.placeholder.com/48/0000FF/FFFFFF?text=U1',
        },
      },
    ]);
  });

  it('shows an error message on failed login', async () => {
    const wrapper = mount(Login);

    await wrapper.find('input[id="jiraHost"]').setValue('https://mock-jira.example.com');
    await wrapper.find('input[id="token"]').setValue('invalid-token');
    await wrapper.find('form').trigger('submit.prevent');

    // Check that the error message is displayed
    const errorMessage = wrapper.find('p[style="color: red;"]');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toContain('Unauthorized: Invalid token');
  });
});
```

### Key Concepts

1.  **`vi.mock(modulePath, factory)`**: This is the core of the technique. You provide the path to the module you want to mock (the real service) and a factory function that returns the mock implementation.
2.  **`importActual`**: We use `vi.importActual` to get the real exports from our mock file.
3.  **Testing Component Behavior**: Once the mock is in place, you can interact with your component (e.g., fill forms, click buttons) and assert that it behaves correctly based on the data returned from the mock service. You can test both success and failure cases easily by providing different inputs.

This approach allows you to test the logic and rendering of your Vue components in complete isolation, leading to more robust and maintainable code.
