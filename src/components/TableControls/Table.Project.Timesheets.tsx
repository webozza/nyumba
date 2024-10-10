//mui
import React from 'react';
import moment from 'moment';
import { NumericFormat } from 'react-number-format';
import { useMutation } from 'react-query';
// mui
import { Box, Icon, InputBase, Stack, TableBody, TableCell, TableContainer, TableRow, Typography, alpha, useTheme } from '@mui/material';
// interfaces
import IEmployee from '../../lib/interfaces/Employee.interface';
import ITimesheetV2, { TimesheetTypeEnumV2 } from '../../lib/interfaces/Timesheet.interface';
import TimesheetService from '../../lib/services/Timesheet.service';
// components
import { CompactTable } from '../Table/CompactTable';
import { CompactTableHeaderItemProps, CompactTableHeaders } from '../Table/Header/Table.Compact.Headers';
import { CellInputWrapper, CellTextWrapper } from '../Table/Cell/Cell.Wrapper';
import { ErrorSnackbar } from '../Errors/Error.Snackbar';
import { toCurrencyText, toNumber } from '../../lib/utils/text.utils';
import { useParams, useSearchParams } from 'react-router-dom';
import { TimesheetAddBlankTableButton } from '../FormControls/Buttons/timesheet/Timesheet.Add.Blank.TableButton';
import { FormType } from '../../lib/interfaces/Form.interface';

type Props = {
	refetch: () => void;
	employees: IEmployee[] | undefined;
};

