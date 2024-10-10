import { Alert, Slide, Snackbar } from '@mui/material';

interface Props {
	message?: string;
	submitError: string | undefined;
	setSubmitError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ErrorSnackbar = ({ message, submitError, setSubmitError }: Props) => {
	return (
		<Snackbar
			open={!!submitError}
			anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
			autoHideDuration={3000}
			TransitionComponent={(props) => <Slide {...props} direction="up" />}
			onClose={(event: React.SyntheticEvent | Event, reason?: string) => {
				if (reason === 'clickaway') {
					return;
				}
				setSubmitError(undefined);
			}}
		>
			<Alert severity="error" sx={{ width: '100%' }}>
				{message || 'Error occurred during submit'}
			</Alert>
		</Snackbar>
	);
};
