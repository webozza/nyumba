import { MobileBody } from '../../components/Layouts/Layout.Mobile';
import { MobileProjectsTable } from '../../components/TableControls/Mobile.Table.Projects';
import ProjectService from '../../lib/services/Project.service';
import { UseQueryResult, useQuery } from 'react-query';
import IProject from '../../lib/interfaces/Project.interface';
import { Loading } from '../../components/Loader/Loading';
import { ErrorPage } from '../Error.Page';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';

export const MobileDashboardPage = () => {
	const [searchParams] = useSearchParams();
	const date = moment(searchParams.get('date') || new Date());

	const { data, isLoading, isError }: UseQueryResult<IProject[], Error> = useQuery<IProject[], Error>(
		['projects', date.format('YYYY-MM-DD')],
		ProjectService.getProjectsByDate
	);

	if (isLoading) return <Loading />;
	if (isError) return <ErrorPage />;

	return (
		<MobileBody>
			<MobileProjectsTable projects={data} />
		</MobileBody>
	);
};
