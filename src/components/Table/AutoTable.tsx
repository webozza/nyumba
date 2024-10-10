import React from 'react';
import _ from 'lodash';
import {
  Table as MUITable,
  TableCell,
  TableContainer as MUITableContainer,
  TableHead,
  TableRow as MUITableRow,
  TableBody as MUITableBody,
  alpha,
  Typography,
  Stack,
  Icon,
  Collapse,
  Box,
  Paper,
  TablePropsSizeOverrides,
} from '@mui/material';
import { OverridableStringUnion } from '@mui/types';
import { TableHeaderItemSortable } from './Header/Table.Header.Sortable';

export enum TableRowsTypesEnum {
	number = 'number',
	string = 'string',
}

export interface TableHeaderSortProps {
	name: string;
	direction: 1 | -1;
}

type TableRowsProps = {
	_id: string;
	columns: {
		type?: TableRowsTypesEnum;
		value?: string | number | undefined;
		component?: JSX.Element;
		align?: 'center' | 'left' | 'right' | 'inherit' | 'justify' | undefined;
	}[];
	// The component that will render in te collapse section
	details?: JSX.Element;
};

type TableProps = {
	options?: {
		width?: string | undefined;
		onRowClick?: (rowId: string, row?: any) => void | undefined;
		canDelete?: boolean;
		expand?: boolean;
		compact?: boolean;
		filter?: boolean;
		size?: OverridableStringUnion<'small' | 'medium', TablePropsSizeOverrides> | undefined;
	};
	headers: {
		name?: string;
		label?: string;
		sortable?: boolean;
		align?: 'center' | 'left' | 'right' | 'inherit' | 'justify' | undefined;
		width?: number | string | undefined;
	}[];
	data: any[] | undefined;
	rows: TableRowsProps[] | undefined;
};

export const AutoTable = ({ data, headers, rows, options }: TableProps) => {
	const [sort, setSort] = React.useState<TableHeaderSortProps>();

	const sortedRows: TableRowsProps[] | undefined = React.useMemo(() => {
		const _rows: TableRowsProps[] = rows && rows.length > 0 ? [...rows] : []; //make copy of rows

		if (data && data.length > 0 && !_.isEmpty(sort) && _rows && _rows.length > 0) {
			const columnIdx = _rows[0].columns?.findIndex((column: any) => column.name === sort?.name); //get column we are filtering from

			_rows?.sort((a, b) => {
				const aType = a.columns[columnIdx]?.type;
				const aValue = a.columns[columnIdx]?.value;
				const bValue = b.columns[columnIdx]?.value;

				if (aType === TableRowsTypesEnum.string) {
					if (sort.direction === -1) return String(aValue).localeCompare(String(bValue));
					if (sort.direction === 1) return String(bValue).localeCompare(String(aValue));
				}

				if (aType === TableRowsTypesEnum.number) {
					if (sort.direction === -1) return Number(aValue) - Number(bValue);
					if (sort.direction === 1) return Number(bValue) - Number(aValue);
				}

				return 0;
			});
		}
		return _rows;
	}, [rows, sort]);

	return (
		<TableContainer size={options?.size || 'medium'} maxWidth={options?.width || '100%'}>
			<TableHead>
				<MUITableRow>
					{/* add collapse button space */}
					{options?.expand === true && (
						<TableCell
							key={`header-expand`}
							width="10"
							sx={{
								backgroundColor: (theme) => theme.palette.background.default,
							}}
						></TableCell>
					)}

					{headers &&
						headers.map((header, i) => {
							return (
								<TableHeaderItemSortable
									key={`header-${i}`}
									name={header?.name || ''}
									label={header?.label || ''}
									align={header?.align || 'left'}
									width={header?.width || ''}
									sortable={header?.sortable || false}
									currentSort={sort}
									onSort={(name: string, direction: 1 | -1) => {
										setSort({
											name,
											direction,
										});
									}}
								/>
							);
						})}

					{/* add delete button spacer */}
					{options?.canDelete === true && <TableCell key={`header-delete`} width="10"></TableCell>}
				</MUITableRow>
			</TableHead>

			<MUITableBody>
				{sortedRows?.length == 0 && (
					<TableRow>
						<TableCell colSpan={headers.length + (options?.canDelete ? 1 : 0) + (options?.expand ? 1 : 0)}>
							<Stack alignItems="center">No data</Stack>
						</TableCell>
					</TableRow>
				)}
				{sortedRows &&
					sortedRows.map((row, rowIdx) => {
						return (
							<TableRow
								key={row?._id || `table-row-${rowIdx}`}
								onClick={() => {
									const _row = data && data.length > 0 ? data[rowIdx] : {};
									if (options?.onRowClick) options?.onRowClick(row._id, _row);
								}}
								details={row?.details} //only show the collapse if the row.detail contains an JSX.Element
								colCount={headers.length || 0}
							>
								{row.columns &&
									row.columns.map((column, columnIdx) => {
										return (
											<TableCell
												key={`column-${columnIdx}-${row._id}`}
												align={column.align || 'left'}
												sx={{
													border: 0,
												}}
											>
												{/* if value is passed */}
												{column?.value !== undefined && column?.component === undefined && (
													<Typography variant="body2">{column?.value}</Typography>
												)}

												{/* if custom component is passed */}
												{column?.component && <>{column?.component}</>}
											</TableCell>
										);
									})}

								{/* add delete button */}
								{/* {options?.canDelete === true && (
									<TableCell>
										<MoreButton2 _id={row?._id} buttons={[MoreButtonTypeEnum.delete_project]} />
									</TableCell>
								)} */}
							</TableRow>
						);
					})}
			</MUITableBody>
		</TableContainer>
	);
};

