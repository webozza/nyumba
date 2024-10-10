import { useQuery } from 'react-query';
import { useParams, useSearchParams } from 'react-router-dom';
//mui
//components
import ProjectService from '../../../lib/services/Project.service';
import { Card } from '../../../components/Card/Card';
import { Box, Button, Icon, Stack, Typography } from '@mui/material';
import React from 'react';
import { BudgetTypeEnumV2, IBudgetItemV2 } from '../../../lib/interfaces/Budget.interface';
import { ProjectBudgetTable } from '../../../components/TableControls/Table.Project.Budget';
import { ErrorSnackbar } from '../../../components/Errors/Error.Snackbar';
import { ProjectExpenseTable } from '../../../components/TableControls/Table.Project.Expense';
import { ErrorPage } from '../../Error.Page';
import { DefaultBody } from '../../../components/Layouts/Layout.Default';
import { Loading } from '../../../components/Loader/Loading';
import { constructBudgetAndExpense } from '../../../lib/utils/project.constructor';

export const ProjectBudgetPage = () => {
	const [searchParams] = useSearchParams();
	const params = useParams();
	const date = searchParams.get('date');
	const budgetId = searchParams.get('budgetId');
	const projectId: string = params.id || '';
	const [submitError, setSubmitError] = React.useState<string | undefined>();

	const [budgetItems, setBudgetItems] = React.useState<IBudgetItemV2[] | undefined>([]);
	const [canImportBudgetItems, setCanImportBudgetItems] = React.useState<boolean>(false);
	const [canImportExpenseItems, setCanImportExpenseItems] = React.useState<boolean>(false);
	const [expenseItems, setExpenseItems] = React.useState<IBudgetItemV2[] | undefined>([]);

	// data
	const { data, refetch, isLoading, isError } = useQuery({
		queryKey: ['project', projectId],
		queryFn: async () => ProjectService.getProjectV2(projectId),
		enabled: !!projectId,
	});

	React.useEffect(() => {
		//constructs the Budget and Expense items based on the Year, Month and BudgetId properties
		if (data && date) {
			const { currentBudgetItems, currentExpenseItems, canImportBudget, canImportExpense } = constructBudgetAndExpense({
				budgetId: budgetId || '',
				data,
				date,
			});

			setBudgetItems(currentBudgetItems);
			setExpenseItems(currentExpenseItems);
			setCanImportBudgetItems(canImportBudget);
			setCanImportExpenseItems(canImportExpense);
		}
	}, [data, date, budgetId]);

	if (isLoading || budgetItems === undefined || expenseItems === undefined) return <Loading />;
	if (isError) return <ErrorPage />;
	if (!budgetId) return <ErrorPage message="No budget id provided" />;

	return (
		<DefaultBody>
			<Stack sx={{ mb: 2 }}>
				<Typography variant="h6" color="secondary">
					<b>{data?.budgets?.find((budget) => budget._id.toString() === budgetId.toString())?.name || ''}</b>
				</Typography>
			</Stack>

			<Stack spacing={2}>
				<Box sx={{ width: '1040px' }}>
					<Card
						title="Budget"
						component={
							<Button size="small" variant="contained" color="success" startIcon={<Icon>thumb_up</Icon>} disableElevation>
								Approve
							</Button>
						}
					>
						<ProjectBudgetTable
							refetch={refetch}
							budgetItems={budgetItems}
							type={BudgetTypeEnumV2.budget}
							enabledImport={canImportBudgetItems}
						/>
					</Card>
				</Box>

				<Box sx={{ width: '700px' }}>
					<Card
						title="Expenses"
						component={
							<Button size="small" variant="contained" color="success" startIcon={<Icon>thumb_up</Icon>} disableElevation>
								Approve
							</Button>
						}
					>
						<ProjectExpenseTable
							refetch={refetch}
							expenseItems={expenseItems}
							type={BudgetTypeEnumV2.expense}
							enabledImport={canImportExpenseItems}
						/>
					</Card>
				</Box>
			</Stack>
			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</DefaultBody>
	);
};
