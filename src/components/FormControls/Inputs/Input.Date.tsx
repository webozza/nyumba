import { useField, useForm } from 'react-final-form';
//components
import { IFormInputComponentProps } from '../../../lib/interfaces/Form.interface';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

export const InputDate = ({ name, label, error }: IFormInputComponentProps): JSX.Element => {
	const field = useField(name);
	const form = useForm();

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<DesktopDatePicker
				sx={{
					width: '100%',
				}}
				label={label}
				value={moment(field.input.value)}
				format="DD MMMM YYYY"
				onChange={(value: any) => {
					form.change(name, value.toDate());
				}}
				slotProps={{
					textField: {
						helperText: error,
						variant: 'outlined',
					},
				}}
			/>
		</LocalizationProvider>
	);
};

export const InputDateMonth = ({ name, label, error }: IFormInputComponentProps): JSX.Element => {
	const field = useField(name);
	const form = useForm();

	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<DesktopDatePicker
				sx={{
					width: '100%',
				}}
				label={label}
				value={moment(field.input.value)}
				format="MMMM YYYY"
				views={['month']}
				onChange={(value: any) => {
					form.change(name, value.toDate());
				}}
				slotProps={{
					textField: {
						helperText: error,
						variant: 'outlined',
					},
				}}
			/>
		</LocalizationProvider>
	);
};
