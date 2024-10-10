import { Box, Table } from '@mui/material';

export interface CompactTableProps {
	width?: number | string;
	children: any | any[];
}
export const CompactTable = ({ width, children }: CompactTableProps) => {
	return (
		<Box
			sx={{
				p: 0,
				m: 0,
				width: width || '100%',
				maxWidth: width || '100%',
			}}
		>
			<Table
				size="small"
				sx={{
					borderCollapse: 'collapse',
					borderTop: 0,

					// width: width || '100%',
					// maxWidth: width || '100%',
				}}
			>
				{children}
			</Table>
		</Box>
	);
};
