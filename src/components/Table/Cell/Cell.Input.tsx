import { TableCell as MUITableCell } from '@mui/material';
import { TableCellProps } from '.';

export const TableInputCell = ({ colSpan, width, align, children }: TableCellProps) => {
	return (
		<MUITableCell
			colSpan={colSpan}
			padding="none"
			sx={{
				p: 0.2,
				border: 0,
			}}
			width={width}
			align={align || 'left'}
		>
			{children}
		</MUITableCell>
	);
};
