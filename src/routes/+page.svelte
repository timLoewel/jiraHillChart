<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>{data?.user ? `Welcome ${data.user.username}!` : 'Welcome to SvelteKit'}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
