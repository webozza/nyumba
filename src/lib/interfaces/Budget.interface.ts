// - new
export enum BudgetTypeEnumV2 {
	expense = 'expense',
	budget = 'budget',
}
export interface IBudgetV2 {
	_id: string;
	projectId: string;
	name: string;
	description?: string;
	budgetItems?: IBudgetItemV2[];
	totalAmount?: number;
	totalInvoice?: number;
	averageCount?: number;
	fromBudgetId?: string; // used for copying from another budget item
}

export interface IBudgetItemV2 {
	_id?: string;
	name?: string;
	budgetId: string;
	description?: string;
	m2?: number;
	ratePerM2?: number;
	amount?: number;
	completedPercentage?: number;
	month?: number;
	year?: number;
	type?: BudgetTypeEnumV2;
}

export interface IBudgetItemValueV2 {
	budgetId: string;
	name: string;
	amount: number;
	month: number;
	year: number;
}

//- needs conversion to v2
export enum BudgetTypeEnum {
	expense = 'expense',
	budget = 'budget',
}

export default interface IBudgetItem {
	_id?: string;
	projectId?: string;
	description?: string;
	amount?: number;
	tags?: string[];
	type?: BudgetTypeEnum;
}

export interface ISubBudgetResponse {
	_id: string;
	description: string;
	amount: number;
	type: BudgetTypeEnum;
}

export interface IGetBudget {
	_id: string;
}
export interface IAddBudgetReponse {
	_id: string;
	projectId: string;
}
export interface IDeleteBudgetParams {
	_id: string;
}
