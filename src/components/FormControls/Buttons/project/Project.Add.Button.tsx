import React from 'react';
import moment from 'moment';
import { useMutation } from 'react-query';
//mui
import { ButtonProps } from '@mui/material';
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../../../lib/interfaces/Form.interface';
import FormButton from '../../../Form/Form.Button';
import IProject from '../../../../lib/interfaces/Project.interface';
import ProjectService from '../../../../lib/services/Project.service';

interface ProjectFormButtonProps {
	type: FormType;
	initialValues?: IProject;
	onSettled: () => void;
	buttonProps?: ButtonProps;
}

// form inputs
export const AddProjectFormInputs: IFormInputComponentProps[] = [
	{
		name: 'name',
		label: 'Name',
		type: FormInputTypes.text,
		icon: 'engineering',
		required: true,
		width: 6,
	},
	{
		name: 'type',
		label: 'Type',
		type: FormInputTypes.select,
		options: ['erection', 'welding', 'office', 'general_yard_work'],
		icon: 'cottage',
		width: 6,
	},
	{
		name: 'startDate',
		label: 'Start Date',
		type: FormInputTypes.date,
		icon: 'calendar_month',
		width: 6,
	},
	{
		name: 'endDate',
		label: 'End Date',
		type: FormInputTypes.date,
		icon: 'calendar_month',
		width: 6,
	},
	{
		name: 'description',
		label: 'Description',
		type: FormInputTypes.multiline,
		icon: 'description',
		rows: 4,
	},
	{
		name: '',
		label: '',
		type: FormInputTypes.divider,
	},
	{
		name: 'managerIds',
		label: 'Managers',
		type: FormInputTypes.employee_multiple,
		icon: 'supervisor_account',
	},
	{
		name: 'payOut',
		label: 'Total pay out',
		type: FormInputTypes.currency,
		icon: 'money',
		width: 6,
	},
	{
		name: 'management',
		label: 'Site Management Portion',
		type: FormInputTypes.currency,
		icon: 'money',
		width: 6,
	},
];

export const ProjectAddButton = ({ type, initialValues, onSettled, buttonProps }: ProjectFormButtonProps) => {
	const [submitError, setSubmitError] = React.useState<string | undefined>();

	// mutations
	const addProject = useMutation<IProject, Error, IProject>(async (props: IProject) => ProjectService.addProject(props), {
		onMutate: () => {
			setSubmitError(undefined);
		},
		onError: (error) => {
			setSubmitError(error.message);
		},
		onSuccess: () => {
			onSettled();
			// navigate(`/projects/${data._id}`);
		},
	});
	const updateProject = useMutation<IProject, Error, IProject>(async (props: IProject) => ProjectService.updateProject(props), {
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
			label="Add project"
			title="Add project"
			type={type}
			initialValues={{
				startDate: moment().format('YYYY-MM-DD'),
				endDate: moment().endOf('month').format('YYYY-MM-DD'),
				type: 'erection',
				...initialValues,
			}}
			submitError={submitError}
			setSubmitError={setSubmitError}
			inputs={AddProjectFormInputs}
			createFormMutation={addProject}
			updateFormMutation={updateProject}
			buttonProps={buttonProps}
			canClose={() => (submitError === undefined ? true : false)}
		/>
	);
};

export default ProjectAddButton;
