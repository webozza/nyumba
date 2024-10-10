import { TableCell as MUITableCell, Typography } from '@mui/material';
import { TableCellProps } from '.';

export const TableCellDefault = (props: TableCellProps) => {
	return (
		<MUITableCell
			colSpan={props.colSpan}
			width={props.width}
			align={props.align || 'left'}
			padding="none"
			sx={{
				p: 0.2,
				color: (theme) => (props.isZero === true ? theme.palette.text.disabled : theme.palette.text.primary),
				border: 0,
			}}
		>
			{props.children}
			{props.value && (
				<Typography
					variant="body2"
					sx={{
						fontSize: '0.9rem',
						px: 1,
					}}
				>
					{props.value}
				</Typography>
			)}
		</MUITableCell>
	);
};
