import { DialogActions as MUIDialogActions, alpha } from '@mui/material';

type DialogActionsProp = {
	children: JSX.Element;
};

export const DialogActions = ({ children }: DialogActionsProp) => {
	return (
		<MUIDialogActions
			sx={{
				p: 1,
				backgroundColor: (theme) =>
					theme.palette.mode === 'dark' ? alpha(theme.palette.primary.dark, 0.25) : alpha(theme.palette.primary.dark, 0.8),
			}}
		>
			{children}
		</MUIDialogActions>
	);
};
