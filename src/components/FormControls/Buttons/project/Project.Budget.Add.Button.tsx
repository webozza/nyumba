import React from 'react';
import { useMutation } from 'react-query';
//mui
import { ButtonProps } from '@mui/material';
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../../../lib/interfaces/Form.interface';
import FormButton from '../../../Form/Form.Button';
import BudgetService from '../../../../lib/services/Budget.service';
import { IBudgetV2 } from '../../../../lib/interfaces/Budget.interface';

interface Props {
	type: FormType;
	initialValues?: Partial<IBudgetV2>;
	onSettled: () => void;
	buttonProps?: ButtonProps;
}

// form inputs
export const FormInputs: IFormInputComponentProps[] = [
	{
		name: 'name',
		label: 'Name',
		type: FormInputTypes.text,
		icon: 'home',
		required: true,
		width: 12,
	},
	// {
	// 	name: 'description',
	// 	label: 'Description',
	// 	type: FormInputTypes.multiline,
	// 	width: 12,
	// 	rows: 4,
	// },
];

export const ProjectBudgetAddMenuButton = ({ type, initialValues, onSettled, buttonProps }: Props) => {
	const [submitError, setSubmitError] = React.useState<string | undefined>();

	// mutations
	const addBudget = useMutation<IBudgetV2, Error, any>(async (props: IBudgetV2) => BudgetService.createBudgetV2(props), {
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

	// main
	return (
		<FormButton
			label="budget"
			title="budget"
			type={type}
			initialValues={{
				...initialValues,
			}}
			submitError={submitError}
			setSubmitError={setSubmitError}
			inputs={FormInputs}
			createFormMutation={addBudget}
			buttonProps={buttonProps}
			canClose={() => (submitError === undefined ? true : false)}
			buttonType="menu"
			menuIcon="add"
		/>
	);
};
