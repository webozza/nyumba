import { Divider, Stack, Typography } from '@mui/material';
import { FormInputTypes, IFormInputComponentProps } from '../../../lib/interfaces/Form.interface';
import { InputCurrency } from './Input.Currency';
import { InputDate, InputDateMonth } from './Input.Date';
import { InputMultiline } from './Input.Mulitline';
import { InputSelect } from './Input.Select';
import { InputText } from './Input.Text';
import { InputProject } from './Input.Project';
import { InputEmployee } from './Input.Employee';
import { InputNumber } from './Input.Number';
import { InputEmployeeMultiple } from './Input.Employee.Multiple';

export const Input = (props: IFormInputComponentProps): JSX.Element => {
	switch (props.type) {
		//> label
		case FormInputTypes.label: {
			return (
				<Stack spacing={0.5} direction="row" alignItems="center">
					<Typography variant="body2">
						<b>{props.label}</b>
					</Typography>
				</Stack>
			);
		}

		//> value label
		case FormInputTypes.valueLabel: {
			return (
				<Stack spacing={0.5} direction="row" alignItems="center">
					<Typography variant="body2">
						<b>{props.value}</b>
					</Typography>
				</Stack>
			);
		}

		// text
		case FormInputTypes.text: {
			return <InputText {...props} />;
		}
		// number
		case FormInputTypes.number: {
			return <InputNumber {...props} />;
		}
		// currency
		case FormInputTypes.currency: {
			return <InputCurrency {...props} />;
		}
		// date
		case FormInputTypes.date: {
			return <InputDate {...props} />;
		}
		// date-month
		case FormInputTypes.date_month: {
			return <InputDateMonth {...props} />;
		}
		// multiline
		case FormInputTypes.multiline: {
			return <InputMultiline {...props} />;
		}
		// select
		case FormInputTypes.select: {
			return <InputSelect {...props} />;
		}
		// text
		case FormInputTypes.project: {
			return <InputProject {...props} />;
		}
		// employee
		case FormInputTypes.employee: {
			return <InputEmployee {...props} />;
		}
		case FormInputTypes.employee_multiple: {
			return <InputEmployeeMultiple {...props} />;
		}

		//> divider
		case FormInputTypes.divider: {
			return (
				<Stack alignItems="center">
					<Divider sx={{ mt: 2, mb: 2, width: '75%' }} />
				</Stack>
			);
		}
		// default
		default: {
			return <InputText {...props} />;
		}
	}
};
