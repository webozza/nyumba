import React from 'react';
import { useMutation } from 'react-query';
//mui
import { ButtonProps } from '@mui/material';
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../../../lib/interfaces/Form.interface';
import FormButton from '../../../Form/Form.Button';
import ITimesheetV2 from '../../../../lib/interfaces/Timesheet.interface';
import TimesheetService from '../../../../lib/services/Timesheet.service';
import { ProjectWorkTypeEnum } from '../../../../lib/interfaces/Project.interface';

interface TimesheetFormButtonProps {
	type: FormType;
	buttonType?: 'default' | 'icon-button';
	initialValues?: ITimesheetV2;
	onSettled: () => void;
	buttonProps?: ButtonProps;
	tooltip?: string;
}

const formTypeOptions: string[] = [];
Object.values(ProjectWorkTypeEnum).map((key: string) => {
	if (key !== undefined) formTypeOptions.push(key);
});

// form inputs
const FormInputs: IFormInputComponentProps[] = [
	{
		name: 'projectId',
		label: 'Project',
		type: FormInputTypes.project,
		icon: 'engineering',
		required: true,
		width: 6,
	},
	{
		required: true,
		name: 'date',
		label: 'Date',
		type: FormInputTypes.date,
		width: 6,
	},
	{
		name: 'employeeId',
		label: 'Employee',
		type: FormInputTypes.employee,
		icon: 'person',
		required: true,
	},
	{
		required: true,
		name: 'type',
		label: 'Type',
		type: FormInputTypes.select,
		options: formTypeOptions,
		width: 6,
	},
	{
		required: true,
		name: 'qty',
		label: 'Qty',
		type: FormInputTypes.number,
		width: 6,
		uom: 'days',
	},
	// {
	// 	required: true,
	// 	name: 'uom',
	// 	label: 'UoM',
	// 	type: FormInputTypes.select,
	// 	options: ['hour', 'day', 'km'],
	// 	width: 4,
	// 	icon: 'speed',
	// },
	{
		name: 'description',
		label: 'Description',
		type: FormInputTypes.multiline,
		icon: 'cottage',
		rows: 4,
	},
];

export const TimesheetAddButton = ({ type, buttonType = 'default', initialValues, onSettled, buttonProps, tooltip }: TimesheetFormButtonProps) => {
	const [submitError, setSubmitError] = React.useState<string | undefined>();

	// mutations
	const addTimesheet = useMutation<ITimesheetV2, Error, ITimesheetV2>(async (props: ITimesheetV2) => TimesheetService.addTimesheet(props), {
		onMutate: () => {
			setSubmitError(undefined);
		},
		onError: (error) => {
			setSubmitError(error.message);
		},
		onSuccess: () => {
			onSettled();
		},
	});
	const updateTimesheet = useMutation<ITimesheetV2, Error, ITimesheetV2>(async (props: ITimesheetV2) => TimesheetService.updateTimesheet(props), {
		onMutate: () => {
			setSubmitError(undefined);
		},
		onError: (error) => {
			setSubmitError(error.message);
		},
		onSuccess: () => {
			onSettled();
		},
	});

	// main
	return (
		<FormButton
			title="Add timesheet"
			label="Add timesheet"
			type={type}
			initialValues={{
				...initialValues,
				uom: 'day',
				date: new Date(),
			}}
			submitError={submitError}
			setSubmitError={setSubmitError}
			inputs={FormInputs}
			createFormMutation={addTimesheet}
			updateFormMutation={updateTimesheet}
			buttonProps={buttonProps}
			maxWidth="sm"
			canClose={() => (submitError === undefined ? true : false)}
			buttonType={buttonType}
			tooltip={tooltip}
		/>
	);
};
