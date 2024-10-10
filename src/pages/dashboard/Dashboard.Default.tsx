import { DefaultPage } from '../../components/Page/Page';
import { SummaryTable } from '../../components/TableControls/Table.Summary';
import { TitleBar } from '../../components/Title/Title.Default';

export const DefaultDashboardPage = () => {
	return (
		<DefaultPage
			type="default"
			title="Summary"
			status=""
			description="Overview of current month"
			buttons={[<TitleBar key="title-bar-dashboard-page" options={{ showFilter: false, showCalendar: true, showDateButtons: true }} />]}
		>
			<SummaryTable />
		</DefaultPage>
	);
};
