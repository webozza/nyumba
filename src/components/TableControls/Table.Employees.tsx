import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import IEmployee from "../../lib/interfaces/Employee.interface"
import { MoreButton } from "../FormControls/Buttons/components/Table.More.Button"
import { DeleteEmployeeButton } from "../FormControls/Buttons/employee/Employee.Delete.Button"
import EmployeeAddButton from "../FormControls/Buttons/employee/Employee.Add.Button"
import { FormType } from "../../lib/interfaces/Form.interface"

export interface empProps {
  employees: IEmployee[] | undefined,
  refetchEmployees: any
}


export const EmployeeTable = ({ employees, refetchEmployees }: empProps) => {
  return (
    <TableContainer component={Paper} >
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Time Worked(days)</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* no data */}
          {(!employees || employees.length <= 0) && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No data
              </TableCell>
            </TableRow>
          )}

          {/* data */}
          {employees && employees.map((employee) => (
            <TableRow
              key={`employee-table-row-${employee._id}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {/* // cells */}
              <TableCell component="th" scope="row">
                {employee.name}
              </TableCell>

              <TableCell component="th" scope="row">

              </TableCell>

              {/* // button */}
              <TableCell align="right">
                <EmployeeAddButton type={FormType.update} onSettled={() => refetchEmployees()} initialValues={employee}
                  buttonProps={{
                    sx: {
                      mr: 1
                    }
                  }}
                />
                <MoreButton>
                  <DeleteEmployeeButton onSettled={() => refetchEmployees()} employee={{
                    _id: employee?._id,
                    name: employee?.name,
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

