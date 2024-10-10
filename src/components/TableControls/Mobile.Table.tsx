import { TableCell, TableCellProps, TableContainer, TableRow } from '@mui/material';

interface MobileTableProps {
	children?: any | any[];
}
export const MobileTable = ({ children }: MobileTableProps) => {
	return (
		<TableContainer
			sx={{
				border: `1px solid black`,
			}}
		>
			{children}
		</TableContainer>
	);
};

interface MobileTableRowProps {
	children?: any | any[];
}
export const MobileTableRow = ({ children }: MobileTableRowProps) => {
	return <TableRow>{children}</TableRow>;
};

interface MobileTableCellProps {
	TableCellProps?: TableCellProps;
	children?: any | any[];
}
export const MobileTableCell = ({ TableCellProps, children }: MobileTableCellProps) => {
	return (
		<TableCell
			padding="none"
			size="small"
			sx={{
				border: 0,
			}}
			{...TableCellProps}
		>
			{children}
		</TableCell>
	);
};
