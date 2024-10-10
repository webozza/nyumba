import React from 'react';
import {
  Box,
  TableRow as MUITableRow,
  TableCell as MUITableCell,
  TableHead,
  TableBody,
  Typography,
  Collapse,
  alpha,
  Icon,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import { TableContainer } from '../Table/AutoTable';
import { TableCell, TableCellInputType } from '../Table/Cell';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { ErrorSnackbar } from '../Errors/Error.Snackbar';
import { IAdvance, IAdvanceTypeEnum, IEmployeeAdvances, IEmployeeAdvancesDetail } from '../../lib/interfaces/Advance.interface';
import { toCurrencyText } from '../../lib/utils/text.utils';
import { EmployeeAdvancesDetailedTable } from './Table.Advances.Detailed';
import AdvanceService from '../../lib/services/Advances.service';
import moment from 'moment';
import { TableHeaderItemSortable } from '../Table/Header/Table.Header.Sortable';

type TimeReviewTableProps = {
	refetch: () => void;
	employees: IEmployeeAdvances[];
};
export const EmployeeAdvancesTable = ({ refetch, employees }: TimeReviewTableProps) => {
	const [submitError, setSubmitError] = React.useState<string | undefined>();
	const [params] = useSearchParams();
	const date = params.get('date');

	// mutations
	const updateAdvance = useMutation<any, Error, any>(async (props: IEmployeeAdvancesDetail) => AdvanceService.createOrUpdateAdvance(props), {
		onMutate: () => {
			setSubmitError(undefined);
		},
		onError: (error) => {
			setSubmitError(error.message);
		},
	});

	const handleDeductionsChange = (employeeId: string, amount: string) => {
		const _amount = Number(amount.split(',').join(''));
		if (employeeId && (_amount || _amount === 0)) updateAdvance.mutate({ employeeId, date, amount: _amount, type: IAdvanceTypeEnum.deduction });
	};

	if (employees.length === 0)
		return (
			<Stack sx={{ p: 2 }} alignItems="center">
				<Typography variant="body2">No data captured for this time period</Typography>
			</Stack>
		);

	return (
		<Stack sx={{ p: 1, pt: 0, mb: 1 }}>
			<TableContainer maxWidth="50%">
				<TableHead>
					<MUITableRow>
						<TableHeaderItemSortable name="employee" label="Employee" sortable={true} />
						<TableHeaderItemSortable name="closing" label="Opening Balance" sortable={true} width="15%" align="center" />
						<TableHeaderItemSortable
							name="advances"
							label={`${moment(date).format('MMMM')} Advances`}
							sortable={true}
							width="15%"
							align="center"
						/>
						<TableHeaderItemSortable
							name="deductions"
							label={`${moment(date).format('MMMM')} Deductions`}
							sortable={true}
							width="15%"
							align="center"
						/>
						<TableHeaderItemSortable name="" label="" width="2%" align="center"></TableHeaderItemSortable>
						<TableHeaderItemSortable name="" label="" width="2%" align="center"></TableHeaderItemSortable>
					</MUITableRow>
				</TableHead>

				<TableBody
				// sx={{
				// 	'& .MuiTableCell-root': {
				// 		border: 0,
				// 	},
				// }}
				>
					{employees.map((employee, employeeIdx) => {
						return (
							<TableRow
								key={`${employeeIdx}-${employee.employeeId}`}
								advances={employee.advances}
								employeeId={employee._id}
								refetch={refetch}
							>
								{/* employee */}
								<TableCell>
									<Box sx={{ pl: 1 }}>{employee.name}</Box>
								</TableCell>
								<TableCell align="center" isZero={!employee.totalClosing || employee.totalClosing === 0}>{`R ${toCurrencyText(
									employee.totalClosing || 0
								)}`}</TableCell>
								<TableCell align="center" isZero={!employee.totalAdvances || employee.totalAdvances === 0}>{`R ${toCurrencyText(
									employee.totalAdvances || 0
								)}`}</TableCell>
								<TableCell
									align="center"
									inputType={TableCellInputType.currencyOverride}
									name="travel"
									value={employee.totalDeductions || 0}
									onBlur={(e) => {
										handleDeductionsChange(employee._id || '', e.target.value);
									}}
								></TableCell>
							</TableRow>
						);
					})}
				</TableBody>

				<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
			</TableContainer>
		</Stack>
	);
};

type TableRowProps = {
	refetch: () => void;
	employeeId: string;
	advances?: IAdvance[];
	children: any;
};
export const TableRow = ({ employeeId, advances, children, refetch }: TableRowProps) => {
	const [open, setOpen] = React.useState<boolean>(false);
	return (
		<>
			<MUITableRow
				sx={{
					backgroundColor: (theme) => (theme.palette.mode === 'dark' ? alpha(theme.palette.grey[800], 0.2) : 'inherit'),
					// '&:last-child td, &:last-child th': { border: 0 },
				}}
			>
				{children}

				{/* edit button */}
				<MUITableCell
					padding="none"
					align="center"
					sx={{
						px: 2,
						border: 0,
					}}
					onClick={(e) => {
						e.preventDefault();
					}}
				>
					<Tooltip title="Approve Project Earnings">
						<IconButton
							color="success"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							<Icon>recommend</Icon>
						</IconButton>
					</Tooltip>
				</MUITableCell>

				<MUITableCell
					padding="none"
					align="center"
					sx={{
						px: 2,
						// borderRight: (theme) => `0.5px solid ${theme.palette.divider}`,
						// borderBottomWidth: open ? 0 : 1,
						borderWidth: 0.5,
						borderColor: (theme) => theme.palette.divider,
						backgroundColor: (theme) => (open ? alpha(theme.palette.primary.main, 0.2) : 'background.default'),
						'&:hover': {
							cursor: 'pointer',
							backgroundColor: (theme) =>
								theme.palette.mode === 'dark' ? alpha(theme.palette.grey[100], 0.1) : alpha(theme.palette.grey[800], 0.1),
						},
					}}
					onClick={(e) => {
						e.preventDefault();
						setOpen((prev) => !prev);
					}}
				>
					<Stack
						direction="row"
						alignItems="center"
						sx={{
							p: 0,
							height: '100%',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Icon
							sx={{
								fontSize: '12pt',
							}}
						>
							{open ? 'close' : 'edit'}
						</Icon>
					</Stack>
				</MUITableCell>
			</MUITableRow>

			{advances && (
				<MUITableRow sx={{ backgroundColor: 'background.default' }}>
					<MUITableCell
						padding="none"
						sx={{
							p: 0,
							pb: open ? 2 : 0,
							border: (theme) => `0.5px solid ${theme.palette.divider}`,
							borderBottomWidth: open ? 1 : 0,
							borderRight: 0,
							borderTopWidth: (theme) => (open ? 1 : theme.palette.mode === 'light' ? 1 : 0),
							backgroundColor: (theme) => (open === true ? alpha(theme.palette.primary.main, 0.2) : 'inherit'),
						}}
						colSpan={7}
					>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box sx={{ py: 2 }}>
								<EmployeeAdvancesDetailedTable
									employeeId={employeeId}
									advances={advances.filter((advance) => advance.type === IAdvanceTypeEnum.advance)}
									refetch={refetch}
								/>
							</Box>
						</Collapse>
					</MUITableCell>
					<MUITableCell
						padding="none"
						sx={{
							p: 0,
							pb: open ? 2 : 0,
							borderRight: (theme) => `0.5px solid ${theme.palette.divider}`,
							borderBottomWidth: open ? 1 : 0,
							// border: 0,
							backgroundColor: (theme) => (open === true ? alpha(theme.palette.primary.main, 0.2) : 'inherit'),
						}}
					></MUITableCell>
				</MUITableRow>
			)}
		</>
	);
};
