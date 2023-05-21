
<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, getContextClient, gql, queryStore, setContextClient } from '@urql/svelte';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import type { UserPageType, UserType, viewing } from 'lib/types';
	

	
	let moreToQuery: boolean = true;
	let userQueryError: boolean = false;


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

	let userArray : UserType[] = []
	
	let intersectionObs = <IntersectionObserver | null>null;

	const createIntersectionObs: any = () => {
		if (intersectionObs) return;
		intersectionObs = new IntersectionObserver(
			(elements) => {
				elements.forEach(element => {
					const event = element.isIntersecting ? 'viewing' : 'notViewing'
					element.target.dispatchEvent(new CustomEvent(event))
				});
			}
		)
	}

	const observer: any = (element: HTMLElement) => {
		createIntersectionObs();
		intersectionObs?.observe(element);
		return {
			unobserve(){
				intersectionObs?.unobserve(element);
			}
		}
	}
	
	const getNextPage = () =>{
		from = from + 10;
  		if ($result && $result.data && $result.data.users) {
    		userArray = userArray.concat($result.data.users.users);
    		if (userArray.length >= $result.data.users.total_count) {
     		moreToQuery = false;
    		}
  		} else{
			userQueryError = true;
		}
	}
</script>

<svelte:window />

<div class="w-full h-full">
	<div class="flex flex-col gap-4 items-center p-4">
		{#if userArray[0]}
		{#each userArray as user (user.id)}
			<User {user} />
		{/each}
		{/if}
		{#if $result.fetching && moreToQuery}
			<Loader />
		{:else}
			<span use:observer
			on:viewing={getNextPage}
			></span>
		{/if}
	</div>
</div>