import { createYoga, createSchema } from 'graphql-yoga';
import { useGraphQlJit } from '@envelop/graphql-jit';

import type { RequestEvent } from '@sveltejs/kit';

import { users } from '$lib/data';

import schema from '$lib/schema.gql';

const yogaApp = createYoga<RequestEvent>({
	schema: createSchema({
		typeDefs: schema,
		resolvers: {
			Query: {
				users: (source, args, context, info) => {
					return {users : users.slice(args.from, args.from+args.limit), total_count : users.length}
				},
				usersSearch: (source, args, context, info) => {
					return {users: users.filter((user) => user.name.toLowerCase().includes(args.searchQuery.toLowerCase())).slice(0, args.limit),
					total_count : users.length}
				}
			}
		}
	}),
	plugins: [useGraphQlJit()],
	fetchAPI: globalThis
});

export { yogaApp as GET, yogaApp as POST };
