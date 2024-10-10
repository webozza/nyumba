import nyumbaApi from '../data/axios';
import IEmployee from '../interfaces/Employee.interface';
import ITimesheetV2, { IDeleteTimesheetParams, TimesheetsByProjectAndDateResponse } from '../interfaces/Timesheet.interface';

//- v2
const patchTimesheetV2 = async (timesheet: ITimesheetV2): Promise<ITimesheetV2> => {
	const data: ITimesheetV2 = await nyumbaApi({
		method: 'patch',
		url: `/v2/timesheet`,
		data: JSON.stringify(timesheet),
	})
		.then((res: any) => {
			return res.data.timesheet;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const getTimesheetsByEmployeeV2 = async (projectId: string, date: string): Promise<IEmployee[]> => {
	const data: IEmployee[] = await nyumbaApi({
		method: 'post',
		url: `/v2/timesheet/byEmployee`,
		data: JSON.stringify({ projectId, date }),
	})
		.then((res: any) => {
			return res.data.employees;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

//- needs to be converted to v2

const getTimesheetsByProjectAndDate = async (projectId: string, date: string): Promise<TimesheetsByProjectAndDateResponse> => {
	const data: TimesheetsByProjectAndDateResponse = await nyumbaApi({
		method: 'post',
		url: `/timesheet/byProjectAnDate`,
		data: JSON.stringify({ projectId, date }),
	})
		.then((res: any) => {
			return res.data.timesheets;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const addTimesheet = async (timesheet: ITimesheetV2): Promise<ITimesheetV2> => {
	const data: ITimesheetV2 = await nyumbaApi({
		method: 'post',
		url: '/timesheet',
		data: JSON.stringify(timesheet),
	})
		.then((res: any) => {
			return res.data.timesheet;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const updateTimesheet = async (timesheet: ITimesheetV2): Promise<ITimesheetV2> => {
	const data: ITimesheetV2 = await nyumbaApi({
		method: 'patch',
		url: `/timesheet/${timesheet._id}`,
		data: JSON.stringify(timesheet),
	})
		.then((res: any) => {
			return res.data.timesheet;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const patchTimesheet = async (timesheet: ITimesheetV2): Promise<ITimesheetV2> => {
	const data: ITimesheetV2 = await nyumbaApi({
		method: 'patch',
		url: `/timesheet`,
		data: JSON.stringify(timesheet),
	})
		.then((res: any) => {
			return res.data.timesheet;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const deleteTimesheet = async (timesheet: IDeleteTimesheetParams): Promise<unknown> => {
	await nyumbaApi({
		method: 'delete',
		url: `/timesheet/${timesheet._id}`,
		data: JSON.stringify(timesheet),
	}).catch((reason) => {
		throw new Error(reason.response.data.message);
	});
	return { status: 'success' };
};

const TimesheetService = {
	getTimesheetsByProjectAndDate,
	addTimesheet,
	updateTimesheet,
	patchTimesheet,
	deleteTimesheet,
	getTimesheetsByEmployeeV2,
	//-v2
	patchTimesheetV2,
};

export default TimesheetService;
