import moment from 'moment';
import nyumbaApi from '../data/axios';
import { IEmployeeAdvances, IEmployeeAdvancesDetail } from '../interfaces/Advance.interface';

const getEmployeeAdvances = async (keys: any): Promise<IEmployeeAdvances[]> => {
	const data: any = await nyumbaApi({
		method: 'post',
		url: `/advance/${moment(keys?.queryKey[1]).format('YYYY-MM-DD')}`,
	})
		.then((res: any) => {
			return res.data.advances;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const createOrUpdateAdvance = async (payrun: IEmployeeAdvancesDetail): Promise<any> => {
	const data: any = await nyumbaApi({
		method: 'patch',
		url: `/advance`,
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

const AdvanceService = {
	getEmployeeAdvances,
	createOrUpdateAdvance,
};

export default AdvanceService;
