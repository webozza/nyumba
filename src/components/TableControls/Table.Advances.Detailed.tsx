import React from 'react';
import moment from 'moment';
import {
  TableRow as MUITableRow,
  TableHead,
  TableBody,
  TableContainer as MUITableContainer,
  Table as MUITable,
  Stack,
  FormControlLabel,
  Switch,
  Box,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { TableHeaderItemDefault } from '../Table/Header/Table.Header';
import { TableCell, TableCellInputType } from '../Table/Cell';
import { ProjectWorkTypeEnum } from '../../lib/interfaces/Project.interface';
import { useMutation } from 'react-query';
import { IAdvance, IAdvanceTypeEnum, IEmployeeAdvancesDetail } from '../../lib/interfaces/Advance.interface';
import AdvanceService from '../../lib/services/Advances.service';
import { ErrorSnackbar } from '../Errors/Error.Snackbar';

type Props = {
	refetch: () => void;
	employeeId: string;
	advances: IAdvance[];
};
export const EmployeeAdvancesDetailedTable = ({ refetch, employeeId, advances }: Props) => {
	const [submitError, setSubmitError] = React.useState<string | undefined>();
	const [showAll, setShowAll] = React.useState<boolean>(false);
	const [params] = useSearchParams();
	const date = params.get('date');
	const [rowCount, setRowCount] = React.useState<number>(-1);

	const formTypeOptions: string[] = [];
	Object.values(ProjectWorkTypeEnum).map((key: string) => {
		if (key !== undefined) formTypeOptions.push(key);
	});

	// mutations
	const editAdvance = useMutation<IEmployeeAdvancesDetail, Error, IEmployeeAdvancesDetail>(
		async (props: IEmployeeAdvancesDetail) => AdvanceService.createOrUpdateAdvance(props),
		{
			onMutate: () => setSubmitError(undefined),
			onError: (error) => setSubmitError(error.message),
			onSettled: () => refetch(),
		}
	);

	const handleChange = (props: IEmployeeAdvancesDetail) => {
		editAdvance.mutate({ ...(props as IEmployeeAdvancesDetail), type: IAdvanceTypeEnum.advance });
	};

	const rows = React.useMemo(() => {
		const numDays = Number(moment(date).endOf('month').format('DD'));
		const month = Number(moment(date).format('MM'));
		const year = Number(moment(date).format('YYYY'));

		const _rows: JSX.Element[] = [];
		for (let x = 1; x <= numDays; x++) {
			const _date = moment(new Date(year, month - 1, x))
				.set('hour', 10)
				.set('minutes', 0)
				.set('seconds', 0)
				.toDate();

			// get existing
			let _current: IEmployeeAdvancesDetail = {
				employeeId,
				date: _date,
			};
			advances.map((advance) => {
				if (moment(advance.date).format('YYYY-MM-DD') === moment(_date).format('YYYY-MM-DD')) {
					_current = advance;
				}
			});

			// increment visible rows
			if (showAll || (!showAll && (_current.description || _current.amount))) setRowCount((prevRowCount) => (prevRowCount += 1));

			// push
			_rows.push(
				<MUITableRow
					sx={{
						p: 0,
						display: showAll || (!showAll && (_current.description || _current.amount)) ? 'table-row' : 'none',
						'&:last-child td, &:last-child th': { border: 0 },
					}}
				>
					{/* date */}
					<TableCell align="center">{moment(_date).format('ddd, DD')}</TableCell>

					{/* description */}
					<TableCell
						width="20%"
						inputType={TableCellInputType.text}
						name="description"
						value={_current?.description || ''}
						onBlur={(e) => {
							handleChange({
								employeeId,
								date: _date,
								[e.target.name]: e.target.value,
							});
						}}
					/>

					{/* amount */}
					<TableCell
						inputType={TableCellInputType.currencyOverride}
						name="amount"
						value={_current?.amount || 0}
						onBlur={(e) => {
							handleChange({
								employeeId,
								date: _date,
								[e.target.name]: Number(e.target.value.split(',').join('') || 0),
							});
						}}
					/>
				</MUITableRow>
			);
		}

		return _rows;
	}, [showAll]);

	return (
		<Box>
			<Stack direction="row" justifyContent="flex-end">
				<FormControlLabel
					control={<Switch size="small" />}
					label="Show all days"
					checked={showAll}
					onChange={() => setShowAll((prev) => !prev)}
				/>
			</Stack>
			<MUITableContainer>
				<MUITable
					size="small"
					sx={{
						width: '77%',
						borderCollapse: 'collapse',
						borderTop: 0,
					}}
				>
					<TableHead>
						<MUITableRow>
							<TableHeaderItemDefault align="center" width="25%">
								Date
							</TableHeaderItemDefault>
							<TableHeaderItemDefault width="50%">Description</TableHeaderItemDefault>
							<TableHeaderItemDefault align="center" width="20%">
								Advances
							</TableHeaderItemDefault>
						</MUITableRow>
					</TableHead>

					{rowCount < 0 && (
						<TableBody>
							<TableCell colSpan={3} align="center">
								<Stack spacing={1} sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, p: 2 }}>
									<Typography variant="body2">No advances for this month.</Typography>
									<Typography variant="caption">Select 'Show all days' to add more</Typography>
								</Stack>
							</TableCell>
						</TableBody>
					)}
					{rowCount >= 0 && <TableBody>{rows}</TableBody>}
				</MUITable>
			</MUITableContainer>

			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</Box>
	);
};
