import React from 'react';
import moment, { Moment } from 'moment';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
// mui
import { Button, Icon, Stack, Typography } from '@mui/material';
// components
import { DefaultBody } from '../../../components/Layouts/Layout.Default';
import { ProjectTimesheetTable } from '../../../components/TableControls/Table.Project.Timesheets';
import { Card } from '../../../components/Card/Card';
import TimesheetService from '../../../lib/services/Timesheet.service';
import { Loading } from '../../../components/Loader/Loading';
import { ErrorPage } from '../../Error.Page';
//components

export const ProjectTimesheetsPage = () => {
	const [searchParams] = useSearchParams();
	const _date = moment(searchParams.get('date') || new Date());
	const params = useParams();
	const projectId: string = params.id || '';
	const [date, setDate] = React.useState<Moment>(_date);

	// data
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: date.toISOString(),
		queryFn: async () => TimesheetService.getTimesheetsByEmployeeV2(projectId, moment(date).format('YYYY-MM-DD')),
		enabled: !!projectId && !!date,
	});

	React.useEffect(() => {
		if (_date.format('YYYY-MM-DD') !== date.format('YYYY-MM-DD')) {
			setDate(_date);
			refetch();
		}
	}, [_date]);

	if (isLoading) return <Loading type="outlet" />;
	if (!data) return <Loading type="outlet" message="Building view" />;
	if (isError) return <ErrorPage />;

	return (
		<DefaultBody>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Stack>
					<Typography variant="h6">
						<b>Project Timesheets</b>
					</Typography>
				</Stack>
			</Stack>

			<Stack spacing={2} sx={{ width: '100%' }}>
				<Card
					title="Timesheet entries"
					// component={
					// 	<Button size="small" variant="contained" color="success" startIcon={<Icon>thumb_up</Icon>} disableElevation>
					// 		Approve
					// 	</Button>
					// }
				>
					<ProjectTimesheetTable employees={data} refetch={refetch} />
				</Card>
			</Stack>
		</DefaultBody>
	);
};
