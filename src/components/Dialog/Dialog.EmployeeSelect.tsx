import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import { blue } from '@mui/material/colors';
import { Icon, IconButton } from '@mui/material';
import IEmployee from '../../lib/interfaces/Employee.interface';

const emails = ['username@gmail.com', 'user02@gmail.com'];

type Props = {
	employees: IEmployee[];
	onSelect: (employeeId: string) => void;
};

export const AddEmployeeFABDialog = ({ employees, onSelect }: Props) => {
	const [open, setOpen] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(emails[1]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (value: string) => {
		setOpen(false);
		setSelectedValue(value);
		onSelect(value);
	};

	return (
		<div>
			<IconButton
				edge="start"
				size="large"
				sx={{
					position: 'fixed',
					bottom: 15,
					right: 15,
					backgroundColor: (theme) => theme.palette.primary.dark,
					color: 'white',
				}}
				onClick={handleClickOpen}
			>
				<Icon>person_add</Icon>
			</IconButton>
			<AddEmployeeDialog selectedValue={selectedValue} open={open} onClose={handleClose} employees={employees} />
		</div>
	);
};

export interface AddEmployeeDialogProps {
	employees: IEmployee[];
	open: boolean;
	selectedValue: string;
	onClose: (value: string) => void;
}

const AddEmployeeDialog = (props: AddEmployeeDialogProps) => {
	const { onClose, selectedValue, open } = props;

	const handleClose = () => {
		onClose(selectedValue);
	};

	const handleListItemClick = (value: string) => {
		onClose(value);
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<List sx={{ pt: 0 }}>
				{props.employees.map((employee) => (
					<ListItem disableGutters>
						<ListItemButton onClick={() => handleListItemClick(employee?._id || '')} key={employee._id}>
							<ListItemAvatar>
								<Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
									<Icon>person</Icon>
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={employee?.name || ''} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Dialog>
	);
};
