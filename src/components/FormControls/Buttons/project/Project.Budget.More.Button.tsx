import React from 'react';
import { Divider, Icon, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import ProjectCopyBudgetFormModal from '../../Modals/Project.Budget.Copy.Modal';
import { FormType } from '../../../../lib/interfaces/Form.interface';
import { IBudgetV2 } from '../../../../lib/interfaces/Budget.interface';
import ProjectDeleteBudgetFormModal from '../../Modals/Project.Budget.Delete.Modal';
import { ProjectEditBudgetFormModal } from '../../Modals/Project.Budget.Edit.Modal';

export const ProjectBudgetMoreButton = ({ budget, refetch }: { budget: IBudgetV2; refetch: () => void }) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const [openCopyBudget, setOpenCopyBudget] = React.useState<boolean>(false);
	const [openDeleteBudget, setOpenDeleteBudget] = React.useState<boolean>(false);
	const [openEditBudget, setOpenEditBudget] = React.useState<boolean>(false);

	const handleClick = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleCopyBudget = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		handleClose();
		setOpenCopyBudget(true);
	};

	const handleEditBudget = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		handleClose();
		setOpenEditBudget(true);
	};

	const handleDeleteBudget = (e: React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		handleClose();
		setOpenDeleteBudget(true);
	};

	return (
		<React.Fragment>
			<IconButton size="small" onClick={handleClick}>
				<Icon>more_vert</Icon>
			</IconButton>

			<Menu
				id="budget_more_options_menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<MenuItem key="edit" onClick={handleEditBudget}>
					<ListItemIcon>
						<Icon>edit</Icon>
					</ListItemIcon>
					<Typography variant="body2">Edit</Typography>
				</MenuItem>

				<MenuItem key="delete" onClick={handleCopyBudget}>
					<ListItemIcon>
						<Icon>content_copy</Icon>
					</ListItemIcon>
					<Typography variant="body2">Copy</Typography>
				</MenuItem>

				<Divider />

				<MenuItem key="delete" onClick={handleDeleteBudget}>
					<ListItemIcon>
						<Icon>delete</Icon>
					</ListItemIcon>
					<Typography variant="body2">Delete</Typography>
				</MenuItem>
			</Menu>

			<ProjectEditBudgetFormModal
				initialValues={{
					_id: budget._id,
					name: budget.name,
					description: budget.description,
				}}
				open={openEditBudget}
				setOpen={setOpenEditBudget}
				onSettled={() => refetch()}
				onCancel={() => setOpenEditBudget(false)}
			/>

			<ProjectDeleteBudgetFormModal
				budgetName={budget.name}
				budgetId={budget._id}
				open={openDeleteBudget}
				setOpen={setOpenDeleteBudget}
				onSettled={() => refetch()}
			/>

			<ProjectCopyBudgetFormModal
				type={FormType.new}
				initialValues={{
					name: budget.name,
					fromBudgetId: budget._id,
				}}
				open={openCopyBudget}
				setOpen={setOpenCopyBudget}
				onCancel={() => setOpenCopyBudget(false)}
				onSettled={() => refetch()}
			/>
		</React.Fragment>
	);
};
