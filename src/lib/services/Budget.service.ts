import nyumbaApi from '../data/axios';
import IBudgetItem, { BudgetTypeEnumV2, IBudgetItemV2, IBudgetV2, IDeleteBudgetParams } from '../interfaces/Budget.interface';

//- v2
const createBudgetV2 = async (budget: IBudgetV2): Promise<any> => {
	const data: IBudgetV2[] = await nyumbaApi({
		method: 'post',
		url: `/v2/budget`,
		data: JSON.stringify(budget),
	})
		.then((res: any) => {
			return res.data.payruns;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const updateBudgetV2 = async (budget: IBudgetV2): Promise<any> => {
	const data: IBudgetV2[] = await nyumbaApi({
		method: 'patch',
		url: `/v2/budget`,
		data: JSON.stringify(budget),
	})
		.then((res: any) => {
			return res.data.payruns;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

export type CopyBudgetProps = {
	fromBudgetId: string;
	name: string;
};
const copyBudgetV2 = async (budget: CopyBudgetProps): Promise<any> => {
	const data: CopyBudgetProps[] = await nyumbaApi({
		method: 'post',
		url: `/v2/budget/copy`,
		data: JSON.stringify(budget),
	})
		.then((res: any) => {
			return res.data.payruns;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

export type DeleteBudgetProps = {
	budgetId: string;
};
const deleteBudgetV2 = async (budget: DeleteBudgetProps): Promise<any> => {
	const data: CopyBudgetProps[] = await nyumbaApi({
		method: 'delete',
		url: `/v2/budget/${budget.budgetId}/`,
	})
		.then((res: any) => {
			return res.data.payruns;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const createOrUpdateBudgetItemV2 = async (budget: IBudgetItemV2): Promise<any> => {
	const data: IBudgetItemV2[] = await nyumbaApi({
		method: 'post',
		url: `/v2/budgetItem`,
		data: JSON.stringify(budget),
	})
		.then((res: any) => {
			return res.data.payruns;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

export type CopyBudgetItemsFromLastMonthProps = {
	budgetId: string;
	destMonth: Date;
	type: BudgetTypeEnumV2;
};
const importBudgetItemsFromLastMonthV2 = async (budget: CopyBudgetItemsFromLastMonthProps): Promise<any> => {
	const data: CopyBudgetProps[] = await nyumbaApi({
		method: 'post',
		url: `/v2/budgetItem/importFromLastMonth`,
		data: JSON.stringify(budget),
	})
		.then((res: any) => {
			return res.data.payruns;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

//- needs to be converted to v2
const addBudgetItem = async (budget: IBudgetItem): Promise<IBudgetItem> => {
	const data: IBudgetItem = await nyumbaApi({
		method: 'post',
		url: '/budget',
		data: JSON.stringify(budget),
	})
		.then((res: any) => {
			return res.data.budget;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const updateBudgetItem = async (budget: IBudgetItem): Promise<IBudgetItem> => {
	const data: IBudgetItem = await nyumbaApi({
		method: 'patch',
		url: `/budget/${budget._id}`,
		data: JSON.stringify(budget),
	})
		.then((res: any) => {
			return res.data.budget;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const deleteBudgetItem = async (budget: IDeleteBudgetParams): Promise<unknown> => {
	await nyumbaApi({
		method: 'delete',
		url: `/budget/${budget._id}`,
		data: JSON.stringify(budget),
	}).catch((reason) => {
		throw new Error(reason.response.data.message);
	});
	return { status: 'success' };
};

const BudgetService = {
	addBudgetItem,
	updateBudgetItem,
	deleteBudgetItem,
	//- v2
	createOrUpdateBudgetItemV2,
	createBudgetV2,
	updateBudgetV2,
	copyBudgetV2,
	deleteBudgetV2,
	importBudgetItemsFromLastMonthV2,
};

export default BudgetService;
