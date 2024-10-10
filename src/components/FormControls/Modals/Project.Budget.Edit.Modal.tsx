import React from 'react';
import { useMutation } from 'react-query';
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../../lib/interfaces/Form.interface';
import FormModal from '../../Form/Form.Modal';
import BudgetService from '../../../lib/services/Budget.service';
import { IBudgetV2 } from '../../../lib/interfaces/Budget.interface';
import { useSearchParams } from 'react-router-dom';

// form inputs
const FormInputs: IFormInputComponentProps[] = [
	{
		name: 'name',
		label: 'Name',
		type: FormInputTypes.text,
		icon: 'home',
		required: true,
		width: 12,
	},
	{
		name: 'description',
		label: 'Description',
		type: FormInputTypes.multiline,
		width: 12,
		rows: 4,
	},
];

interface Props {
	initialValues?: Partial<IBudgetV2> | undefined;
	open: boolean;
	setOpen: (value: boolean) => void;
	onSettled?: (values: IBudgetV2 | undefined) => unknown;
	onCancel: () => void;
}

export const ProjectEditBudgetFormModal = ({ initialValues, open, setOpen, onCancel, onSettled }: Props) => {
	const [params] = useSearchParams();
	const date = params.get('date');
	const [submitError, setSubmitError] = React.useState<string | undefined>();

	// mutations
	const updateBudget = useMutation<IBudgetV2, Error, any>(async (props: IBudgetV2) => BudgetService.updateBudgetV2(props), {
		onMutate: () => {
			setSubmitError(undefined);
		},
		onError: (error) => {
			setSubmitError(error.message);
		},
		onSettled: (data: any) => {
			onSettled && onSettled(data);
		},
	});

	//> main
	return (
		<FormModal
			label="Budget"
			type={FormType.update}
			initialValues={{ ...initialValues, sourceDate: date }}
			submitError={submitError}
			inputs={FormInputs}
			updateFormMutation={updateBudget}
			open={open}
			setOpen={setOpen}
			onCancel={onCancel}
		/>
	);
};
