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
	onSettled: () => void;
	buttonType?: 'default' | 'icon-button' | 'table';
	initialValues?: ITimesheetV2;
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
		name: 'employeeId',
		label: 'Employee',
		type: FormInputTypes.employee,
		icon: 'person',
		required: true,
		autoFocus: true,
	},
];

export const TimesheetAddBlankTableButton = ({
	type,
	buttonType = 'table',
	initialValues,
	onSettled,
	buttonProps,
	tooltip,
}: TimesheetFormButtonProps) => {
	const [submitError, setSubmitError] = React.useState<string | undefined>();

	// mutations
	const addTimesheet = useMutation<ITimesheetV2, Error, ITimesheetV2>(async (props: ITimesheetV2) => TimesheetService.patchTimesheetV2(props), {
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
	const updateTimesheet = useMutation<ITimesheetV2, Error, ITimesheetV2>(async (props: ITimesheetV2) => TimesheetService.patchTimesheetV2(props), {
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
			title="Add employee"
			overrideTitle="Add employee"
			label="Add employee"
			type={type}
			initialValues={{
				...initialValues,
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
			menuIcon="person_add"
		/>
	);
};
