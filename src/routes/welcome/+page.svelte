<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';
	import { selectedTicket } from '$lib/stores/selectedTicket';
	import { page } from '$app/stores';

	let { data, form }: { data: PageServerData, form: ActionData } = $props();

	const ticket = selectedTicket;
	const error = $page.url.searchParams.get('error');
</script>

{#if $ticket}
	<h1>{$ticket.title}</h1>
{:else}
	<h1>Hi, {data.user.username}!</h1>
	<p>Your user ID is {data.user.id}.</p>

	{#if error === 'invalid_token'}
		<p style="color: red;">Your Jira API key is invalid or has expired. Please enter a new one.</p>
	{/if}

	{#if data.user.jiraApiKey && error !== 'invalid_token'}
		<p>Your Jira API key is configured.</p>
	{:else}
		<form method="post" action="?/jira" use:enhance>
			<h2>Connect to Jira</h2>
			<p>
				Enter your Jira API key to connect your account.
			</p>
			<label>
				Jira API Key
				<input name="jira-api-key" type="password" />
			</label>
			<button>Save</button>
			{#if form?.error}
				<p style="color: red">{form.error}</p>
			{/if}
		</form>
	{/if}
{/if}

<form method="post" action="?/logout" use:enhance>
	<button>Sign out</button>
</form>
