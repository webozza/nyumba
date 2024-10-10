import axiosClient from 'axios';
import type { AxiosRequestConfig } from 'axios';
import AuthService from '../services/Auth.service';
import { Config } from '../config';
import cookieHelper from '../helpers/cookie.helper';

const instance = axiosClient.create({
	baseURL: Config.BASE_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

instance.defaults.withCredentials = true;
instance.interceptors.request.use(
	(config) => {
		const token = cookieHelper.get('accessToken');

		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(err) => {
		Promise.reject(err);
	}
);

instance.interceptors.response.use(
	(config) => {
		return config;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response.status === 403 && !originalRequest._retry) {
			originalRequest._retry = true;

			const token: any = await AuthService.reissueToken();
			instance.defaults.headers.common['Authorization'] = `Bearer ${token.accessToken}`;
			return instance(originalRequest);
		}
		return Promise.reject(error);
	}
);

const gloveboxAPI = <T>(cfg: AxiosRequestConfig) => instance.request<any, T>(cfg);

export default gloveboxAPI;
