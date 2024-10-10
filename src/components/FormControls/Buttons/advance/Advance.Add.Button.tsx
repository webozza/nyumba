import React from 'react';
import { useMutation } from 'react-query';
//mui
import { ButtonProps } from '@mui/material';
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../../../lib/interfaces/Form.interface';
import FormButton from '../../../Form/Form.Button';
import { IAdvance, IEmployeeAdvancesDetail } from '../../../../lib/interfaces/Advance.interface';
import AdvanceService from '../../../../lib/services/Advances.service';

interface AdvanceFormButtonProps {
	type: FormType;
	initialValues?: any;
	onSettled: () => void;
	buttonProps?: ButtonProps;
}

export const AddAdvanceFormInputs: IFormInputComponentProps[] = [
	{
		name: 'employeeId',
		label: 'Employee',
		type: FormInputTypes.employee,
		icon: 'person',
		required: true,
	},
	{
		name: 'date',
		label: 'Date',
		type: FormInputTypes.date,
		width: 6,
	},
	{
		name: 'amount',
		label: 'Qty',
		type: FormInputTypes.currency,
		width: 6,
	},
	{
		name: 'description',
		label: 'Decription',
		type: FormInputTypes.multiline,
		rows: 4,
	},
];

export const AdvanceAddButton = ({ type, initialValues, onSettled, buttonProps }: AdvanceFormButtonProps) => {
	const [submitError, setSubmitError] = React.useState<string | undefined>();

	// mutations
	const createOrUpdateAdvance = useMutation<IAdvance, Error, IEmployeeAdvancesDetail>(
		async (props: IEmployeeAdvancesDetail) => AdvanceService.createOrUpdateAdvance(props),
		{
			onMutate: () => {
				setSubmitError(undefined);
			},
			onError: (error) => {
				setSubmitError(error.message);
			},
			onSuccess: () => {
				setSubmitError(undefined);
				onSettled();
			},
		}
	);

	// main
	return (
		<FormButton
			title="Add advance"
			label="Add advance"
			type={type}
			initialValues={initialValues}
			submitError={submitError}
			setSubmitError={setSubmitError}
			inputs={AddAdvanceFormInputs}
			createFormMutation={createOrUpdateAdvance}
			updateFormMutation={createOrUpdateAdvance}
			buttonProps={buttonProps}
			maxWidth="xs"
			canClose={() => (submitError === undefined ? true : false)}
		/>
	);
};

export default AdvanceAddButton;
