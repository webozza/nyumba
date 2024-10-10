import React from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Box, Stack, Typography } from '@mui/material'
// components
import { MobileBody } from '../../components/Layouts/Layout.Mobile'
import { Loading } from '../../components/Loader/Loading'
import { TableMainMenuItem } from '../../components/Menu/TableMenu.Mobile'
import { SearchMobile } from '../../components/Search/Search.Mobile'
import IEmployee from '../../lib/interfaces/Employee.interface'
import EmployeeService from '../../lib/services/Employee.service'
import EmployeeAddButton from '../../components/FormControls/Buttons/employee/Employee.Add.Button'
import { FormType } from '../../lib/interfaces/Form.interface'
import { ErrorPage } from '../Error.Page'

export const MobileEmployeesPage = (): JSX.Element => {
  const navigate = useNavigate()
  const [searchFilter, setSearchFilter] = React.useState<string>()
  const { data, refetch, isLoading, isError }: UseQueryResult<IEmployee[], Error> = useQuery<IEmployee[], Error>('employees', EmployeeService.getEmployeesV2)

  if (isLoading) return <Loading />
  if (isError) return <ErrorPage />

  const handleSearch: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchFilter(e.target.value)
  }

  return (
    <MobileBody>
      <Box sx={{ mb: 2 }}>
        <SearchMobile onSearch={handleSearch} />
      </Box>

      <Stack spacing={3}>
        {/* no data without search*/}
        {(!data || data.length <= 0 && !searchFilter) && (
          <Typography align='center'>No data</Typography>
        )}

        {/* data */}
        {data && data.filter((val) => searchFilter ? val.name.toLowerCase().includes(searchFilter.toLowerCase() as string) : true).map((employee) => {
          return (
            <TableMainMenuItem
              key={employee._id}
              title={employee.name}
              subtitle={''}
              subtitle1={''}
              icon='person'
            />
          )
        })}
      </Stack>

      <EmployeeAddButton type={FormType.new} onSettled={() => refetch()} />
    </MobileBody>
  )
}
