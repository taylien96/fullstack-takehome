export type UserType = {
	id: string;
	name: string;
	email: string;
	avatar: string;
};
export type UserPageType = {
	users: UserType[]
	total_count: number
}
export type UserSearchPageType = {
	usersSearch: UserType[]
	total_count: number
}
export type viewing = string
