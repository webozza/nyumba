import gloveboxAPI from '../data/axios';
import ILoginParams, { ILoginResponse } from '../interfaces/Login.interface';
import { IUserCached } from '../interfaces/User.interface';
import cookieHelper from '../helpers/cookie.helper';
import axios from 'axios';
import { Config } from '../config';

const login = async ({ email, password }: ILoginParams): Promise<ILoginResponse> => {
	return await axios({
		method: 'POST',
		url: `${Config.BASE_URL}auth/login`,
		data: {
			email,
			password,
		},
		withCredentials: true,
	})
		.then((res: any) => {
			if (!res.data) throw Error('Something went wrong.');

			const { accessToken, user } = res.data;
			cookieHelper.set('accessToken', accessToken);
			localStorage.setItem('user', JSON.stringify(user, null, 2));
			return res.data;
		})
		.catch((reason) => {
			if (reason.response.data.message) throw Error(reason.response.data.message);
			if (reason.response.data) throw Error(reason.response.data);
		});
};

const logout = async () => {
	cookieHelper.destroy('accessToken');
	localStorage.removeItem('user');
	return await gloveboxAPI({
		method: 'POST',
		url: '/auth/logout',
	})
		.catch((data) => {
			return data;
		})
		.catch((err) => {
			throw err;
		});
};

const reissueToken = async () => {
	return await gloveboxAPI({
		method: 'GET',
		url: '/auth/refresh',
		withCredentials: true,
	})
		.then((data: any) => {
			if (data.data.accessToken) {
				cookieHelper.set('accessToken', data?.data?.accessToken as string);
				return data?.data;
			}
		})
		.catch((err) => {
			throw err;
		});
};

const getCurrentUser = (): IUserCached | undefined => {
	const _cache: string = localStorage.getItem('user') || '';
	if (_cache) {
		const cache: IUserCached = JSON.parse(_cache);
		const user: IUserCached = {
			_id: cache._id,
			name: cache.name,
			email: cache.email,
			roles: cache.roles,
		};
		return user;
	}
	return undefined;
};

const AuthService = {
	login,
	logout,
	reissueToken,
	getCurrentUser,
};

export default AuthService;
