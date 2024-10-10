import moment from 'moment';
import nyumbaApi from '../data/axios';
import { IPayReview, IPayrunEmployee, IPayrunEmployeeV2 } from '../interfaces/Payrun.interface';
import { IProjectEmployeeV2 } from '../interfaces/Project.interface';

// - v2
const getProjectPayrunV2 = async (props: any): Promise<any> => {
	const data: IProjectEmployeeV2[] = await nyumbaApi({
		method: 'get',
		url: `/v2/payrun/${props?.queryKey[1]?.projectId}?month=${props?.queryKey[1]?.month}&year=${props?.queryKey[1]?.year}`,
	})
		.then((res: any) => {
			return res.data.payrun;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const createOrUpdatePayrunV2 = async (payrun: IPayrunEmployeeV2): Promise<any> => {
	const data: IPayrunEmployeeV2[] = await nyumbaApi({
		method: 'post',
		url: `/v2/payrun`,
		data: JSON.stringify(payrun),
	})
		.then((res: any) => {
			return res.data.payruns;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

//- to be converted
const createOrUpdatePayrun = async (payrun: IPayrunEmployee): Promise<any> => {
	const data: IPayrunEmployee[] = await nyumbaApi({
		method: 'post',
		url: `/payrun`,
		data: JSON.stringify(payrun),
	})
		.then((res: any) => {
			return res.data.payruns;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const getPayrunByDate = async (keys: any): Promise<IPayReview[]> => {
	const data: IPayReview[] = await nyumbaApi({
		method: 'post',
		url: `/payrun/${moment(keys?.queryKey[1]).format('YYYY-MM-DD')}`,
	})
		.then((res: any) => {
			return res.data.payruns;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const PayrunService = {
	getPayrunByDate,
	createOrUpdatePayrun,
	createOrUpdatePayrunV2,
	getProjectPayrunV2,
};

export default PayrunService;
