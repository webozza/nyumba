import nyumbaApi from '../data/axios';
import IEmployee, { ICreateEmployeeParams, IUpdateEmployeeParams, IDeleteEmployeeParams } from '../interfaces/Employee.interface';

//- v2
const getEmployeesV2 = async (): Promise<IEmployee[]> => {
	const data: IEmployee[] = await nyumbaApi({
		method: 'get',
		url: '/v2/employee',
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

const addEmployee = async (employee: ICreateEmployeeParams): Promise<IEmployee> => {
	const data: IEmployee = await nyumbaApi({
		method: 'post',
		url: '/employee',
		data: JSON.stringify(employee),
	})
		.then((res: any) => {
			return res.data.employee;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const updateEmployee = async (employee: IUpdateEmployeeParams): Promise<IEmployee> => {
	const data: IEmployee = await nyumbaApi({
		method: 'patch',
		url: `/employee/${employee._id}`,
		data: JSON.stringify(employee),
	})
		.then((res: any) => {
			return res.data.employee;
		})
		.catch((reason) => {
			throw new Error(reason.response.data.message);
		});
	return data;
};

const deleteEmployee = async (employee: IDeleteEmployeeParams): Promise<unknown> => {
	await nyumbaApi({
		method: 'delete',
		url: `/employee/${employee._id}`,
		data: JSON.stringify(employee),
	}).catch((reason) => {
		throw new Error(reason.response.data.message);
	});
	return { status: 'success' };
};

const EmployeeService = {
	getEmployeesV2,
	addEmployee,
	updateEmployee,
	deleteEmployee,
};

export default EmployeeService;
