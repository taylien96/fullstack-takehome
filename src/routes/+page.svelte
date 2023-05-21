
<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, getContextClient, gql, queryStore, setContextClient } from '@urql/svelte';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import type { UserPageType } from 'lib/types';
	
	function getNextPage(){
		from = from + 10
	}

	let y: number;
	let x: number;
	let h: number;

	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});
	setContextClient(client)
	let limit: number = 10;
	let from: number = 0;
	$: result = queryStore<{ users: UserPageType }>({
		client: getContextClient(),
		query: gql`
			query ($from: Int!, $limit: Int!) {
				users (from: $from, limit: $limit){
					users {
						id 
						name
						avatar
						email
					}
					total_count
				}
			}
		`,
		variables:{from, limit}
	});
	
	

</script>

<svelte:window bind:scrollY={y} bind:innerHeight={x} />

<div bind:clientHeight={h} class="w-full h-full">
	<div class="flex flex-col gap-4 items-center p-4">
		{#if $result.data?.users}
		{#each $result.data.users.users as user (user.id)}
			<User {user} />
		{/each}
		{/if}
		{#if $result.fetching}
			<Loader />
		{/if}
	</div>
	<p>{y} and {x} and {h}</p>
</div>