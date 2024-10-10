import React from 'react';
import { useQuery } from 'react-query';
import { Outlet, useParams, useSearchParams } from 'react-router-dom';
//mui
import { Box, Container, Grid, Typography } from '@mui/material';
//components
import ProjectService from '../../lib/services/Project.service';
import { DefaultPage } from '../../components/Page/Page';
import { ErrorPage } from '../Error.Page';
import { toProperCase } from '../../lib/utils/text.utils';
import { Tree } from '../../components/Tree/Tree';
import { TreeItem } from '../../components/Tree/Tree.Item';
import { TitleBar } from '../../components/Title/Title.Default';
import { ProjectBudgetAddMenuButton } from '../../components/FormControls/Buttons/project/Project.Budget.Add.Button';
import { FormType } from '../../lib/interfaces/Form.interface';
import moment from 'moment';
import { Loading } from '../../components/Loader/Loading';
import { ProjectBudgetMoreButton } from '../../components/FormControls/Buttons/project/Project.Budget.More.Button';

export const ProjectPage = () => {
	const [searchParams] = useSearchParams();
	const params = useParams();
	const id: string = params.id || '';
	const date = moment(searchParams.get('date') || new Date());

	// data
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ['project', id],
		queryFn: async () => ProjectService.getProjectV2(id),
		enabled: !!id,
	});

	const activeDates = React.useMemo(() => {
		// gets the dates where data is available in budget items
		if (data) {
			const _dates: string[] = [];
			data.budgets?.map((budget) => {
				budget?.budgetItems?.map((budgetItem) => {
					if (budgetItem.month && budgetItem.year) {
						_dates.push(`${budgetItem.year}-${budgetItem.month}-01`);
					}
				});
			});
			const dates = [...new Set(_dates)];
			dates.sort((a, b) => (a < b ? -1 : 1));
			return dates;
		} else {
			return [];
		}
	}, [data]);

	if (isLoading) return <Loading />;
	if (isError) return <ErrorPage />;

	return (
		<DefaultPage
			type="default"
			title={data?.name || ''}
			status={toProperCase(data?.type.split('_').join(' '))}
			description={data?.description || ''}
			buttons={[
				<TitleBar
					key="title-bar-project-page"
					options={{ showFilter: false, showCalendar: true, showDateButtons: true, dateButtonValues: activeDates }}
				/>,
			]}
		>
			<Grid container>
				{/* //- MENU */}
				<Grid item xs={0} md={2}>
					<Tree defaultExpanded={['project_budget']}>
						<Box sx={{ px: 2, pt: 2 }}>
							<Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
								<b>Menu</b>
							</Typography>
						</Box>
						{/* //- budgets */}
						<TreeItem
							nodeId="project_budget"
							title="Budget"
							icon="price_change"
							url={`/projects/${id}/dashboard`}
							action={
								<ProjectBudgetAddMenuButton
									type={FormType.new}
									initialValues={{
										projectId: id,
									}}
									onSettled={() => {
										refetch();
									}}
								/>
							}
						>
							{data &&
								data?.budgets?.map((budget, budgetIdx) => {
									return (
										<TreeItem
											key={budget._id}
											nodeId={`project_budget_${budgetIdx}`}
											title={budget.name}
											icon="other_houses"
											url={`/projects/${id}/budget?budgetId=${budget._id}&date=${date.format('YYYY-MM-DD')}`}
											action={<ProjectBudgetMoreButton budget={budget} refetch={refetch} />}
										/>
									);
								})}
						</TreeItem>
						{/* //- timesheets */}
						<TreeItem nodeId="timesheets" title="Timesheets" icon="pending_actions" url={`/projects/${id}/timesheets`} />
						{/* //- performance */}
						<TreeItem nodeId="performance" title="Performance Ratings" icon="stars_rate_half" url={`/projects/${id}/performance`} />
					</Tree>
				</Grid>

				{/* //- BODY */}
				<Grid item xs={12} md={10}>
					<Container maxWidth={false} sx={{ overflow: 'auto' }}>
						<Outlet />
					</Container>
				</Grid>
			</Grid>
		</DefaultPage>
	);
};
