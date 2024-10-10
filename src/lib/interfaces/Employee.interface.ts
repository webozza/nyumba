export default interface IEmployee {
	_id: string;
	name: string;
	employeeId?: string;
	dayRate?: number;
	travelAllowance?: number;
	adminAllowance?: number;
	sickLeave?: Date[];
	timeByDayOfMonth?: {
		day: number;
		value: number;
		date: Date;
		isWeekend: boolean;
	}[];
}

export interface IEmployeeSelectOptions extends IEmployee {
	inputValue?: string;
}

export interface ICreateEmployeeParams {
	name?: string;
}
export interface IUpdateEmployeeParams {
	_id: string;
	name?: string;
}
export interface IUpdateEmployeePasswordParams {
	_id: string;
	name?: string;
}
export interface IDeleteEmployeeParams {
	_id: string;
}
