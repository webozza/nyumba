import { SxProps, TableCell, Theme, Typography } from '@mui/material';

type Props = {
	children?: string;
	align?: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined;
	width?: string | number | undefined;
	sx?: SxProps<Theme> | undefined;
};

export const TableHeaderItemDefault = ({ children, align, width, sx }: Props) => {
	return (
		<TableCell padding="none" width={width || 'auto'} align={align || 'left'} sx={{ ...sx }}>
			<Typography variant="caption">
				<b>{children}</b>
			</Typography>
		</TableCell>
	);
};
