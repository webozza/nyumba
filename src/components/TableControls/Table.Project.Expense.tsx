import { Button, Icon, TableBody, TableRow, Tooltip } from '@mui/material';
import { BudgetTypeEnumV2, IBudgetItemV2 } from '../../lib/interfaces/Budget.interface';
import { useMutation } from 'react-query';
import BudgetService, { CopyBudgetItemsFromLastMonthProps } from '../../lib/services/Budget.service';
import React from 'react';
import { CompactTable } from '../Table/CompactTable';
import { CompactTableHeaderItemProps, CompactTableHeaders } from '../Table/Header/Table.Compact.Headers';
import { ErrorSnackbar } from '../Errors/Error.Snackbar';
import { TableCell, TableCellInputType } from '../Table/Cell';
import { CompactTableRow } from '../Table/Row/Table.Compact.Row';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { toCurrencyText } from '../../lib/utils/text.utils';
import { CompactTableTotalCell } from './Table.Project.Budget';

type Props = {
	expenseItems: IBudgetItemV2[] | undefined;
	type: BudgetTypeEnumV2;
	enabledImport: boolean;
	refetch: () => void;
};

export const ProjectExpenseTable = ({ expenseItems, type, enabledImport, refetch }: Props) => {
	const [searchParams] = useSearchParams();
	const date = moment(searchParams.get('date') || new Date());
	const budgetId = searchParams.get('budgetId') || '';
	const [submitError, setSubmitError] = React.useState<string | undefined>();
	const [importing, setImporting] = React.useState<boolean>(false);

	const updateOrCreateBudgetItem = useMutation<IBudgetItemV2, Error, IBudgetItemV2>(
		async (props: IBudgetItemV2) => BudgetService.createOrUpdateBudgetItemV2(props),
		{
			onMutate: () => {
				setSubmitError(undefined);
			},
			onError: (error) => {
				setSubmitError(error.message);
			},
			onSuccess: () => {
				refetch();
			},
		}
	);

	const importLastMonth = useMutation<CopyBudgetItemsFromLastMonthProps, Error, any>(
		async (props: CopyBudgetItemsFromLastMonthProps) => BudgetService.importBudgetItemsFromLastMonthV2(props),
		{
			onMutate: () => {
				setImporting(true);
				setSubmitError(undefined);
			},
			onError: (error) => {
				setSubmitError(error.message);
			},
			onSettled: () => {
				refetch();
				setImporting(false);
			},
		}
	);

	const handleChange = (name: string, value: string | number, rowIndex: number) => {
		if (expenseItems) {
			const _current = expenseItems.at(rowIndex);
			updateOrCreateBudgetItem.mutate({
				_id: _current?._id || undefined,
				budgetId,
				type,
				month: Number(moment(date).format('MM')),
				year: Number(moment(date).format('YYYY')),
				[name]: value,
			});
		}
	};

	const headers: CompactTableHeaderItemProps[] = [
		{ title: 'Description', width: '50%' },
		{ title: 'Amount', align: 'center', width: '10%' },
	];

	return (
		<CompactTable width={665}>
			<CompactTableHeaders headers={headers} />
			<TableBody>
				{expenseItems &&
					expenseItems?.map((budgetItem: IBudgetItemV2, budgetItemIdx: number) => {
						return (
							<CompactTableRow
								key={`table-row-${type}-${budgetItemIdx}-${budgetItem._id}-${budgetItem.month}-${budgetItem.year}`}
								rowIndex={budgetItemIdx}
								name={type}
								onChange={handleChange}
								columns={[
									{
										inputType: TableCellInputType.text,
										name: 'description',
										value: budgetItem?.description || '',
										align: 'center',
										width: headers[0].width,
										disabled: budgetItem?.name !== undefined ? true : false,
									},
									{
										inputType: TableCellInputType.currency,
										name: 'amount',
										value: budgetItem?.amount || 0,
										align: 'center',
										width: headers[1].width,
									},
								]}
							/>
						);
					})}

				{/* //- total and import*/}
				<TableRow>
					<TableCell>
						<Tooltip title="Click to import the 'Description', 'Qty' (m2/each) and 'Rate' from the previous months entries.">
							<Button
								variant="text"
								size="small"
								startIcon={<Icon fontSize="small">publish</Icon>}
								disabled={!enabledImport || importing}
								onClick={() => {
									importLastMonth.mutate({
										budgetId,
										destMonth: date,
										type: BudgetTypeEnumV2.expense,
									});
								}}
							>
								Import previous month values
							</Button>
						</Tooltip>
					</TableCell>
					<CompactTableTotalCell
						value={`R ${toCurrencyText(
							expenseItems?.reduce((acc, obj) => {
								return (acc += obj?.amount || 0);
							}, 0) || 0
						)}`}
					/>
				</TableRow>
			</TableBody>
			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</CompactTable>
	);
};
