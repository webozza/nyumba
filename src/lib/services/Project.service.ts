import moment from 'moment';
import nyumbaApi from '../data/axios';
import IProject, { IDeleteProjectParams, IProjectEmployeesRespone, IProjectV2 } from '../interfaces/Project.interface';

//- post demo changes routes
const getProjectV2 = async (id: string): Promise<IProjectV2> => {
	const data: IProjectV2 = await nyumbaApi({
		method: 'get',
		url: `/v2/project/${id}`,
	})
		.then((res: any) => {
			return res.data.project;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

//! to be checked and removed
const getProject = async (id: string): Promise<IProject> => {
	const data: IProject = await nyumbaApi({
		method: 'get',
		url: `/project/${id}`,
	})
		.then((res: any) => {
			return res.data.project;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const getProjects = async (): Promise<IProject[]> => {
	const data: IProject[] = await nyumbaApi({
		method: 'get',
		url: `/project`,
	})
		.then((res: any) => {
			return res.data.projects;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const getProjectsByDate = async (keys: any): Promise<IProject[]> => {
	const data: IProject[] = await nyumbaApi({
		method: 'post',
		url: `/project/${moment(keys?.queryKey[1]).format('YYYY-MM-DD')}`,
	})
		.then((res: any) => {
			return res.data.projects;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const addProject = async (project: IProject): Promise<IProject> => {
	const data: IProject = await nyumbaApi({
		method: 'post',
		url: '/project',
		data: JSON.stringify(project),
	})
		.then((res: any) => {
			return res.data.project;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const updateProject = async (project: IProject): Promise<IProject> => {
	const data: IProject = await nyumbaApi({
		method: 'patch',
		url: `/project/${project._id}`,
		data: JSON.stringify(project),
	})
		.then((res: any) => {
			return res.data.project;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const deleteProject = async (project: IDeleteProjectParams): Promise<unknown> => {
	await nyumbaApi({
		method: 'delete',
		url: `/project/${project._id}`,
		data: JSON.stringify(project),
	}).catch((reason) => {
		throw new Error(reason.response.data.message);
	});
	return { status: 'success' };
};

// additional
const getProjectEmployees = async (id: string): Promise<IProjectEmployeesRespone> => {
	const data: IProjectEmployeesRespone = await nyumbaApi({
		method: 'get',
		url: `/project/${id}/employees`,
	})
		.then((res: any) => {
			return res.data.employees;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const addManager = async (props: any): Promise<any> => {
	const data: IProject = await nyumbaApi({
		method: 'post',
		url: `/project/managers/add`,
		data: JSON.stringify(props),
	})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.then((res: any) => {
			return res.data.project;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const deleteManager = async (props: any): Promise<any> => {
	const data: IProject = await nyumbaApi({
		method: 'delete',
		url: `/project/managers/delete`,
		data: JSON.stringify(props),
	})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.then((res: any) => {
			return res.data.project;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const ProjectService = {
	getProject,
	getProjects,
	getProjectsByDate,
	addProject,
	updateProject,
	deleteProject,
	// additiona;
	getProjectEmployees,
	addManager,
	deleteManager,

	//- new
	getProjectV2,
};

export default ProjectService;
