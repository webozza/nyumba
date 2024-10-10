import IEmployee from './Employee.interface';
import { ProjectTypeEnum } from './Project.interface';

export enum TimesheetTypeEnumV2 {
	project = 'project',
	erection = 'erection',
	driving = 'driving',
}

export enum UOMEnum {
	'hour',
	'day',
	'km',
}

export default interface ITimesheetV2 {
	_id?: string;
	projectId?: string;
	employeeId?: string;
	employee?: IEmployee;
	date?: Date;
	type?: TimesheetTypeEnumV2;
	description?: string;
	qty?: number;
	uom?: UOMEnum;
	dayRate?: number;
}

export interface ITimesheetsSummary {
	employeeId: string;
	employee: {
		_id: string;
		name: string;
	};
	daysLogged: number;
	hoursWorked: number;
	daysWorked: number;
	kmsTravelled: number;
	dayRate: number;
	rating: number;
	timesheets: ITimesheetV2[];
}

export interface IDeleteTimesheetParams {
	_id: string;
}

export interface TimesheetsByProjectAndDateResponse {
	projectId: string;
	name: string;
	date: Date;
	type: ProjectTypeEnum;
	employees: TimesheetEmployeeProps[];
	allEmployees: IEmployee[];
}

interface TimesheetEmployeeProps extends IEmployee {
	time: ITimesheetV2;
	travel: ITimesheetV2;
}
