import { useQuery } from 'react-query';
import { useParams, useSearchParams } from 'react-router-dom';
//mui
//components
import ProjectService from '../../../lib/services/Project.service';
import { Loading } from '../../../components/Loader/Loading';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { BudgetTypeEnumV2, IBudgetItemV2 } from '../../../lib/interfaces/Budget.interface';
import { ErrorSnackbar } from '../../../components/Errors/Error.Snackbar';
import { ErrorPage } from '../../Error.Page';
import { DefaultBody } from '../../../components/Layouts/Layout.Default';
import { ProjectBudgetSummaryTable } from '../../../components/TableControls/Table.Project.Budget.Summary';
import { Card } from '../../../components/Card/Card';

export const ProjectDashboardPage = () => {
	const [searchParams] = useSearchParams();
	const params = useParams();
	const projectId: string = params.id || '';

	const [submitError, setSubmitError] = React.useState<string | undefined>();

	const [budgetItems, setBudgetItems] = React.useState<IBudgetItemV2[] | undefined>([]);
	const [expenseItems, setExpenseItems] = React.useState<IBudgetItemV2[] | undefined>([]);

	// data
	const { data, isLoading, isError } = useQuery({
		queryKey: ['project', projectId],
		queryFn: async () => ProjectService.getProjectV2(projectId),
		enabled: !!projectId,
	});

	React.useEffect(() => {
		if (data) {
			const budgets: IBudgetItemV2[] = [];
			const expenses: IBudgetItemV2[] = [];
			data.budgets?.map((budget) => {
				budget &&
					budget?.budgetItems?.map((budgetItem) => {
						if (budgetItem.type === BudgetTypeEnumV2.budget) budgets.push(budgetItem);
						if (budgetItem.type === BudgetTypeEnumV2.expense) expenses.push(budgetItem);
					});
			});
			setBudgetItems(data.budgetItems);
			
			setExpenseItems(expenses);
		}
	}, [data]);

	if (isLoading) return <Loading />;
	if (isError) return <ErrorPage />;

	return (
		<DefaultBody>
			<Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
				<Typography variant="h6" color="secondary">
					<b>{data?.name || ''} Summary</b>
				</Typography>
			</Stack>

			<Stack spacing={2}>
				<Box maxWidth="xl">
					<Card title="Summary" disabledGutters={true}>
						<ProjectBudgetSummaryTable budgetItems={data?.budgetItems} budgets={data?.budgets || []} />
					</Card>
				</Box>
			</Stack>
			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</DefaultBody>
	);
};
