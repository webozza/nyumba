import React from 'react';
import { NumericFormat } from 'react-number-format';
import { OutlinedInput } from '@mui/material';
import { TableCellInputType, TableCellProps } from '.';
import { CellInputWrapper } from './Cell.Wrapper';
import { TableInputCell } from './Cell.Input';

export const CellInputNumber = (props: TableCellProps) => {
	const [value, setValue] = React.useState<number>(Number(props.value) || 0);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [focused, setFocused] = React.useState<boolean>(false);

	return (
		<TableInputCell align={'right'}>
			<CellInputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
				<NumericFormat
					id={props.name}
					disabled={props.disabled}
					name={props.name}
					fullWidth
					value={props.value as number}
					size="small"
					prefix={props.inputType === TableCellInputType.currency ? 'R ' : undefined}
					suffix={props.uom || undefined}
					thousandSeparator={true}
					allowLeadingZeros={false}
					onFocus={(e) => {
						setFocused(true);
						e.target.select();
					}}
					onBlur={(e) => {
						e.stopPropagation();
						setFocused(false);
						props.onBlur && props.onBlur(e);
					}}
					onValueChange={({ floatValue }) => {
						setValue(floatValue || 0);
					}}
					customInput={OutlinedInput}
					inputProps={{
						startAdornment: 'R',
						endAdornment: '%',
						sx: {
							textAlign: props.align || 'right',
							border: `0 !important`,
							padding: '7px 10px 7px 10px',
							fontSize: '0.9rem',
							m: 0,
							color: !value || value === 0 ? 'text.disabled' : 'text.primary',
						},
					}}
				/>
			</CellInputWrapper>
		</TableInputCell>
	);
};
