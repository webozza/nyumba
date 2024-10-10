import React from 'react';
import { useQuery, UseQueryResult } from 'react-query';
//mui
import { Typography } from '@mui/material/';
//components
import { Loading } from '../../components/Loader/Loading';
import { AutoTable, TableRowsTypesEnum } from '../../components/Table/AutoTable';
import { DefaultPage } from '../../components/Page/Page';
import IEmployee from '../../lib/interfaces/Employee.interface';
import EmployeeService from '../../lib/services/Employee.service';
import { FormType } from '../../lib/interfaces/Form.interface';
import { ErrorPage } from '../Error.Page';
import EmployeeAddButton from '../../components/FormControls/Buttons/employee/Employee.Add.Button';
import EmployeeFormModal from '../../components/FormControls/Modals/Employee.Add.Modal';
import { toCurrencyText } from '../../lib/utils/text.utils';
import { TitleBar } from '../../components/Title/Title.Default';

export const DefaultEmployeesPage = () => {
	const [open, setOpen] = React.useState<boolean>(false);
	const [selected, setSelected] = React.useState<IEmployee | undefined>();
	const [filter, setFilter] = React.useState<string>('');

	const { data, refetch, isLoading, isError }: UseQueryResult<IEmployee[], Error> = useQuery<IEmployee[], Error>(
		'employees',
		EmployeeService.getEmployeesV2
	);

	// filters by search terms
	const filtered = React.useMemo(() => {
		if (data && filter) {
			return data.filter((employee) => employee.name.toLowerCase().includes(filter.toLowerCase()));
		}
		return data;
	}, [data, filter]);

	const rows = React.useMemo(() => {
		return filtered?.map((employee) => {
			return {
				_id: employee._id,
				columns: [
					{ type: TableRowsTypesEnum.string, name: 'name', value: employee.name },
					{ type: TableRowsTypesEnum.string, name: 'employeeId', value: employee.employeeId },
					{
						type: TableRowsTypesEnum.number,
						name: 'dayRate',
						value: employee.dayRate,
						component: (
							<Typography
								variant="body2"
								align="center"
								sx={{
									color: employee.dayRate == 0 ? 'text.disabled' : 'text.primary',
								}}
							>
								R {toCurrencyText(employee.dayRate || 0)}
							</Typography>
						),
					},
					{
						type: TableRowsTypesEnum.number,
						name: 'travelAllowance',
						value: employee.travelAllowance,
						component: (
							<Typography
								variant="body2"
								align="center"
								sx={{ color: employee.travelAllowance == 0 ? 'text.disabled' : 'text.primary' }}
							>
								R {toCurrencyText(employee.travelAllowance || 0)}
							</Typography>
						),
					},
					{
						type: TableRowsTypesEnum.number,
						name: 'adminAllowance',
						value: employee.adminAllowance,
						component: (
							<Typography
								variant="body2"
								align="center"
								sx={{ color: employee.adminAllowance == 0 ? 'text.disabled' : 'text.primary' }}
							>
								R {toCurrencyText(employee.adminAllowance || 0)}
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
			title="Employees"
			status=""
			description="Employee management page"
			buttons={[<EmployeeAddButton key={'EmployeeFormButton'} type={FormType.new} onSettled={() => refetch()} />]}
		>
			<TitleBar title="Filter on employee name or id" setFilterText={setFilter} options={{ showFilter: true }} />
			<AutoTable
				options={{
					width: '60%',
					size: 'small',
					canDelete: false,
					onRowClick: (rowId, row: IEmployee) => {
						setOpen(true);
						setSelected(row);
					},
				}}
				headers={[
					{ name: 'name', label: 'Name', sortable: true },
					{ name: 'employeeId', label: 'Employee Id', sortable: true },
					{ name: 'dayRate', label: 'Day Rate', sortable: true, align: 'center' },
					{ name: 'travelAllowance', label: 'Travel Allowance', sortable: true, align: 'center' },
					{ name: 'adminAllowance', label: 'Admin Management', sortable: true, align: 'center' },
				]}
				data={data}
				rows={rows}
			/>

			<EmployeeFormModal
				type={FormType.update}
				initialValues={selected}
				existingEmployees={[]}
				open={open}
				setOpen={setOpen}
				onSettled={() => {
					setOpen(false);
					setSelected(undefined);
					refetch();
				}}
				onCancel={() => {
					setOpen(false);
					setSelected(undefined);
				}}
			/>
		</DefaultPage>
	);
};
