import IEmployee from './Employee.interface';

export enum IAdvanceTypeEnum {
	advance = 'advance',
	deduction = 'deduction',
}

export interface IAdvance {
	employeeId: string;
	employee: IEmployee;
	date: Date;
	value: number;
	archived: boolean;
	type: IAdvanceTypeEnum;
}

export interface IEmployeeAdvances extends IEmployee {
	totalClosing: number;
	totalDeductions: number;
	totalAdvances: number;
	date: Date;
	advances: IAdvance[];
}

export interface IEmployeeAdvancesDetail {
	employeeId: string;
	date: Date;
	[value: string]: any;
	description?: string;
	amount?: number;
	type?: IAdvanceTypeEnum;
}
