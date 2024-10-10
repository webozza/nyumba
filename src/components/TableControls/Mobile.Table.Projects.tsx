import React from 'react';
import { Icon, MenuItem, Paper, Stack, Typography } from '@mui/material';
import IProject, { ProjectTypeEnum } from '../../lib/interfaces/Project.interface';
import { MobileTitleBar } from '../Title/Title.Mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { toCurrencyText, toProperCase } from '../../lib/utils/text.utils';

interface Props {
	projects: IProject[] | undefined;
}

export const MobileProjectsTable = ({ projects }: Props) => {
	const [params] = useSearchParams();
	const date = moment(params.get('date') || new Date());
	const navigate = useNavigate();
	const [filter, setFilter] = React.useState<string>('');

	// filters by search terms
	const filtered = React.useMemo(() => {
		if (projects && filter) {
			return projects.filter((project) => project.name.toLowerCase().includes(filter.toLowerCase()));
		}
		return projects;
	}, [projects, filter]);

	return (
		<Stack spacing={4} sx={{overflowY:'scroll'}}>
			<MobileTitleBar
				title="Timesheets"
				searchTitle="Filter on name"
				setFilterText={setFilter}
				options={{ showFilter: true, showCalendar: true }}
			/>
			<Stack
				spacing={2}
				sx={{
					height: (theme) => `calc(100vh - 120px - ${theme.spacing(8)})`,
				}}
			>
				{(!filtered || filtered.length === 0) && (
					<Paper
						elevation={8}
						sx={{
							width: '100%',
							borderRadius: 5,
							p: 2,
						}}
					>
						<Typography align="center" variant="body2">
							No projects matching criteria
						</Typography>
					</Paper>
				)}

				{filtered &&
					filtered.map((project) => {
						return (
							<MenuItem
								key={project._id}
								onClick={() => navigate(`/time/${project._id}?date=${moment(date).format('YYYY-MM-DD')}`)}
								sx={{
									p: 5,
									m: 'auto'
								}}
							>
								<Paper
									elevation={8}
									sx={{
										width: '100%',
										borderRadius: 5,
										p: 2,
									}}
								>
									<Stack direction="row" alignItems="center" justifyContent="space-between">
										<Stack direction="row" alignItems="center" spacing={2}>
											{project.type === ProjectTypeEnum.general_yard_work && (
												<Icon sx={{ color: 'text.secondary' }}>handyman</Icon>
											)}
											{project.type === ProjectTypeEnum.erection && <Icon sx={{ color: 'text.secondary' }}>add_business</Icon>}
											{project.type === ProjectTypeEnum.welding && (
												<Icon sx={{ color: 'text.secondary', transform: 'rotate(90deg)' }}>auto_fix_normal</Icon>
											)}

											<Stack sx={{width: 120, overflow: 'hidden' }}>
												<Typography variant="body2" sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
													{project.name}
												</Typography>
												<Typography variant="caption">{toProperCase(project.type.split('_').join(' '))}</Typography>
											</Stack>

										</Stack>

										<Stack direction="row" alignItems="center" spacing={2}>
											<Typography variant="body2">{toCurrencyText(project.totals.timesheets.total, 2)} days</Typography>
											<Icon sx={{ color: 'text.secondary' }}>schedule</Icon>
										</Stack>
									</Stack>
								</Paper>
							</MenuItem>
						);
					})}
			</Stack>
		</Stack>
	);
};
