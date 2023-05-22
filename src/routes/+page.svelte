
<script lang="ts">
	import { cacheExchange, createClient, fetchExchange, getContextClient, gql, queryStore, setContextClient, type Pausable } from '@urql/svelte';
	import Loader from 'components/Loader.svelte';
	import User from 'components/User.svelte';
	import Error from 'components/Error.svelte';
	import type { UserPageType, UserType, UserSearchPageType } from 'lib/types';
	import Searchbar from 'components/Searchbar.svelte';
	

	
	let moreToQuery: boolean = true;
	let userQueryError: boolean = false;
	let errorMessage: string = ' ';
	let searchQuery: string = '';
	let isPaused: boolean = true; 


	const client = createClient({
		url: '/graphql',
		exchanges: [cacheExchange, fetchExchange]
	});
	
	setContextClient(client)

	let limit: number = 10;
	let from: number = 0;


	$: resultPaginatedQuery = queryStore<{ users: UserPageType }>({
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
	$: resultSearchQuery = queryStore<{usersSearch: UserSearchPageType }>(
		{
		client: getContextClient(),
		query: gql`
			query ($searchQuery: String!, $limit: Int!) {
				usersSearch (searchQuery: $searchQuery, limit: $limit){
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
		variables:{searchQuery, limit},
		pause: isPaused
	});
	let userArray : UserType[] = []
	let userArraySearch : UserType[] = []
	
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
  		if ($resultPaginatedQuery && $resultPaginatedQuery.data && $resultPaginatedQuery.data.users) {
    		userArray = userArray.concat($resultPaginatedQuery.data.users.users);
    		if (userArray.length >= $resultPaginatedQuery.data.users.total_count) {
     		moreToQuery = false;
    		}
			userQueryError = false;
  		} else if($resultPaginatedQuery.error){
			userQueryError = true;
			errorMessage= 'Failed to load more Profiles'
		}
	}
	const searchQueryHandler = (event: CustomEvent<{searchQuery:string}>) =>{
		searchQuery = event.detail.searchQuery
		if(event.detail.searchQuery !== ''){
			isPaused = false
		} else{
			isPaused = true
			userArraySearch = []
		}
	}
	$: {
    	if ($resultSearchQuery.data && $resultSearchQuery.data.usersSearch) {
      		userArraySearch = $resultSearchQuery.data.usersSearch.users;
   		}
    	if ($resultSearchQuery.error && searchQuery) {
      		userQueryError = true;
      		errorMessage = 'Failed to search profiles';
    	}
  	}

	const errorAckowledgeHandler = () =>{
		!userQueryError
	}
</script>

<div class="w-full h-full">
	<div class="flex flex-col gap-4 items-center p-4">
		<Searchbar placeholder="Search Users" on:search={searchQueryHandler}/>
		{#if !searchQuery}
			{#if userArray[0]}
				{#each userArray as user (user.id)}
					<User {user} />
				{/each}
			{/if}
		{:else}
			{#if userArraySearch[0]}
				{#each userArraySearch as user (user.id)}
					<User {user} />
				{/each}
			{/if}
		{/if}
		{#if userQueryError}
			<Error showError={userQueryError} errorMessage={errorMessage} on:acknowledge={errorAckowledgeHandler}/>
		{/if}
		{#if $resultPaginatedQuery.fetching && moreToQuery && !searchQuery}
			<Loader />
		{:else if $resultSearchQuery.fetching}
			<Loader />
		{:else if !searchQuery}
			<span use:observer on:viewing={getNextPage}></span>
		{/if}
	</div>
</div>

