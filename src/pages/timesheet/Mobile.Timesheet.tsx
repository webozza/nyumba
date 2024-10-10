import { useMutation, useQuery } from 'react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { MobileBody } from '../../components/Layouts/Layout.Mobile';
import { ErrorPage } from '../Error.Page';
import { Loading } from '../../components/Loader/Loading';
import { MobileTitleBar } from '../../components/Title/Title.Mobile';
import { Box, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import TimesheetService from '../../lib/services/Timesheet.service';
import moment, { Moment } from 'moment';
import { NumericFormat } from 'react-number-format';
import ITimesheetV2, { TimesheetTypeEnumV2 } from '../../lib/interfaces/Timesheet.interface';
import React from 'react';
import { ErrorSnackbar } from '../../components/Errors/Error.Snackbar';
import { AddEmployeeFABDialog } from '../../components/Dialog/Dialog.EmployeeSelect';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ProjectTypeEnum } from '../../lib/interfaces/Project.interface';

export const MobileTimesheetPage = () => {
	const [searchParams] = useSearchParams();
	const _date = moment(searchParams.get('date') || new Date());
	const params = useParams();
	const projectId: string = params.projectId || '';
	const [submitError, setSubmitError] = React.useState<string | undefined>();
	const [date, setDate] = React.useState<Moment>(_date);
	const [startTime, setStartTime] = React.useState<Moment | null>();
	// const [endTime, setEndTime] = React.useState<Moment | null>();
	const WORK_HOURS_IN_A_DAY = 10;

	// data
	const { data, refetch, isLoading, isError } = useQuery({
		queryKey: 'project',
		queryFn: async () => TimesheetService.getTimesheetsByProjectAndDate(projectId, moment(date).format('YYYY-MM-DD')),
		enabled: !!projectId,
	});

	// mutations
	const editTimesheetEntry = useMutation<ITimesheetV2, Error, ITimesheetV2>(async (props: ITimesheetV2) => TimesheetService.patchTimesheet(props), {
		onMutate: () => setSubmitError(undefined),
		onError: (error) => setSubmitError(error.message),
		onSettled: () => refetch(),
	});

	React.useEffect(() => {
		if (_date.format('YYYY-MM-DD') !== date.format('YYYY-MM-DD')) {
			setDate(_date);
			refetch();
		}
	}, [_date]);

	const handleSubmit = (employeeId: string, endTime: Moment, type: TimesheetTypeEnumV2) => {
		if (startTime && endTime) {
			const ms = new Date(endTime.toDate()).getTime() - new Date(startTime.toDate()).getTime();
			const hoursWorked = ms / 1000 / 60 / 60;
			const dayPortion = hoursWorked / WORK_HOURS_IN_A_DAY;

			editTimesheetEntry.mutate({
				projectId,
				employeeId,
				date: moment(date).set('hour', 10).set('minutes', 0).set('seconds', 0).toDate(),
				type,
				qty: dayPortion,
			});
		}
	};

	if (isLoading) return <Loading />;
	if (isError) return <ErrorPage />;

	return (
		<MobileBody>
			<Stack spacing={4}>
				<MobileTitleBar
					title={data?.name || ''}
					subTitle={moment(date).format('DD MMM YYYY')}
					options={{ showFilter: false, showCalendar: false, showBackButton: true }}
				/>

				<Stack
					spacing={2}
					sx={{
						height: (theme) => `calc(100vh - 120px - ${theme.spacing(8)})`,
					}}
				>
					{data?.employees?.map((employee) => {
						return (
							<Paper
								id={employee._id}
								key={employee._id}
								elevation={8}
								sx={{
									width: '100%',
									borderRadius: 5,
									p: 2,
								}}
							>
								<Stack direction="row" alignItems="center" sx={{ width: '100%' }} spacing={1}>
									<Box sx={{ width: '33%' }}>
										<Typography variant="body2">{employee.name}</Typography>
									</Box>

									<LocalizationProvider dateAdapter={AdapterMoment}>
										<Box sx={{ width: '33%' }}>
											{/* //* start */}
											<MobileTimePicker
												label="Start"
												onAccept={(e: Moment | null) => {
													if (e) setStartTime(moment(e).seconds(0).millisecond(0));
												}}
											/>
										</Box>
										<Box sx={{ width: '33%' }}>
											{/* //* end */}
											<MobileTimePicker
												label="End"
												onAccept={(e: Moment | null) => {
													if (e) {
														const _type: TimesheetTypeEnumV2 =
															data.type === ProjectTypeEnum.erection
																? TimesheetTypeEnumV2.erection
																: TimesheetTypeEnumV2.project;
														handleSubmit(employee._id, e.seconds(0).millisecond(0), _type);
													}
												}}
											/>
										</Box>
									</LocalizationProvider>
								</Stack>
							</Paper>
						);
					})}
					<Box
						sx={{
							height: 75,
							minHeight: 75,
						}}
					/>
				</Stack>
			</Stack>

			<AddEmployeeFABDialog
				employees={data?.allEmployees || []}
				onSelect={(employeeId: string) => {
					// add a blank entry so user shows up in table
					editTimesheetEntry.mutate({
						projectId,
						employeeId,
						date: moment(date).toDate(),
						type: TimesheetTypeEnumV2.driving,
						qty: 0,
					});
				}}
			/>

			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</MobileBody>
	);
};

type InputProps = {
	name: string;
	value: number;
	uom: string;
	min?: number;
	max?: number;
	onBlur: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
};

const Input = ({ name, value, uom, min, max, onBlur }: InputProps): JSX.Element => {
	return (
		<NumericFormat
			name={name}
			min={min || undefined}
			max={max || undefined}
			fullWidth
			customInput={TextField}
			value={value}
			variant="outlined"
			size="small"
			thousandSeparator={true}
			onBlur={(e) => {
				e.stopPropagation();
				onBlur(e);
			}}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<Typography variant="caption">{uom}</Typography>
					</InputAdornment>
				),
			}}
			inputProps={{
				sx: {
					textAlign: 'center',
					border: 0,
					padding: '7px 10px 7px 10px',
					fontSize: '0.9rem',
					m: 0,
					// color: !value || value === 0 ? 'text.disabled' : 'text.primary',
				},
			}}
		/>
	);
};
