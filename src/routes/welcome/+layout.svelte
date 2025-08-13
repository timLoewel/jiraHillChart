<script lang="ts">
	import JiraSearch from '$lib/components/JiraSearch.svelte';
	let { children } = $props();
</script>

<div class="welcome-layout">
	<aside class="sidebar">
		<JiraSearch />
	</aside>
	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	.welcome-layout {
		display: flex;
		height: 100vh;
	}

	.sidebar {
		width: 300px;
		background-color: #f0f0f0;
		padding: 1rem;
	}

	.main-content {
		flex: 1;
		padding: 1rem;
	}
</style>
