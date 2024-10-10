import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
//components
import cookieHelper from './lib/helpers/cookie.helper';
import SignInPage from './pages/SignIn';
import { Layout } from './components/Layouts';
import { EmployeesPage } from './pages/employee';
import { DashboardPage } from './pages/dashboard';
import { ErrorPage } from './pages/Error.Page';
import { ProjectPage } from './pages/project/Project.Page';
import { ProjectsPage } from './pages/project/Projects.Page';
import { AdvancesPage } from './pages/advances';
import { SettingsPage } from './pages/settings';
import { EmployeeAccessAdminPage } from './pages/settings/access';
import { PayslipsPage } from './pages/payslips';
import { MobileTimesheetPage } from './pages/timesheet/Mobile.Timesheet';
import { ProjectBudgetPage } from './pages/project/Project/Project.Budget.Page';
import { ProjectPerformancePage } from './pages/project/Project/Project.Performance.Page';
import { ProjectTimesheetsPage } from './pages/project/Project/Project.Timesheets.Page';
import { ProjectDashboardPage } from './pages/project/Project/Project.Dashboard.Page';

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/sign-in" element={<SignInPage />} />

			<Route
				path="/"
				element={
					<RequireAuth>
						<Layout />
					</RequireAuth>
				}
			>
				<Route path="/" element={<DashboardPage />} />

				{/* // error */}
				<Route path="/error" element={<ErrorPage />} />

				{/* // settings */}
				<Route path="/settings" element={<SettingsPage />}>
					<Route path="/settings/user" element={<EmployeeAccessAdminPage />} />
				</Route>

				{/* // business logic */}
				<Route path="/projects" element={<ProjectsPage />} />
				<Route path="/projects/:id" element={<ProjectPage />}>
					<Route path="/projects/:id/dashboard" element={<ProjectDashboardPage />} />
					<Route path="/projects/:id/budget" element={<ProjectBudgetPage />} />
					<Route path="/projects/:id/timesheets" element={<ProjectTimesheetsPage />} />
					<Route path="/projects/:id/performance" element={<ProjectPerformancePage />} />
				</Route>

				<Route path="/time/:projectId" element={<MobileTimesheetPage />} />

				<Route path="/payrun" element={<AdvancesPage />} />
				<Route path="/payslips" element={<PayslipsPage />} />
				<Route path="/advances" element={<AdvancesPage />} />

				<Route path="/employees" element={<EmployeesPage />} />
				<Route path="/employees/:id" element={<EmployeesPage />} />
			</Route>
		</Routes>
	);
};

// checks whether the use is authenticated
function RequireAuth({ children }: { children: JSX.Element }) {
	const location = useLocation();
	const token = cookieHelper.get('accessToken');
	const user = localStorage.getItem('user');

	if (!token || !user) {
		return <Navigate to="/sign-in" state={{ from: location }} replace />;
	}

	return children;
}
