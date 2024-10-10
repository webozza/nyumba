import React from 'react';
import { useQuery, UseQueryResult } from 'react-query';
import { useNavigate } from 'react-router-dom';
//mui
import { Typography } from '@mui/material/';
//components
import { Loading } from '../../components/Loader/Loading';
import { AutoTable } from '../../components/Table/AutoTable';
import { DefaultPage } from '../../components/Page/Page';
import IEmployee from '../../lib/interfaces/Employee.interface';
import EmployeeService from '../../lib/services/Employee.service';
import EmployeeAddButton from '../../components/FormControls/Buttons/employee/Employee.Add.Button';
import { FormType } from '../../lib/interfaces/Form.interface';
import { ErrorPage } from '../Error.Page';


export const DefaultEmployeePage = () => {
  const navigate = useNavigate()

  const { data, refetch, isLoading, isError }: UseQueryResult<IEmployee[], Error> =
    useQuery<IEmployee[], Error>(
      'employees',
      EmployeeService.getEmployeesV2
    )

  const rows = React.useMemo(() => {
    return data?.map((employee) => {
      return {
        _id: employee._id,
        columns: [
          { component: <Typography variant="body2">{employee.name}</Typography> },
          { component: <Typography variant="body2">{employee.employeeId}</Typography> },
          { component: <Typography variant="body2" align="center">{employee.dayRate}</Typography> },
          { component: <Typography variant="body2" align="center">{employee.travelAllowance}</Typography> },
        ]
      }
    })
  }, [data])

  if (isLoading) return <Loading />
  if (isError) return <ErrorPage />

  return (
    <DefaultPage
      type="default"
      title="Employees"
      status=""
      description="Employee management page"
      buttons={[
        <EmployeeAddButton type={FormType.new} onSettled={() => refetch()} />
      ]}
    >
      <AutoTable
        options={{
          canDelete: false,
          onRowClick: (rowId) => {
            navigate(`/employees/${rowId}`)
          }
        }}
        headers={[
          { name: 'name', label: "Name", sortable: true },
          { name: 'employeeId', label: "Employee Id", sortable: true },
          { name: 'dayRate', label: "Day Rate", sortable: true, align: "center" },
          { name: 'travelAllowance', label: "Travel Allowance", sortable: true, align: "center" },
          { label: "" },
        ]}
        data={data}
        rows={rows}
      />
    </DefaultPage>
  )
}