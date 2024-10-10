import React from 'react';
import moment from 'moment';
import {
  TableRow as MUITableRow,
  TableHead,
  TableBody,
  TableContainer as MUITableContainer,
  Table as MUITable,
  Stack,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import ITimesheetV2, { TimesheetTypeEnumV2 } from '../../../lib/interfaces/Timesheet.interface';
import { useSearchParams } from 'react-router-dom';
import { TableHeaderItemDefault } from '../../Table/Header/Table.Header';
import { TableCell, TableCellInputType } from '../../Table/Cell';
import { ProjectWorkTypeEnum } from '../../../lib/interfaces/Project.interface';
import { useMutation } from 'react-query';
import TimesheetService from '../../../lib/services/Timesheet.service';
import { ErrorSnackbar } from '../../Errors/Error.Snackbar';

type TimeMonthDetailTableProps = {
	timesheets: ITimesheetV2[];
};
export const TimeReviewProjectDetailedTable = ({ timesheets }: TimeMonthDetailTableProps) => {
	const [submitError, setSubmitError] = React.useState<string | undefined>();
	const [params] = useSearchParams();
	const date = params.get('date');
	const [showAll, setShowAll] = React.useState<boolean>(false);

	const formTypeOptions: string[] = [];
	Object.values(ProjectWorkTypeEnum).map((key: string) => {
		if (key !== undefined) formTypeOptions.push(key);
	});

	// mutations
	const editTimesheetEntry = useMutation<ITimesheetV2, Error, ITimesheetV2>(async (props: ITimesheetV2) => TimesheetService.patchTimesheet(props), {
		onMutate: () => {
			setSubmitError(undefined);
		},
		onError: (error) => {
			setSubmitError(error.message);
		},
	});

	const handleChange = (type: TimesheetTypeEnumV2, day: Date, projectId: string, employeeId: string, name: string, value: string | number) => {
		if (!projectId || !employeeId || !type || !day || !name || name === '') return;

		editTimesheetEntry.mutate({
			projectId,
			employeeId,
			type,
			date: day,
			[name]: value,
		});
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
			let _projectId = '';
			let _employeeId = '';
			let _dayRate = 0;
			let _description = '';
			let _qty = 0;

			// get existing
			const _current: ITimesheetV2[] = [];
			timesheets.map((timesheet) => {
				if (timesheet.type !== TimesheetTypeEnumV2.erection) {
					_dayRate = Number(timesheet.dayRate);
					_projectId = timesheet.projectId || '';
					_employeeId = timesheet.employeeId || '';
					_description = timesheet.description || '';
					if (moment(timesheet.date).format('YYYY-MM-DD') === moment(_date).format('YYYY-MM-DD')) {
						_current.push(timesheet);
					}
				}
			});

			// days & travel
			_current.map((timesheet) => {
				_qty += Number(timesheet.qty);
			});

			_rows.push(
				<MUITableRow
					sx={{
						p: 0,
						'&:last-child td, &:last-child th': { border: 0 },
						display: showAll || (!showAll && _qty) ? 'table-row' : 'none',
					}}
				>
					{/* date */}
					<TableCell width="5%" align="center">
						{moment(_date).format('ddd, DD')}
					</TableCell>

					{/* qty */}
					<TableCell
						width="10%"
						inputType={TableCellInputType.number}
						name="qty"
						uom="days"
						value={_qty || 0}
						onBlur={(e) => {
							handleChange(TimesheetTypeEnumV2.erection, _date, _projectId, _employeeId, e.target.name, Number(e.target.value));
						}}
					/>

					{/* rate */}
					<TableCell
						width="10%"
						inputType={TableCellInputType.currencyOverride}
						name="dayRate"
						value={_dayRate}
						uom="/day"
						onBlur={(e) => {
							handleChange(TimesheetTypeEnumV2.erection, _date, _projectId, _employeeId, e.target.name, e.target.value);
						}}
					/>

					{/* description */}
					<TableCell
						width="20%"
						inputType={TableCellInputType.text}
						name="description"
						value={_description}
						onBlur={(e) => {
							handleChange(TimesheetTypeEnumV2.driving, _date, _projectId, _employeeId, e.target.name, e.target.value);
						}}
					/>

					<TableCell width="20%"></TableCell>
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
						width: '100%',
						borderCollapse: 'collapse',
					}}
				>
					<TableHead>
						<MUITableRow>
							<TableHeaderItemDefault align="center">Date</TableHeaderItemDefault>
							<TableHeaderItemDefault align="center">Worked</TableHeaderItemDefault>
							<TableHeaderItemDefault align="center">Rate</TableHeaderItemDefault>
							<TableHeaderItemDefault>Description</TableHeaderItemDefault>
						</MUITableRow>
					</TableHead>
					<TableBody>{rows}</TableBody>
				</MUITable>
			</MUITableContainer>

			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</Box>
	);
};
