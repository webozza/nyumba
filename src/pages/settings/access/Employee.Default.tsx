import { useQuery, UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router-dom';
//mui
import { Stack, Typography } from '@mui/material';
//components
import IUser from '../../../lib/interfaces/User.interface';
import UserService from '../../../lib/services/User.service';
import { DefaultBody } from '../../../components/Layouts/Layout.Default';
import UserFormButton from '../../../components/FormControls/Buttons/user/User.Add.Button';
import { FormType } from '../../../lib/interfaces/Form.interface';
import { ClientEmployeeSettingsTable } from '../../../components/TableControls/Table.Settings.EmployeeAccess';
import { Loading } from '../../../components/Loader/Loading';


export const DefaultUserAdminPage = () => {
  const navigate = useNavigate()
  const { data, refetch, isLoading, isError }: UseQueryResult<IUser[], Error> = useQuery<IUser[], Error>('users', UserService.getUsers)

  if (isLoading) return <Loading />
  if (isError) navigate('/error')

  // this prevents flicker on error
  if (!isError) return (
    <DefaultBody>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6"><b>Employee Access</b></Typography>
        <UserFormButton type={FormType.new} onSettled={() => refetch()} />
      </Stack>

      <ClientEmployeeSettingsTable
        data={data}
        refetch={refetch}
      />
    </DefaultBody>
  )

  // prevents flicker one error
  return <></>
}
