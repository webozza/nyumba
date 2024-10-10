import { Icon, IconButton, DialogTitle as MUIDialogTitle, Stack, Typography, alpha } from '@mui/material';

type DialogTitleProp = {
	children: string;
	onCancel: () => void;
};

export const DialogTitle = ({ onCancel, children }: DialogTitleProp) => {
	return (
		<MUIDialogTitle
			sx={{
				p: 1,
				pl: 4,
				backgroundColor: (theme) =>
					theme.palette.mode === 'dark' ? alpha(theme.palette.primary.dark, 0.25) : alpha(theme.palette.primary.dark, 0.8),
				color: 'white',
			}}
		>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<b>
					<Typography variant="subtitle1">{children}</Typography>
				</b>

				<IconButton onClick={onCancel} size="small" sx={{ color: 'white' }}>
					<Icon>close</Icon>
				</IconButton>
			</Stack>
		</MUIDialogTitle>
	);
};
