<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';
	import { selectedTicket } from '$lib/stores/selectedTicket';

	let { data, form }: { data: PageServerData, form: ActionData } = $props();

	const ticket = selectedTicket;
</script>

{#if $ticket}
	<h1>{$ticket.title}</h1>
{:else}
	<h1>Hi, {data.user.username}!</h1>
	<p>Your user ID is {data.user.id}.</p>

	{#if data.user.jiraApiKey}
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
