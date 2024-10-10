import { CellInputText } from './Cell.Input.Text';
import { CellInputSelect } from './Cell.Input.Select';
import { CellInputTags } from './Cell.Input.Tags';
import { CellInputNumber } from './Cell.Input.Number';
import { TableCellDefault } from './Cell';

export enum TableCellInputType {
	default = 'default',
	text = 'text',
	number = 'number',
	currency = 'currency',
	currencyOverride = 'currencyOverride',
	select = 'select',
	tags = 'tags',
}

export interface TableCellProps {
	inputType?: TableCellInputType;
	name?: string;
	disabled?: boolean;
	placeholder?: string;
	value?: number | string | string[];
	valueIsOveride?: boolean;
	removeOverride?: () => void;
	colSpan?: number;
	uom?: string;
	options?: string[];
	onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
	onChange?: (name: string, value: number) => void;

	//style
	align?: 'right' | 'left' | 'center' | 'inherit' | 'justify' | undefined;
	width?: string | number | undefined;

	isZero?: boolean;
	children?: any;
}

export const TableCell = (props: TableCellProps) => {
	switch (props.inputType) {
		case TableCellInputType.text:
			return <CellInputText {...props} />;

		case TableCellInputType.number:
			return <CellInputNumber {...props} />;

		case TableCellInputType.currency:
		case TableCellInputType.currencyOverride:
			return <CellInputNumber {...props} />;

		case TableCellInputType.select:
			return <CellInputSelect {...props} />;

		case TableCellInputType.tags:
			return <CellInputTags {...props} />;

		case TableCellInputType.default:
		default:
			return <TableCellDefault {...props} />;
	}
};
