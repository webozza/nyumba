import { ProjectTypeEnum } from './Project.interface';
import ITimesheetV2 from './Timesheet.interface';

//-v2

export interface IPayrunEmployeeV2 {
	projectId: string;
	employeeId: string;
	month: number;
	year: number;

	advanceId?: string;
	salary?: number;
	rating?: number;
	travel?: number;
	management?: number;
	total?: number;

	issuedOn?: Date;
	archived: boolean;
}

//- ,ust be converted into v2
export interface IPayrun {
	projectId: string;
	month: number;
	year: number;
	issuedOn: Date;

	employeeValues: {
		employeeId: string;
		advanceId: string;
		rating: number;
		salary: number;
		travel: number;
		siteManagement: number;
	}[];

	archived: boolean;
}

export interface IPayReview {
	projectId: string;

	name: string;
	description: string;
	type: ProjectTypeEnum;
	totalDays: number;
	totalRating: number;
	budget: number;
	expense: number;
	balance: number;

	employees: IPayrunEmployee[];
}

export interface IPayrunEmployee {
	projectId: string;
	employeeId: string;
	name: string;
	totalDays: number;
	rating: number;
	travel: number;
	travelOveride: boolean;
	management: number;
	managementOveride: boolean;
	additional: number;
	dayRate: number;
	salary: number;
	total: number;

	timesheets: ITimesheetV2[];
}