type TableContainerProps = {
	type?: 'default' | 'flat';
	size?: OverridableStringUnion<'small' | 'medium', TablePropsSizeOverrides> | undefined;
	maxWidth?: string;
	children: JSX.Element | JSX.Element[];
};
export const TableContainer = ({ type, size, maxWidth, children }: TableContainerProps) => {
	if (type === 'flat') {
		return (
			<MUITableContainer sx={{ maxWidth }}>
				<MUITable size={size || 'medium'}>{children}</MUITable>
			</MUITableContainer>
		);
	}
	return (
		<MUITableContainer component={Paper} sx={{ maxWidth }}>
			<MUITable size={size || 'medium'}>{children}</MUITable>
		</MUITableContainer>
	);
};

type TableRowProps = {
	onClick?: () => void;
	details?: any;
	colCount?: number; // number of columns. used for colSpan calculation when details are available
	children: any;
};
export const TableRow = ({ onClick, details, colCount, children }: TableRowProps) => {
	const [open, setOpen] = React.useState<boolean>(false);

	return (
		<>
			<MUITableRow
				sx={{
					'&:hover': {
						backgroundColor: (theme) =>
							theme.palette.mode === 'dark' ? alpha(theme.palette.grey[100], 0.1) : alpha(theme.palette.grey[800], 0.1),
						cursor: 'pointer',
					},
					backgroundColor: (theme) => (open ? alpha(theme.palette.primary.main, 0.2) : 'inherit'),
				}}
				onClick={() => {
					if (onClick) onClick();
					if (details) setOpen((prev) => !prev);
				}}
			>
				{details && (
					<TableCell
						sx={{
							border: 0,
						}}
					>
						{open && <Icon>keyboard_arrow_up</Icon>}
						{!open && <Icon>keyboard_arrow_down</Icon>}
					</TableCell>
				)}

				{children}
			</MUITableRow>

			<MUITableRow sx={{ backgroundColor: 'background.default' }}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={colCount}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box>{details}</Box>
					</Collapse>
				</TableCell>
			</MUITableRow>
		</>
	);
};
