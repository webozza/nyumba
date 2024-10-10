import { InputBase } from '@mui/material';
import { TableCellProps } from '.';
import { CellInputWrapper } from './Cell.Wrapper';
import React from 'react';
import { TableInputCell } from './Cell.Input';

export const CellInputText = (props: TableCellProps) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [focused, setFocused] = React.useState<boolean>(false);

	return (
		<TableInputCell {...props}>
			<CellInputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
				<InputBase
					name={props.name}
					disabled={props.disabled}
					placeholder={props.placeholder || ''}
					defaultValue={props.value}
					onFocus={() => setFocused(true)}
					onBlur={(e) => {
						e.stopPropagation();
						setFocused(false);
						props.onBlur && props.onBlur(e);
					}}
					sx={{
						m: 0,
						p: 0,
						width: '100%',
						'& .MuiInputBase-input': {
							fontSize: '0.9rem',
						},
						'& .MuiInputBase-root': {
							border: 0,
						},
					}}
				/>
			</CellInputWrapper>
		</TableInputCell>
	);
};
