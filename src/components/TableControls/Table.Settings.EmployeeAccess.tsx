//mui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material/';
//components
import ResetPasswordButton from '../FormControls/Buttons/user/User.ResetPassword.Button';
import { MoreButton } from '../FormControls/Buttons/components/Table.More.Button';
import IUser from '../../lib/interfaces/User.interface';
import { FormType } from '../../lib/interfaces/Form.interface';
import { DeleteUserButton } from '../FormControls/Buttons/user/User.Delete.Button';
import UserFormButton from '../FormControls/Buttons/user/User.Add.Button';

interface Props {
  data: IUser[] | undefined
  refetch: () => void
}

export const ClientEmployeeSettingsTable = ({ data, refetch }: Props) => {
  return (
    <TableContainer sx={{
      border: theme => `1px solid ${theme.palette.divider}`,
      maxHeight: theme => `calc(100vh - ${theme.spacing(30)})`,
      "&::-webkit-scrollbar": {
        width: 10
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: 2
      },
      borderRadius: 2.5,
    }}>
      <Table  size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* no data */}
          {(!data || data.length <= 0) && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No data
              </TableCell>
            </TableRow>
          )}

          {/* data */}
          {data && data.map((user) => (
            <TableRow
              key={`user-table-row-${user.email}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {/* //> cells */}
              <TableCell component="th" scope="row">
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles.join(", ")}</TableCell>

              {/* //> button */}
              <TableCell align="right">
                <UserFormButton type={FormType.update} onSettled={() => refetch()} initialValues={user}
                  buttonProps={{
                    sx: {
                      mr: 1
                    }
                  }}
                />
                <MoreButton>
                  <ResetPasswordButton onSettled={() => refetch()} initialValues={{
                    _id: user?._id,
                    name: user?.name,
                    password: ''
                  }} />
                  <DeleteUserButton onSettled={() => refetch()} user={{
                    _id: user?._id,
                    name: user?.name,
                  }} />
                </MoreButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}