<script lang="ts">
	import { selectedTicket } from '$lib/stores/selectedTicket';
	import { goto } from '$app/navigation';

	let searchTerm = '';
	let searchResults: { id: string; title: string }[] = [];

	async function search() {
		if (searchTerm.trim() === '') {
			searchResults = [];
			return;
		}

		const response = await fetch(`/api/jira/search?term=${encodeURIComponent(searchTerm)}`);
		if (response.ok) {
			searchResults = await response.json();
		} else {
			if (response.status === 401) {
				const { error } = await response.json();
				if (error === 'invalid_token') {
					await goto('/welcome?error=invalid_token');
					return;
				}
			}
			console.error('Failed to fetch search results');
			searchResults = [];
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			search();
		}
	}

	function clearSearch() {
		searchTerm = '';
		searchResults = [];
	}

	function selectTicket(ticket: { id: string; title: string }) {
		selectedTicket.set(ticket);
	}
</script>

<div class="jira-search">
	<div class="search-input-wrapper">
		<input
			type="text"
			bind:value={searchTerm}
			on:keydown={handleKeydown}
			placeholder="Search Jira..."
		/>
		{#if searchTerm}
			<button on:click={clearSearch}>x</button>
		{/if}
	</div>
	<ul class="search-results">
		{#each searchResults as result (result.id)}
			<li>
				<button on:click={() => selectTicket(result)}>
					<span class="ticket-id">{result.id}</span>
					<span class="ticket-title">{result.title}</span>
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.jira-search {
		display: flex;
		flex-direction: column;
	}

	.search-input-wrapper {
		position: relative;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		position: absolute;
		right: 5px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
	}

	.search-results {
		list-style: none;
		padding: 0;
		margin-top: 0.5rem;
	}

	li {
		padding: 0.5rem;
		border-bottom: 1px solid #eee;
	}

	.ticket-id {
		font-weight: bold;
	}
</style>
