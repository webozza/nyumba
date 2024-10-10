import { Box, Typography } from '@mui/material';

type Props = {
	message?: string;
};
export const ErrorPage = ({ message }: Props) => {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: (theme) => `calc(100vh - 64px - ${theme.spacing(1)})`,
			}}
		>
			<Typography variant="h4" fontWeight="bold">
				Oops!
			</Typography>
			<Box sx={{ pt: 5 }} />
			<Typography>{message || 'Sorry, an unexpected error has occured.'}</Typography>
		</Box>
	);
};
