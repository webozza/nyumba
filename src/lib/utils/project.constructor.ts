import moment from 'moment';
import { BudgetTypeEnumV2 } from '../interfaces/Budget.interface';
import { IProjectV2 } from '../interfaces/Project.interface';

interface Props {
	data: IProjectV2;
	date: string;
	budgetId: string;
}

export const constructBudgetAndExpense = ({ budgetId, data, date }: Props) => {
	const _currentBudget = data?.budgets?.find((b) => b._id === budgetId);

	// determines if there are any items from last month.
	// If so enable the 'import from last month' button
	let canImportBudget: any | boolean =
		_currentBudget?.budgetItems
			?.filter((item) => item.type === BudgetTypeEnumV2.budget)
			?.filter(
				(item) =>
					item.year === Number(moment(date).subtract(1, 'months').format('YYYY')) &&
					item.month === Number(moment(date).subtract(1, 'months').format('MM'))
			).length || 0;
	canImportBudget = canImportBudget === 0 ? false : true;

	let canImportExpense: any | boolean =
		_currentBudget?.budgetItems
			?.filter((item) => item.type === BudgetTypeEnumV2.expense)
			?.filter(
				(item) =>
					item.year === Number(moment(date).subtract(1, 'months').format('YYYY')) &&
					item.month === Number(moment(date).subtract(1, 'months').format('MM'))
			).length || 0;
	canImportExpense = canImportExpense === 0 ? false : true;

	const _currentBudgetItems = _currentBudget?.budgetItems
		?.filter((item) => item.type === BudgetTypeEnumV2.budget)
		?.filter((item) => item.year === Number(date?.split('-')[0]) && item.month === Number(date?.split('-')[1]));
	_currentBudgetItems?.push({
		budgetId: budgetId || '',
		description: '',
		type: BudgetTypeEnumV2.budget,
	});

	const _currentExpenseItems = _currentBudget?.budgetItems
		?.filter((item) => item.type === BudgetTypeEnumV2.expense)
		?.filter((item) => item.year === Number(date?.split('-')[0]) && item.month === Number(date?.split('-')[1]));
	_currentExpenseItems?.push({
		budgetId: budgetId || '',
		description: '',
		type: BudgetTypeEnumV2.expense,
	});

	return {
		currentBudgetItems: _currentBudgetItems,
		currentExpenseItems: _currentExpenseItems,
		canImportBudget: canImportBudget as boolean,
		canImportExpense: canImportExpense as boolean,
	};
};
