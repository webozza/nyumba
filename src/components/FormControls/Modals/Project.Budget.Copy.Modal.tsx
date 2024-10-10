import React from 'react';
import { useMutation } from 'react-query';
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../../lib/interfaces/Form.interface';
import FormModal from '../../Form/Form.Modal';
import BudgetService, { CopyBudgetProps } from '../../../lib/services/Budget.service';
import { IBudgetV2 } from '../../../lib/interfaces/Budget.interface';
import { useSearchParams } from 'react-router-dom';

// form inputs
const FormInputs: IFormInputComponentProps[] = [
	{
		name: 'name',
		label: 'New budget name',
		autoFocus: true,
		type: FormInputTypes.text,
		icon: 'home',
		required: true,
		width: 12,
	},
	{
		name: 'destDate',
		label: `Copy selected date to:`,
		type: FormInputTypes.date_month,
		width: 12,
	},
];

interface ProjectFormButtonProps {
	type: FormType;
	initialValues?: Partial<IBudgetV2> | undefined;
	open: boolean;
	setOpen: (value: boolean) => void;
	onSettled?: (values: IBudgetV2 | undefined) => unknown;
	onCancel: () => void;
}

export const ProjectCopyBudgetFormModal = ({ type, initialValues, open, setOpen, onCancel, onSettled }: ProjectFormButtonProps) => {
	const [params] = useSearchParams();
	const date = params.get('date');
	const [submitError, setSubmitError] = React.useState<string | undefined>();

	// mutations
	const copyBudget = useMutation<CopyBudgetProps, Error, any>(async (props: CopyBudgetProps) => BudgetService.copyBudgetV2(props), {
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
			label="Project"
			overrideLabel={`Copy budget from ${initialValues?.name}`}
			type={type}
			initialValues={{ ...initialValues, sourceDate: date }}
			submitError={submitError}
			inputs={FormInputs}
			createFormMutation={copyBudget}
			open={open}
			setOpen={setOpen}
			onCancel={onCancel}
		/>
	);
};

export default ProjectCopyBudgetFormModal;
