import { TreeItem as MUITreeItem } from '@mui/lab';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface StylesTreeItemProps {
	nodeId: string;
	title: string;
	icon: string;
	action?: JSX.Element;
	url?: string;
	disabled?: boolean;
	children?: JSX.Element | JSX.Element[] | undefined;
}

export const TreeItem = ({ nodeId, title, icon, url, action, disabled, children }: StylesTreeItemProps) => {
	const navigate = useNavigate();
	return (
		<MUITreeItem
			disabled={disabled}
			nodeId={nodeId}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				if (url && disabled !== true) navigate(url);
			}}
			sx={{
				p: 0,
				m: 0,
				my: 1,
				'& .MuiTreeItem-iconContainer': {
					width: 2,
				},
				color: 'text.secondary',
			}}
			label={
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Stack direction="row" spacing={2} sx={{ py: 1 }} alignItems="center">
						<Icon fontSize="small">{icon}</Icon>
						<Typography variant="body2">{title}</Typography>
					</Stack>
					<Box>{action}</Box>
				</Stack>
			}
		>
			{children}
		</MUITreeItem>
	);
};
