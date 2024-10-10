import { TableRow } from '@mui/material';
import { TableCell, TableCellInputType, TableCellProps } from '../Cell';
import { toNumber } from '../../../lib/utils/text.utils';

export interface CompactTableRowProps {
	name: any;
	rowIndex: number;
	onChange?: (name: string, value: string | number, rowIndex: number, columnIndex: number) => void;
	columns: TableCellProps[];
}

export const CompactTableRow = ({ rowIndex, name, columns, onChange }: CompactTableRowProps) => {
	return (
		<TableRow id={`${name}-row-${rowIndex}`} key={`${name}-row-${rowIndex}`}>
			{columns?.map((column: TableCellProps, _columnIdx: number) => {
				return (
					<TableCell
						key={`${name}-row-${rowIndex}-col-${_columnIdx}`}
						//- props
						{...column}
						//- onBlur
						onBlur={(e) => {
							if (onChange) {
								const _name = e.target.name || e.target.id || '';
								if (column.inputType === TableCellInputType.currency || column.inputType === TableCellInputType.number) {
									const _value = toNumber(e.target.value);
									onChange(_name, _value, rowIndex, _columnIdx);
								} else {
									const _value = String(e.target.value);
									onChange(_name, _value, rowIndex, _columnIdx);
								}
							}
						}}
					/>
				);
			})}
		</TableRow>
	);
};
