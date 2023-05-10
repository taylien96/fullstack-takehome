<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, gql, queryStore } from '@urql/svelte';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import type { UserType } from 'lib/types';

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});

	const result = queryStore<{ users: UserType[] }>({
		client,
		query: gql`
			query {
				users {
					id
					name
					avatar
					email
				}
			}
		`
	});
</script>

<div class="w-full h-full overflow-scroll">
	<div class="flex flex-col gap-4 items-center p-4">
		{#if $result.fetching}
			<Loader />
		{:else if $result.data}
			{#each $result.data.users as user (user.id)}
				<User {user} />
			{/each}
		{/if}
	</div>
</div>
