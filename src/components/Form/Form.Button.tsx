import React from 'react';
import { Form } from 'react-final-form';
//mui
import { Alert, Button, Grid, Icon, ButtonProps, Breakpoint, IconButton, Tooltip, alpha } from '@mui/material';
import { Dialog, DialogContentText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../lib/interfaces/Form.interface';
import { Input } from '../FormControls/Inputs';
import { DialogTitle } from '../Dialog/Dialog.Title';
import { DialogActions } from '../Dialog/Dialog.Actions';
import { DialogContent } from '../Dialog/Dialog.Content';

interface FormButtonProps {
	buttonType?: 'default' | 'icon-button' | 'menu' | 'table'; // type of button to render
	label: string;
	title: string;
	menuIcon?: string;
	tooltip?: string;
	overrideTitle?: string | undefined; // when set, it uses this only instead of adding 'Add' and 'Edit' to th elabel
	submitError: string | undefined;
	setSubmitError: React.Dispatch<React.SetStateAction<string | undefined>>;
	initialValues?: unknown;
	type: FormType;
	inputs: IFormInputComponentProps[];
	maxWidth?: false | Breakpoint | undefined;
	createFormMutation: any;
	updateFormMutation?: any;
	buttonProps?: ButtonProps; //passed to default button in desktop view
	canClose: () => boolean; //runs at HOC and checks errors at parent level. Reutn true or false on wheteher the submission was successful and if ot can close
}

const FormButton = ({
	buttonType = 'default',
	tooltip,
	label,
	title,
	menuIcon,
	overrideTitle,
	submitError,
	setSubmitError,
	initialValues,
	type,
	inputs,
	maxWidth,
	createFormMutation,
	updateFormMutation,
	buttonProps,
	canClose,
}: FormButtonProps) => {
	//> state
	const [open, setOpen] = React.useState<boolean>(false);

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
	const handleOpen = (e: any) => {
		e.preventDefault();
		setSubmitError(undefined);
		setOpen(true);
		e.stopPropagation();
	};
	const handleCancel = () => {
		setSubmitError(undefined);
		setOpen(false);
	};
	const handleClose = () => {
		if (canClose() && (!submitError || submitError === undefined)) setOpen(false);
	};

	//> main
	return (
		<>
			{/* default buttons */}
			{type === FormType.new && buttonType === 'default' && !tooltip && (
				<Button variant="contained" startIcon={<Icon>add</Icon>} {...buttonProps} onClick={handleOpen}>{`${label.trim()}`}</Button>
			)}
			{type === FormType.new && buttonType === 'default' && tooltip && (
				<Tooltip title={tooltip}>
					<Button variant="contained" startIcon={<Icon>add</Icon>} {...buttonProps} onClick={handleOpen}>{`${label.trim()}`}</Button>
				</Tooltip>
			)}

			{type === FormType.update && buttonType === 'default' && !tooltip && (
				<Button variant="contained" startIcon={<Icon>edit</Icon>} {...buttonProps} onClick={handleOpen}>
					Edit
				</Button>
			)}

			{type === FormType.update && buttonType === 'default' && tooltip && (
				<Tooltip title={tooltip}>
					<Button variant="contained" startIcon={<Icon>edit</Icon>} {...buttonProps} onClick={handleOpen}>
						Edit
					</Button>
				</Tooltip>
			)}

			{/* icons buttons */}
			{type === FormType.new && buttonType === 'icon-button' && !tooltip && (
				<IconButton size="small" {...buttonProps} onClick={handleOpen}>
					<Icon>add</Icon>
				</IconButton>
			)}
			{type === FormType.new && buttonType === 'icon-button' && tooltip && (
				<Tooltip title={tooltip}>
					<IconButton size="small" {...buttonProps} onClick={handleOpen}>
						<Icon>add</Icon>
					</IconButton>
				</Tooltip>
			)}

			{type === FormType.update && buttonType === 'icon-button' && !tooltip && (
				<IconButton size="small" {...buttonProps} onClick={handleOpen}>
					<Icon>edit</Icon>
				</IconButton>
			)}

			{type === FormType.update && buttonType === 'icon-button' && tooltip && (
				<Tooltip title={tooltip}>
					<IconButton size="small" {...buttonProps} onClick={handleOpen}>
						<Icon>edit</Icon>
					</IconButton>
				</Tooltip>
			)}

			{/* menu buttons */}
			{type === FormType.new && buttonType === 'menu' && (
				<Tooltip title={tooltip || ''}>
					<Icon
						fontSize="small"
						sx={{
							mt: 1,
							mb: 0,
							p: 0,
							color: (theme) =>
								theme.palette.mode === 'dark' ? alpha(theme.palette.grey[200], 0.2) : alpha(theme.palette.grey[800], 0.2),
							'&:hover': {
								color: (theme) =>
									theme.palette.mode === 'dark' ? alpha(theme.palette.grey[200], 0.8) : alpha(theme.palette.grey[800], 0.8),
							},
						}}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleOpen(e);
						}}
					>
						{menuIcon}
					</Icon>
				</Tooltip>
			)}

			{/* table buttons */}
			{type === FormType.new && buttonType === 'table' && (
				<Tooltip title={tooltip || ''}>
					<Button
						sx={{
							py: 0.5,
						}}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleOpen(e);
						}}
						startIcon={<Icon>{menuIcon}</Icon>}
					>
						{label}
					</Button>
				</Tooltip>
			)}

			{/* //> dialog */}
			<Dialog
				fullWidth={true}
				maxWidth={maxWidth || 'sm'}
				disableEscapeKeyDown
				onClick={(e) => e.stopPropagation()}
				open={open}
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
								if (input.type === FormInputTypes.currency && Number(values?.[input.name]) > Number(input?.max))
									errors = { ...errors, [input.name]: 'This is more than required.' };
							}
						});

						return errors;
					}}
					render={({ handleSubmit, submitting, pristine, errors }) => (
						<form onSubmit={handleSubmit}>
							{overrideTitle && <DialogTitle onCancel={handleCancel}>{overrideTitle}</DialogTitle>}
							{!overrideTitle && label && (
								<DialogTitle onCancel={handleCancel}>
									{type === FormType.new
										? `Add new ${title.toLocaleLowerCase().trim()}`
										: `Edit ${title.toLocaleLowerCase().trim()}`}
								</DialogTitle>
							)}
							<DialogContent>
								{submitError && (
									<DialogContentText>
										<Alert severity="error">{submitError}</Alert>
									</DialogContentText>
								)}
								<Grid container spacing={2}>
									{/* //> inputs */}
									{inputs?.map((input: IFormInputComponentProps, inputIdx: number) => (
										<Grid item xs={input?.width || 12} key={`input-${input.name}-${inputIdx}`}>
											<Input {...input} error={errors?.[input.name]} />
										</Grid>
									))}
								</Grid>
							</DialogContent>

							<DialogActions>
								<LoadingButton
									type="submit"
									variant="contained"
									color="success"
									loading={submitting}
									disabled={pristine || submitting}
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
		</>
	);
};

export default FormButton;
