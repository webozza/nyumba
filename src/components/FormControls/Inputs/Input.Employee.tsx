import React from 'react';
import { useField, useForm } from 'react-final-form';
import { Autocomplete, createFilterOptions, FilterOptionsState, FormControl, FormHelperText, Icon, InputAdornment, TextField } from '@mui/material';
import { IFormInputComponentProps } from '../../../lib/interfaces/Form.interface';
import IEmployee from '../../../lib/interfaces/Employee.interface';
import { UseQueryResult, useQuery } from 'react-query';
import EmployeeService from '../../../lib/services/Employee.service';

export const InputEmployee = ({ name, label, error, required }: IFormInputComponentProps): JSX.Element => {
	const form = useForm();
	const field = useField(name);
	const filter = createFilterOptions<IEmployee>();
	const [open, setOpen] = React.useState(false);

	const { data, isLoading, isError }: UseQueryResult<IEmployee[], Error> = useQuery<IEmployee[], Error>(
		'employees',
		EmployeeService.getEmployeesV2
	);

	const selectedName: IEmployee | undefined = React.useMemo(() => data?.find((item) => item._id === field.input.value), [data, field]);

	return (
		<FormControl fullWidth>
			<Autocomplete
				fullWidth
				autoComplete
				autoHighlight
				disabled={isError}
				loading={isLoading}
				open={open}
				onOpen={() => {
					setOpen(true);
				}}
				onClose={() => {
					setOpen(false);
				}}
				options={data || []}
				defaultValue={selectedName}
				renderInput={(params) => {
					return (
						<TextField
							{...params}
							label={label}
							required={required || false}
							InputProps={{
								...params.InputProps,
								startAdornment: (
									<InputAdornment position="start">
										<Icon>person</Icon>
									</InputAdornment>
								),
								endAdornment: params.InputProps.endAdornment,
							}}
							InputLabelProps={{
								shrink: true,
							}}
						/>
					);
				}}
				filterOptions={(options: IEmployee[], params: FilterOptionsState<IEmployee>) => {
					const filtered = filter(options, params);
					return filtered;
				}}
				getOptionLabel={(option) => {
					return option.name;
				}}
				onChange={(event, newValue) => {
					form.change(name, newValue?._id || null);
				}}
				renderOption={(props, option) => <li {...props}>{option.name}</li>}
				isOptionEqualToValue={(option, value) => option.name === value.name}
			/>
			<FormHelperText>{error ? error : ''}</FormHelperText>
		</FormControl>
	);
};
