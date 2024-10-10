import { Box, CircularProgress, Stack, Typography } from '@mui/material';

interface Props {
	type?: 'fullscreen' | 'outlet';
	message?: string;
}

export const Loading = ({ message, type = 'fullscreen' }: Props) => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				...(type === 'fullscreen' && {
					height: (theme) => `calc(100vh - 64px - ${theme.spacing(1)})`,
				}),
				...(type === 'outlet' && {
					height: (theme) => `calc(100vh - 64px - ${theme.spacing(18)})`,
				}),
			}}
		>
			<Stack spacing={4} alignItems="center">
				<CircularProgress size="4em" thickness={3} />
				{!message && <Typography variant="body2">Fetching data</Typography>}
				{message && <Typography variant="body2">{message}</Typography>}
			</Stack>
		</Box>
	);
};
