import { SelectChangeEvent } from '@mui/material';

export enum FormType {
	new = 'new',
	update = 'update',
}

export enum FormInputTypes {
	label = 'label',
	divider = 'divider',
	text = 'text',
	multiline = 'multiline',
	number = 'number',
	currency = 'currency',
	select = 'select',
	date = 'date',
	date_month = 'date_month',
	password = 'password',
	email = 'email',
	phone = 'phone',
	project = 'project',
	employee = 'employee',
	employee_multiple = 'employee_multiple',
	valueLabel = 'valueLabel',
}

export interface IFormInputComponentProps {
	name: string;
	label: string;

	type?: FormInputTypes;
	placeholder?: string;
	options?: string[];
	fields?: string[];
	icon?: string;
	error?: string;
	required?: boolean;
	unique?: boolean;
	width?: number;
	rows?: number; //used with multiline
	uom?: string;
	hidden?: boolean;
	hideOn?: FormType;
	max?: number; //if type is number or currency, this sets the maximum value
	autoFocus?: boolean; //sets focus to input field

	value?: any; //incase you want to override the default form values behaviour
	onChange?: (event: SelectChangeEvent<any> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => void; //incase you want to override the default onchange form behaviour

	disabledOn?: {
		key: string;
		value: string;
	};
}
