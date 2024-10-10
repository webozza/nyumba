import React from 'react';
import { Box } from '@mui/material';
import { DefaultPage } from '../../components/Page/Page';
import { TitleBar } from '../../components/Title/Title.Default';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Loading } from '../../components/Loader/Loading';
import { ErrorPage } from '../Error.Page';
import moment from 'moment';
import { ErrorSnackbar } from '../../components/Errors/Error.Snackbar';
import AdvanceService from '../../lib/services/Advances.service';
import { IEmployeeAdvances } from '../../lib/interfaces/Advance.interface';
import { EmployeeAdvancesTable } from '../../components/TableControls/Table.Advances';
import AdvanceAddButton from '../../components/FormControls/Buttons/advance/Advance.Add.Button';
import { FormType } from '../../lib/interfaces/Form.interface';

export const DefaultAdvancesPage = (): JSX.Element => {
	const [params, setParams] = useSearchParams();
	const date = params.get('date');

	const [filter, setFilter] = React.useState<string>('');
	const [submitError, setSubmitError] = React.useState<string | undefined>();

	// set the search params. this is used to filter
	React.useEffect(() => {
		if (!date) {
			setParams({ date: moment().format('YYYY-MM-DD') });
		}
	}, [params]);

	const { data, isLoading, isError, refetch } = useQuery<IEmployeeAdvances[], Error>(
		['advances', moment(date).format('YYYY-MM-DD')],
		AdvanceService.getEmployeeAdvances
	);

	// filters by search terms
	const filtered = React.useMemo(() => {
		if (data && filter) {
			return data.filter((employee) => employee.name.toLowerCase().includes(filter.toLowerCase()));
		}
		return data;
	}, [data, filter]);

	if (isLoading) return <Loading />;
	if (isError) return <ErrorPage />;

	return (
		<DefaultPage
			type="default"
			title="Advances"
			status=""
			description="Manage employee payment advances"
			buttons={[
				<TitleBar title="Filter on employee name" setFilterText={setFilter} options={{ showFilter: true, showCalendar: true }} />,
				<AdvanceAddButton
					type={FormType.new}
					onSettled={() => refetch()}
					initialValues={{
						date: new Date(),
					}}
				/>,
			]}
		>
			<Box>
				<EmployeeAdvancesTable employees={filtered || []} refetch={refetch} />
			</Box>

			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</DefaultPage>
	);
};
