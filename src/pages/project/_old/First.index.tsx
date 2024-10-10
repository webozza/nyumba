import { DefaultProjectPage } from './First.Project.Default';
import { MobileProjectPage } from './First.Project.Mobile';
import { DefaultProjectsPage } from './First.Projects.Default';
import { MobileProjectsPage } from './First.Projects.Mobile';

export const ProjectsPage = () => {
	const width = window.innerWidth;

	if (width <= 768) return <MobileProjectsPage />;
	return <DefaultProjectsPage />;
};

export const ProjectPage = () => {
	const width = window.innerWidth;

	if (width <= 768) return <MobileProjectPage />;
	return <DefaultProjectPage />;
};
