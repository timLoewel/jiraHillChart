<script lang="ts">
	import '../app.css';
	
	let { children, data } = $props<{ data: { session: any } | undefined }>();
	console.log('data: ')
	console.log(data)
</script>

<nav class="flex justify-end p-4">
	{#if data?.user}
		<div class="flex items-center gap-4">
			<span class="text-gray-700">Welcome, {data.user.username}</span>
			<a href="/logout" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm rounded">Logout</a>
		</div>
	{:else}
		<a href="/login" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Login</a>
	{/if}
</nav>
{@render children()}
