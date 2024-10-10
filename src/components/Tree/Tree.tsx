import { TreeView } from '@mui/lab';
import { Icon, Paper } from '@mui/material';

type Props = {
	children: JSX.Element | JSX.Element[];
	defaultExpanded?: string[];
};

export const Tree = ({ defaultExpanded, children }: Props) => {
	return (
		<Paper elevation={2}>
			<TreeView
				sx={{
					p: 0,
					m: 0,
					overflowY: 'auto',
					height: (theme) => `calc(100vh - ${theme.spacing(30)})`,
					// border: (theme) => `1px solid ${theme.palette.divider}`,
					borderRadius: 2,
				}}
				defaultCollapseIcon={<Icon sx={{ rotate: '90deg' }}>chevron_right</Icon>}
				defaultExpandIcon={<Icon>chevron_right</Icon>}
				defaultExpanded={defaultExpanded}
			>
				{children}
			</TreeView>
		</Paper>
	);
};
