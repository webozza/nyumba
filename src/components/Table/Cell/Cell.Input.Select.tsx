import { TableCell as MUITableCell, MenuItem, Select } from '@mui/material';
import { TableCellProps } from '.';
import { toProperCase } from '../../../lib/utils/text.utils';

export const CellInputSelect = (props: TableCellProps) => {
	return (
		<MUITableCell
			colSpan={props.colSpan}
			padding="none"
			sx={{
				p: 0.2,
				border: 0,
			}}
			width={props.width}
			align={props.align || 'left'}
		>
			<Select
				size="small"
				value={props.value || ''}
				disabled={props.disabled}
				sx={{
					m: 0,
					p: 0,
					width: '100%',
					'& .MuiInputBase-root': {
						border: 0,
					},
				}}
				inputProps={{
					variant: 'outlined',
					sx: {
						textAlign: 'center',
						border: 0,
						m: 0,
						padding: '6px 10px 5.5px 10px',
						fontSize: '0.9rem',
					},
				}}
			>
				{props?.options?.map((option, idx) => (
					<MenuItem key={`select-${idx}`} value={option}>
						{toProperCase(option)}
					</MenuItem>
				))}
			</Select>
		</MUITableCell>
	);
};
