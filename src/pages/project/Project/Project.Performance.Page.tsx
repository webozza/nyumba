//mui
import { Box, Button, Icon, Stack, Typography } from '@mui/material';
//components
import { Card } from '../../../components/Card/Card';
import { DefaultBody } from '../../../components/Layouts/Layout.Default';
import { ProjectPerformanceTable } from '../../../components/TableControls/Table.Project.Performance';

export const ProjectPerformancePage = () => {
	return (
		<DefaultBody>
			<Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
				<Typography variant="h6">
					<b>Performance Ratings</b>
				</Typography>
			</Stack>

			<Stack spacing={2}>
				<Box sx={{ width: '1040px' }}>
					<Card
						title="Ratings"
						// component={
						// 	<Button size="small" variant="contained" color="success" startIcon={<Icon>thumb_up</Icon>} disableElevation>
						// 		Approve
						// 	</Button>
						// }
					>
						<ProjectPerformanceTable />
					</Card>
				</Box>
			</Stack>
		</DefaultBody>
	);
};