export const ProjectTimesheetTable = ({ employees, refetch }: Props) => {
	const theme = useTheme();
	const params = useParams();
	const [searchParams] = useSearchParams();
	const projectId: string = params.id || '';
	const date = searchParams.get('date') || moment().format('YYYY-MM-DD');

	const [submitError, setSubmitError] = React.useState<string | undefined>();

	const editTimesheetEntry = useMutation<ITimesheetV2, Error, ITimesheetV2>(
		async (props: ITimesheetV2) => TimesheetService.patchTimesheetV2(props),
		{
			onMutate: () => {
				setSubmitError(undefined);
			},
			onError: (error) => {
				setSubmitError(error.message);
			},
			onSettled: () => refetch(),
		}
	);

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

	const headers = React.useMemo(() => {
		// builds the headers with dates
		const days = moment(date).daysInMonth();
		const headersDates = Array.from(Array(days).keys()).map((key) => {
			const year = Number(moment(date).format('YYYY'));
			const month = Number(moment(date).format('MM')) - 1;
			const thisDate = new Date(year, month, key + 1);
			const dayOfWeek = moment(thisDate).format('ddd');
			const isWeekend = moment(thisDate).weekday() === 0 || moment(thisDate).weekday() === 6;

			return {
				title: `${dayOfWeek}`,
				subtitle: String(key + 1),
				width: '75px',
				align: 'center',
				highlight: isWeekend,
			};
		});
		const _headers: CompactTableHeaderItemProps[] = [
			{ title: 'Name', width: '150px', sticky: true },
			{ title: 'Total', width: '75px', align: 'center', sticky: true },
			...(headersDates as CompactTableHeaderItemProps[]),
		];

		return _headers;
	}, []);

	if (!employees || employees.length === 0) {
		return (
			<Stack spacing={2} alignItems="center" sx={{ p: 1, color: 'text.secondary' }}>
				<Icon fontSize="large">search</Icon>
				<Typography variant="body2">No timesheets found</Typography>
				<Typography variant="body2">Start by adding new employees to the list, or use the mobile app to log times</Typography>
				<TimesheetAddBlankTableButton
					initialValues={{
						projectId,
						type: TimesheetTypeEnumV2.erection,
						date: new Date(),
						qty: 0,
					}}
					type={FormType.new}
					onSettled={() => {
						refetch();
					}}
				/>
			</Stack>
		);
	}

	return (
		<Stack>
			<TableContainer
				sx={{
					'& .MuiTableCell-root': {
						p: 0.1,
						m: 0,
						border: 0,
					},
				}}
			>
				<CompactTable>
					<CompactTableHeaders headers={headers} />
					<TableBody
						sx={{
							width: `calc(100vw - ${theme.spacing(72)})`,
							maxWidth: `calc(100vw - ${theme.spacing(72)})`,

							position: 'relative',

							overflowX: 'scroll',
							overflowY: 'visible',
							marginLeft: '150px',
						}}
					>
						{(!employees || employees.length === 0) && (
							<TableRow key={`row-timesheet-no-data`}>
								<TableCell colSpan={2}>
									<Stack spacing={1} direction="row" alignItems="center" sx={{ p: 1, color: 'text.secondary' }}>
										<Icon fontSize="small">error</Icon>
										<Typography variant="body2">None timesheets found</Typography>
									</Stack>
								</TableCell>
							</TableRow>
						)}

						{employees &&
							employees?.map((employee: IEmployee, employeeIdx: number) => {
								return (
									<TableRow key={`row-timesheet-${employeeIdx}`}>
										{/* //- name */}
										<TableCell
											sx={{
												px: 0,
												m: 0,
												position: 'sticky',
												left: 0,
												zIndex: 999,
												backgroundColor: (theme) =>
													theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50],
											}}
										>
											<Box sx={{ p: 1 }}>
												<Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
													{employee?.name}
												</Typography>
											</Box>
										</TableCell>
										{/* //- total */}
										<TableCell
											align="center"
											sx={{
												px: 0,
												m: 0,
												backgroundColor: (theme) =>
													theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50],
											}}
										>
											<Box sx={{ p: 1 }}>
												<Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
													{toCurrencyText(
														employee.timeByDayOfMonth?.reduce((acc, obj) => {
															return (acc += obj?.value || 0);
														}, 0) || 0
													)}
												</Typography>
											</Box>
										</TableCell>
										{/* //- days */}
										{employee.timeByDayOfMonth?.map((day, dayIdx: number) => {
											return (
												<TableCell align="center" padding="none" key={day.day}>
													<Box sx={{ width: headers[dayIdx + 1]?.width || undefined, height: '36px', p: 0.25 }}>
														<InputHours
															name="qty"
															value={day.value || 0}
															width={headers[dayIdx + 1]?.width || undefined}
															isWeekend={day.isWeekend}
															onBlur={(e) => {
																if (toNumber(e?.target?.value) !== toNumber(day.value)) {
																	handleChange(
																		TimesheetTypeEnumV2.erection,
																		day.date,
																		projectId,
																		employee._id,
																		e.target.name,
																		toNumber(e.target.value)
																	);
																}
															}}
															onChange={(name, value) => {
																if (toNumber(value) !== toNumber(day.value)) {
																	handleChange(
																		TimesheetTypeEnumV2.erection,
																		day.date,
																		projectId,
																		employee._id,
																		name,
																		toNumber(value)
																	);
																}
															}}
														/>
													</Box>
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}

						{/* //- space  */}
						<Box sx={{ minHeight: (theme) => theme.spacing(2) }} />
					</TableBody>
				</CompactTable>
			</TableContainer>

			{/* //- new employee  */}
			<Box sx={{ py: 2, width: 400 }}>
				<TimesheetAddBlankTableButton
					initialValues={{
						projectId,
						type: TimesheetTypeEnumV2.erection,
						date: new Date(),
						qty: 0,
					}}
					type={FormType.new}
					onSettled={() => {
						refetch();
					}}
				/>
			</Box>
			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</Stack>
	);
};

interface InputHoursProps {
	name: string;
	value: number;
	width: string | number | undefined;
	isWeekend: boolean;
	onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
	onChange?: (name: string, value: number) => void;
}

export const InputHours = (props: InputHoursProps) => {
	const theme = useTheme();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [focused, setFocused] = React.useState<boolean>(false);
	const [onEdit, setOnEdit] = React.useState<boolean>(false);
	const [value, setValue] = React.useState<number>(props.value);

	if (!onEdit)
		return (
			<Box onClick={() => setOnEdit(true)}>
				<CellTextWrapper>{props.value}</CellTextWrapper>
			</Box>
		);

	return (
		<CellInputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
			<NumericFormat
				name={props.name}
				fullWidth
				customInput={InputBase}
				value={value}
				size="small"
				thousandSeparator={true}
				autoFocus={true}
				inputProps={{
					sx: {
						textAlign: 'center',
						border: 0,
						padding: '7px 10px 7px 10px',
						fontSize: '0.9rem',
						m: 0,
						p: 0,
						backgroundColor: props.isWeekend
							? theme.palette.mode === 'dark'
								? alpha(theme.palette.grey[900], 1)
								: alpha(theme.palette.grey[900], 0.1)
							: '',
					},
				}}
				onFocus={() => setFocused(true)}
				onChange={(e) => {
					setValue(toNumber(e.target.value));
				}}
				onKeyDown={(e) => {
					if (e.key === 'Escape') {
						setValue(toNumber(props.value)); //reset to default value else edit and disaply values are different
						setFocused(false);
						setOnEdit(false);
					}
					if (e.key === 'Enter') {
						setFocused(false);
						setOnEdit(false);
						props.onChange && props.onChange(props.name, value);
					}
				}}
				onBlur={() => {
					setFocused(false);
					setOnEdit(false);
					props.onChange && props.onChange(props.name, value);
				}}
			/>
		</CellInputWrapper>
	);
};
