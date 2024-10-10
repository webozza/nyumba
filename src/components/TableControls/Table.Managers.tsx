import {
  Box,
  Icon,
  IconButton,
  Paper,
  Table as MUITable,
  TableBody as MUITableBody,
  TableCell as MUITableCell,
  TableContainer as MUITableContainer,
  TableHead as MUITableHead,
  TableRow as MUITableRow,
} from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import IProject from '../../lib/interfaces/Project.interface';
import ProjectService from '../../lib/services/Project.service';
import { ProjectAddManagerButton } from '../FormControls/Buttons/project/Project.Add.Manager.Button';
import { FormType } from '../../lib/interfaces/Form.interface';
import { ErrorSnackbar } from '../Errors/Error.Snackbar';

interface Props {
	project: IProject;
	refetch: () => void;
}
export const ManagersTable = ({ project, refetch }: Props) => {
	const [submitError, setSubmitError] = useState<string | undefined>();

	const deleteManager = useMutation(
		async (props: any): Promise<IProject> => {
			return ProjectService.deleteManager(props);
		},
		{
			onMutate: () => {
				setSubmitError(undefined);
			},
			onError: (error: Error) => {
				setSubmitError(error.message);
			},
			onSuccess: () => {
				refetch();
			},
		}
	);

	return (
		<>
			<Box>
				<ProjectAddManagerButton
					type={FormType.new}
					initialValues={{
						projectId: project._id,
					}}
					onSettled={() => refetch()}
				/>
				{/* <Button variant="outlined">
          <Icon>engineering</Icon> Add Manager
        </Button> */}
			</Box>
			<MUITableContainer component={Paper} variant="outlined">
				<MUITable>
					<MUITableHead>
						<MUITableRow>
							<MUITableCell sx={{ width: '10px' }}></MUITableCell>
							<MUITableCell>Name</MUITableCell>
							<MUITableCell>Employee Number</MUITableCell>
							<MUITableCell>Make Changes</MUITableCell>
						</MUITableRow>
					</MUITableHead>
					<MUITableBody>
						{/* no managers assigned */}
						{project?.managers && project?.managers.length == 0 && (
							<MUITableRow>
								<MUITableCell colSpan={3} align="center">
									No Managers assigned
								</MUITableCell>
							</MUITableRow>
						)}
						{project?.managers &&
							project?.managers.map((manager, idx) => (
								<MUITableRow key={`manager-table${idx}`}>
									<MUITableCell></MUITableCell>
									<MUITableCell>{manager.name}</MUITableCell>
									<MUITableCell>{manager.employeeId || 'No Employee Number'}</MUITableCell>
									<MUITableCell>
										<IconButton
											color="error"
											onClick={async () => {
												deleteManager.mutate({
													projectId: project?._id,
													managerId: manager._id,
												});
											}}
										>
											<Icon>delete</Icon>
										</IconButton>
									</MUITableCell>
								</MUITableRow>
							))}
					</MUITableBody>
				</MUITable>
			</MUITableContainer>

			<ErrorSnackbar submitError={submitError} setSubmitError={setSubmitError} />
		</>
	);
};
