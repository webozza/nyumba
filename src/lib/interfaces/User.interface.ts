export default interface ICurrentUser {
	_id: string;
	name: string;
	email: string;
	roles: string[];
}
export default interface IUser {
	_id: string;
	name: string;
	email: string;
	roles: string[];
	password: string;
}
export interface IUserCached {
	_id: string;
	name: string;
	email: string;
	roles: string[];
}
export interface ICreateUserParams {
	name?: string;
	email?: string;
	roles?: string[];
	password?: string;
	confirmPassword?: string;
}
export interface IUpdateUserParams {
	_id: string;
	name?: string;
	email?: string;
	roles?: string[];
}
export interface IUpdateUserPasswordParams {
	_id: string;
	name?: string;
	password: string;
	confirmPassword?: string;
}
export interface IDeleteUserParams {
	_id: string;
}
