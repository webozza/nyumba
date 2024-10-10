import React from 'react';
import { useField, useForm } from 'react-final-form';
import { Autocomplete, Chip, createFilterOptions, FilterOptionsState, FormControl, FormHelperText, TextField } from '@mui/material';
import { IFormInputComponentProps } from '../../../lib/interfaces/Form.interface';
import IEmployee from '../../../lib/interfaces/Employee.interface';
import { UseQueryResult, useQuery } from 'react-query';
import EmployeeService from '../../../lib/services/Employee.service';

export const InputEmployeeMultiple = ({ name, label, error, required }: IFormInputComponentProps): JSX.Element => {
	const form = useForm();
	const field = useField(name);
	const filter = createFilterOptions<IEmployee>();
	const [open, setOpen] = React.useState(false);

	const { data, isLoading, isError }: UseQueryResult<IEmployee[], Error> = useQuery<IEmployee[], Error>('employees', EmployeeService.getEmployeesV2);
	const [values, setValues] = React.useState<IEmployee[] | undefined>();

	const defaultValues = React.useMemo(() => {
		const selectedIds = field.input.value;
		const _values = data?.filter((employee) => selectedIds.includes(employee._id.toString()));
		return _values;
	}, [data]);

	return (
		<FormControl fullWidth>
			<Autocomplete
				multiple
				fullWidth
				autoComplete
				autoHighlight
				filterSelectedOptions
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
				// value={field.input.value}
				defaultValue={defaultValues}
				// value={value || field.input.value}
				renderTags={(values: readonly IEmployee[], getTagProps) =>
					values.map((option: IEmployee, index: number) => <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />)
				}
				renderInput={(params) => {
					return (
						<TextField
							{...params}
							label={label}
							required={required || false}
							InputLabelProps={{
								...params.InputLabelProps,
								shrink: true,
							}}
						/>
					);
				}}
				filterOptions={(options: IEmployee[], params: FilterOptionsState<IEmployee>) => {
					const filtered = filter(options, params);
					return filtered;
				}}
				getOptionLabel={(option) => option.name}
				onChange={(event, newValue) => {
					setValues(newValue);
					const ids = newValue.map((value) => value._id);
					form.change(name, ids);
				}}
				renderOption={(props, option) => <li {...props}>{option.name}</li>}
				isOptionEqualToValue={(option, value) => option.name === value.name}
			/>
			<FormHelperText>{error ? error : ''}</FormHelperText>
		</FormControl>
	);
};
