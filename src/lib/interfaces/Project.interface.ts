import IEmployee from './Employee.interface';
import { INoteResponse } from './Note.interface';
import ITimesheetV2, { ITimesheetsSummary } from './Timesheet.interface';
import IBudgetItem, { IBudgetV2 } from './Budget.interface';

//- v2
export interface IProjectV2 {
	budgetItems: any;
	_id: string;

	name: string;
	description: string;
	startDate?: Date;
	endDate?: Date;

	type: ProjectTypeEnum;
	notes: INoteResponse[];

	budgets?: IBudgetV2[];
	// budgetItems?: IBudgetItemV2[];

	timesheets?: ITimesheetV2[];

	managerIds?: string[];
	managers?: IManager[];

	employees?: IProjectEmployeeV2[];
	totals?: IProjectTotalsV2;

	archived: boolean;
}

export interface IProjectTotalsV2 {
	expense?: number; // all expense items
	budget?: number; // all budget items
	avgRating?: number; // average rating for all employees
}

export interface IProjectEmployeeV2 {
	_id: string; // employee id
	name: string; // employee name
	month: number;
	year: number;
	totalHours: number; //calculated. override from payrun (Timesheets table)
	totalDays: number; //calculated based on hours input
	rating: number; //from payrun (Performance Rating table)
	management: number; //from payrun (Performance Rating table)
	salary: number; //Calcalculated on server side. (TotalInclSiteMgmt * EmployeeDaysWorked / TotalDaysWorked * EmployeeRating / TotalRating)
	total: number;
}

export interface IProjectEmployeesTotals {
	totalRating: number; //from payrun. Average rating accross all employees
	totalDays: number; //from payrun. Total number of days of the employee
	totalSalaries: number; //calculated. Total salaries paid out
	totalManagement: number; //calculated. Total management fees paid out
	totalSalariesInclManagement: number; //calculated. Total fees paid out

	siteManagement: number; //calculated.totalBudget - totalExpenses
	totalPayout: number; //calculated.totalBudget - totalExpenses
	totalBudget: number; //calculated.
	totalExpenses: number; //calculated.
}

//- needs conversion to v2
export enum ProjectWorkTypeEnum {
	time = 'time',
	travel = 'travel',
}

export enum ProjectTypeEnum {
	erection = 'erection',
	welding = 'welding',
	office = 'office',
	general_yard_work = 'general_yard_work',
}
export default interface IProject {
	_id: string;

	name: string;
	description: string;
	startDate: number;
	endDate: number;
	type: ProjectTypeEnum;
	notes: INoteResponse[];

	budgetItems: IBudgetItem[];
	expenseItems: IBudgetItem[];
	timesheets: ITimesheetV2[];
	timesheetsSummary: ITimesheetsSummary[];
	managers: IManager[];
	managerIds: string[];
	employees: IEmployee[];
	rating: number;

	totals: IProjectTotals;
	extras?: {
		allTags: string[];
	};
	archived: boolean;
}

export interface IManager {
	name: string;
	_id: string;
	employeeId: string;
}

export interface IProjectEmployee {
	_id: string;
	name: string;
	qty: string; //days worked, can be decimal
}

export interface IProjectEmployeesRespone {
	active: IProjectEmployee[];
	all: IProjectEmployee[];
}

export interface IGetProject {
	_id: string;
}
export interface IAddProjectReponse {
	_id: string;
}
export interface IDeleteProjectParams {
	_id: string;
}

export interface IProjectTotals {
	notes: {
		qty: number;
	};
	expenses: {
		total: number;
	};
	budget: {
		total: number;
	};
	timesheets: {
		total: number;
		rating: number;
	};
}
