import React from 'react';
import { NumericFormat } from 'react-number-format';
import { TableCell as MUITableCell, TextField, InputAdornment, alpha, Icon, Tooltip, CircularProgress } from '@mui/material';
import { TableCellInputType, TableCellProps } from '.';

export const CellInputNumberOverride = (props: TableCellProps) => {
	const [value, setValue] = React.useState<number>(Number(props.value) || 0);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	return (
		<MUITableCell
			colSpan={props.colSpan}
			padding="none"
			sx={{
				p: 0.2,
				border: 0,
			}}
			width={props.width}
			align={props.align || 'center'}
		>
			<NumericFormat
				name={props.name}
				disabled={props.disabled}
				fullWidth
				customInput={TextField}
				value={Number(props.value)}
				variant="outlined"
				size="small"
				thousandSeparator={true}
				onBlur={(e) => {
					e.stopPropagation();
					props.onBlur && props.onBlur(e);
				}}
				onValueChange={({ floatValue }) => {
					setValue(floatValue || 0);
				}}
				InputProps={{
					...(props.inputType === TableCellInputType.currencyOverride && {
						startAdornment: <InputAdornment position="end">R</InputAdornment>,
					}),
					...((props.inputType === TableCellInputType.number || props.uom) &&
						!props.valueIsOveride && {
							endAdornment: <InputAdornment position="end">{props.uom}</InputAdornment>,
						}),
					...(props.inputType === TableCellInputType.currencyOverride &&
						props.valueIsOveride && {
							endAdornment: isLoading ? (
								<InputAdornment position="end">
									<CircularProgress size="0.8rem" />
								</InputAdornment>
							) : (
								<InputAdornment position="end">
									{
										<Tooltip title="Value overridden. Click to restore original.">
											<Icon
												sx={{
													fontSize: 16,
													'&:hover': {
														cursor: 'pointer',
													},
												}}
												onClick={() => {
													setIsLoading(true);
													props?.removeOverride && props?.removeOverride();
												}}
											>
												close
											</Icon>
										</Tooltip>
									}
								</InputAdornment>
							),
						}),
					sx: {
						backgroundColor: props.valueIsOveride ? alpha('rgb(255, 165, 0)', 0.1) : 'inherit',
					},
				}}
				inputProps={{
					sx: {
						textAlign: 'right',
						border: 0,
						padding: '7px 10px 7px 10px',
						fontSize: '0.9rem',
						m: 0,
						color: !value || value === 0 ? 'text.disabled' : 'text.primary',
					},
				}}
			/>
		</MUITableCell>
	);
};
