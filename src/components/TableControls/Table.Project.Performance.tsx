//mui
import { Icon, Stack, TableBody, TableRow, Typography } from '@mui/material';
import React from 'react';
import { CompactTable } from '../Table/CompactTable';
import { CompactTableHeaderItemProps, CompactTableHeaders } from '../Table/Header/Table.Compact.Headers';
import { ErrorSnackbar } from '../Errors/Error.Snackbar';
import { TableCell, TableCellInputType } from '../Table/Cell';
import { CompactTableRow } from '../Table/Row/Table.Compact.Row';
import { useMutation, useQuery } from 'react-query';
import { IPayrunEmployeeV2 } from '../../lib/interfaces/Payrun.interface';
import PayrunService from '../../lib/services/Payrun.service';
import moment from 'moment';
import { useParams, useSearchParams } from 'react-router-dom';
import { toCurrencyText, toNumber } from '../../lib/utils/text.utils';
import { IProjectEmployeeV2, IProjectEmployeesTotals } from '../../lib/interfaces/Project.interface';
import { Loading } from '../Loader/Loading';
import { ErrorPage } from '../../pages/Error.Page';
import { CompactTableSubTotalCell, CompactTableTotalCell } from './Table.Project.Budget';

export const ProjectPerformanceTable = () => {
	const params = useParams();
	const [searchParams] = useSearchParams();
	const projectId: string = params.id || '';
	const date = moment(searchParams.get('date') || new Date());

	const [submitError, setSubmitError] = React.useState<string | undefined>();

	// data
	const { data, isLoading, isError, refetch } = useQuery<{ payrun: IProjectEmployeeV2[]; totals: IProjectEmployeesTotals }, Error>(
		[
			`project-performance-ratings-${moment(date).format('YYYY-MM')}`,
			{ projectId, month: moment(date).format('MM'), year: moment(date).format('YYYY') },
		],
		PayrunService.getProjectPayrunV2,
		{ enabled: !!projectId && !!date }
	);

	// mutations
	const updatePayrun = useMutation<any, Error, any>(async (props: IPayrunEmployeeV2) => PayrunService.createOrUpdatePayrunV2(props), {
		onMutate: () => {
			setSubmitError(undefined);
		},
		onError: (error) => {
			setSubmitError(error.message);
		},
		onSettled: () => {
			refetch();
		},
	});

	const handleChange = (employeeId: string, name: string, value: number) => {
		const month = moment(date).format('MM');
		const year = moment(date).format('YYYY');
		updatePayrun.mutate({ projectId, employeeId, month, year, [name]: value });
	};

	const headers: CompactTableHeaderItemProps[] = [
		{ title: 'Employee', width: '20%' },
		{ title: 'Days', align: 'center', width: '13%' },
		{ title: 'Rating', align: 'center', width: '13%' },
		{ title: 'Salary', align: 'center', width: '13%' },
		{ title: 'Site Mgmt', align: 'center', width: '13%' },
		{ title: 'Total', align: 'center', width: '13%' },
	];

	if (isLoading) return <Loading />;
	if (isError) return <ErrorPage />;

	if (!data || data.payrun.length === 0) {
		return (
			<Stack spacing={2} alignItems="center" sx={{ p: 1, color: 'text.secondary' }}>
				<Icon fontSize="large">search</Icon>
				<Typography variant="body2">No pay run information found</Typography>
				<Typography variant="body2">Start by adding a budget and logging some time worked</Typography>
			</Stack>
		);
	}

	return (
		<CompactTable width="1000px">
			<CompactTableHeaders headers={headers} />
			<TableBody key={`table-performance-capture`}>
				{data &&
					data?.payrun?.map((employee: IProjectEmployeeV2, employeeIdx: number) => {
						return (
							<CompactTableRow
								key={`performance-table-row-${employeeIdx + 1}`}
								rowIndex={employeeIdx}
								name={'performance-table-row'}
								onChange={(name: string, value: string | number) => {
									handleChange(employee._id, name, toNumber(value));
								}}
								columns={[
									{
										inputType: TableCellInputType.default,
										name: 'name',
										value: employee?.name || '',
									},
									{
										inputType: TableCellInputType.default,
										name: 'totalEmployeeDays',
										value: toCurrencyText(employee.totalDays),
										align: 'center',
									},
									{
										inputType: TableCellInputType.number,
										name: 'rating',
										value: toCurrencyText(employee.rating),
										align: 'center',
										uom: '%',
									},
									{
										inputType: TableCellInputType.default,
										name: 'salary',
										value: `R ${toCurrencyText(employee.salary)}` || '',
										align: 'center',
									},
									{
										inputType: TableCellInputType.currency,
										name: 'management',
										value: `R ${toCurrencyText(employee.management)}` || '',
										align: 'center',
									},
									{
										inputType: TableCellInputType.default,
										name: 'total',
										value: `R ${toCurrencyText(employee.total)}` || '',
										align: 'center',
									},
								]}
							/>
						);
					})}

				{/* //- total and import*/}
				<TableRow>
					<TableCell></TableCell>
					<CompactTableTotalCell value={toCurrencyText(data.totals.totalDays)} />
					<CompactTableTotalCell value={`${toCurrencyText(data.totals.totalRating)} %`} />
					<CompactTableTotalCell value={`R ${toCurrencyText(data.totals.totalSalaries)}`} />
					<CompactTableTotalCell value={`R ${toCurrencyText(data.totals.totalManagement)}`} />
					<CompactTableTotalCell value={`R ${toCurrencyText(data.totals.totalSalariesInclManagement)}`} />
				</TableRow>
				<TableRow>
					<TableCell colSpan={4}></TableCell>
					<CompactTableSubTotalCell value={`R ${toCurrencyText(data.totals.siteManagement - data.totals.totalManagement)}`} />
				</TableRow>
			</TableBody>
			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</CompactTable>
	);
};
