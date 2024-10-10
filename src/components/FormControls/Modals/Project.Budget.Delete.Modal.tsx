import React from 'react';
import { useMutation } from 'react-query';
//components
import BudgetService, { DeleteBudgetProps } from '../../../lib/services/Budget.service';
import { IBudgetV2 } from '../../../lib/interfaces/Budget.interface';
import { Button, Dialog, DialogContentText, Icon, TextField, useTheme } from '@mui/material';
import { DialogTitle } from '../../Dialog/Dialog.Title';
import { DialogContent } from '../../Dialog/Dialog.Content';
import { DialogActions } from '../../Dialog/Dialog.Actions';

interface ProjectFormButtonProps {
	budgetId: string;
	budgetName: string;
	open: boolean;
	setOpen: (value: boolean) => void;
	onSettled?: (values: IBudgetV2 | undefined) => unknown;
}

export const ProjectDeleteBudgetFormModal = ({ budgetId, budgetName, open, setOpen, onSettled }: ProjectFormButtonProps) => {
	const theme = useTheme();
	const [submitError, setSubmitError] = React.useState<string | undefined>();
	const [value, setValue] = React.useState<string | undefined>();

	// mutations
	const deleteBudget = useMutation<DeleteBudgetProps, Error, any>(async (props: DeleteBudgetProps) => BudgetService.deleteBudgetV2(props), {
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

	const handleDelete = () => {
		deleteBudget.mutate({ budgetId });
		// setOpen(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	//> main
	return (
		<div>
			<Dialog
				open={open}
				onClose={handleClose}
				onClick={(e) => e.stopPropagation()}
				sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
				maxWidth="xs"
			>
				<DialogTitle onCancel={handleClose}>{`Delete ${budgetName || ''}`}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Type{' '}
						<span
							style={{
								border: '1px solid grey',
								borderRadius: '5px',
								padding: '3px',
								userSelect: 'none',
								fontSize: '0.85rem',
								backgroundColor: theme.palette.mode === 'dark' ? 'gray' : 'lightgray',
							}}
						>
							<strong>{budgetName}</strong>
						</span>{' '}
						to confirm the deletion.
					</DialogContentText>
					<TextField
						id="name"
						fullWidth
						autoFocus
						margin="dense"
						variant="outlined"
						onChange={(e) => {
							setValue(e.target.value);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDelete} color="error" variant="contained" disabled={value !== budgetName} startIcon={<Icon>delete</Icon>}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ProjectDeleteBudgetFormModal;
