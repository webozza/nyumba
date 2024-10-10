import { Form } from 'react-final-form';
//mui
import { Alert, Button, Grid, Icon } from '@mui/material';
import { Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../lib/interfaces/Form.interface';
import { Input } from '../FormControls/Inputs';
import Validations from '../../lib/validations/input.validations';
import { isEmpty } from 'lodash';

interface FormModalProps {
	label?: string;
	overrideLabel?: string | undefined; // when set, it uses this only instead of adding 'Add' and 'Edit' to th elabel
	submitError: string | undefined;
	initialValues?: any;
	type: FormType;
	inputs: IFormInputComponentProps[];
	existing?: any;
	open: boolean;
	setOpen: (value: boolean) => void;
	onCancel?: () => void;
	createFormMutation?: any;
	updateFormMutation?: any;
	disablePristineCheck?: boolean; //does not disable the Submit button when the for is pristine
}

const FormModal = ({
	label,
	overrideLabel,
	type,
	submitError,
	createFormMutation,
	updateFormMutation,
	initialValues,
	inputs,
	existing,
	disablePristineCheck,
	open,
	setOpen,
	onCancel,
}: FormModalProps) => {
	//> handlers
	const onSubmit = async (values: any) => {
		// creat new
		if (type === FormType.new && createFormMutation) {
			await createFormMutation.mutate(values);
			handleClose();
		}
		// update existing
		if (type === FormType.update && updateFormMutation) {
			await updateFormMutation.mutate(values);
			handleClose();
		}
	};
	const handleClose = () => {
		!submitError && setOpen(false);
	};

	//> main
	return (
		<Dialog
			fullWidth={true}
			maxWidth="sm"
			disableEscapeKeyDown
			disablePortal
			open={open}
			onClick={(e) => e.stopPropagation()}
			onClose={(event: object, reason: string) => {
				if (reason === 'escapeKeyDown' || reason === 'backdropClick') return;
				handleClose();
			}}
		>
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				validate={(values) => {
					let errors = {};
					inputs.map((input) => {
						if (values?.[input.name] !== undefined && values?.[input.name] !== '') {
							//check unique values when
							//   FormType = new
							//   FormType = update AND the value is different from current
							if (type === FormType.new || (type === FormType.update && initialValues?.[input.name] !== values?.[input.name])) {
								if (input.unique && existing.find((val: never) => val?.[input.name] === values?.[input.name]))
									errors = {
										...errors,
										[input.name]: `This ${input.label.toLocaleLowerCase()} already exists and must be unique.`,
									};
							}
							// validate inputs
							if (input.type === FormInputTypes.phone && !Validations.isValidNumber(values?.[input.name]))
								errors = { ...errors, [input.name]: 'Invalid phone number' };
							if (input.type === FormInputTypes.email && !Validations.isValidEmail(values?.[input.name]))
								errors = { ...errors, [input.name]: 'Invalid email address' };
						}
					});
					return errors;
				}}
				render={({ handleSubmit, submitting, pristine, errors }) => (
					<form onSubmit={handleSubmit}>
						{overrideLabel && (
							<DialogTitle
								sx={{
									py: 1,
								}}
							>
								<b>{overrideLabel}</b>
							</DialogTitle>
						)}
						{!overrideLabel && label && (
							<DialogTitle
								sx={{
									py: 1,
								}}
							>
								<b>{type === FormType.new ? `Add new ${label.toLocaleLowerCase().trim()}` : `Edit ${label}`}</b>
							</DialogTitle>
						)}

						<DialogContent
							dividers={true}
							sx={{
								backgroundColor: (theme) => theme.palette.background.paper,
								pb: 4,
							}}
						>
							{submitError && (
								<DialogContentText>
									<Alert severity="error">{submitError}</Alert>
								</DialogContentText>
							)}
							<Grid
								container
								spacing={2}
								sx={{
									mt: 0.5,
								}}
							>
								{/* //> inputs */}
								{inputs?.map((input: IFormInputComponentProps, inputIdx: number) => {
									if (!input.hidden)
										return (
											<Grid item xs={input?.width || 12} key={`input-${input.name}-${inputIdx}`}>
												<Input {...input} error={errors?.[input.name]} />
											</Grid>
										);
								})}
							</Grid>
						</DialogContent>

						<DialogActions
							sx={{
								py: 1,
							}}
						>
							<Button
								color="info"
								variant="contained"
								onClick={() => {
									setOpen(false);
									onCancel && onCancel();
								}}
								disabled={submitting}
							>
								Cancel
							</Button>
							<LoadingButton
								color="success"
								variant="contained"
								type="submit"
								loading={submitting}
								disabled={(!disablePristineCheck && pristine) || submitting || !isEmpty(errors)}
								autoFocus
								loadingPosition="start"
								startIcon={<Icon>save</Icon>}
							>
								Submit
							</LoadingButton>
						</DialogActions>
					</form>
				)}
			/>
		</Dialog>
	);
};

export default FormModal;
