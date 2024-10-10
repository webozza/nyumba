import React from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router-dom';
//mui
import { Box, Typography } from '@mui/material/';
//components
import IProject from '../../../lib/interfaces/Project.interface';
import ProjectService from '../../../lib/services/Project.service';
import ProjectAddButton from '../../../components/FormControls/Buttons/project/Project.Add.Button';
import { Loading } from '../../../components/Loader/Loading';
import { FormType } from '../../../lib/interfaces/Form.interface';
import { AutoTable, TableRowsTypesEnum } from '../../../components/Table/AutoTable';
import { DefaultPage } from '../../../components/Page/Page';
import { ErrorPage } from '../../Error.Page';
import moment from 'moment';
import { TitleBar } from '../../../components/Title/Title.Default';
import { toProperCase } from '../../../lib/utils/text.utils';

export const DefaultProjectsPage = () => {
	const navigate = useNavigate();
	const [filter, setFilter] = React.useState<string>('');

	const { data, refetch, isLoading, isError }: UseQueryResult<IProject[], Error> = useQuery<IProject[], Error>(
		'projects',
		ProjectService.getProjects
	);

	// filters by search terms
	const filtered = React.useMemo(() => {
		if (data && filter) {
			return data.filter((project) => project.name.toLowerCase().includes(filter.toLowerCase()));
		}
		return data;
	}, [data, filter]);

	const rows = React.useMemo(() => {
		return filtered?.map((project) => {
			return {
				_id: project._id,
				columns: [
					{ type: TableRowsTypesEnum.string, name: 'name', value: project.name },
					{ type: TableRowsTypesEnum.string, name: 'description', value: project.description },
					{ type: TableRowsTypesEnum.string, name: 'type', value: toProperCase(project.type.split('_').join(' ')) },
					{
						type: TableRowsTypesEnum.number,
						name: 'startDate',
						value: moment(project.startDate).unix(),
						component: (
							<Typography variant="body2" align="center">
								{project.startDate ? moment(project.startDate).format('DD MMM YYYY') : ''}
							</Typography>
						),
					},
					{
						type: TableRowsTypesEnum.number,
						name: 'endDate',
						value: moment(project.endDate).unix(),
						component: (
							<Typography variant="body2" align="center">
								{project.endDate ? moment(project.endDate).format('DD MMM YYYY') : ''}
							</Typography>
						),
					},
				],
			};
		});
	}, [filtered]);

	if (isLoading) return <Loading />;
	if (isError) return <ErrorPage />;

	return (
		<DefaultPage
			type="default"
			title="Projects"
			status=""
			description="Manage or add projects."
			buttons={[<ProjectAddButton key={'ProjectFormButton'} type={FormType.new} onSettled={() => refetch()} />]}
		>
			<Box>
				<TitleBar title="Filter on project name" setFilterText={setFilter} options={{ showFilter: true, showCalendar: false }} />
				<AutoTable
					options={{
						canDelete: false,
						onRowClick: (rowId) => {
							navigate(`/projects/${rowId}`);
						},
					}}
					headers={[
						{ name: 'name', label: 'Name', sortable: true },
						{ name: 'description', label: 'Project Description', sortable: true },
						{ name: 'type', label: 'Project Type', sortable: true },
						{ name: 'startDate', label: 'Start', sortable: true, align: 'center' },
						{ name: 'endDate', label: 'End', sortable: true, align: 'center' },
					]}
					rows={rows}
					data={filtered}
				/>
			</Box>
		</DefaultPage>
	);
};
