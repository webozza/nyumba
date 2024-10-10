import React from 'react'
import { useMutation } from "react-query"
//components
import { FormType } from '../../../lib/interfaces/Form.interface'
import EmployeeService from '../../../lib/services/Employee.service'
import IEmployee, { IEmployeeSelectOptions } from '../../../lib/interfaces/Employee.interface'
import FormModal from '../../Form/Form.Modal'
import { AddEmployeeFormInputs } from '../Buttons/employee/Employee.Add.Button'

interface EmployeeFormButtonProps {
  type: FormType
  initialValues?: IEmployee | undefined
  open: boolean
  existingEmployees: IEmployeeSelectOptions[],
  setOpen: (value: boolean) => void
  onSettled: (values: IEmployee | undefined) => unknown
  onCancel: () => void
}

export const EmployeeFormModal = ({ type, initialValues, existingEmployees, open, setOpen, onSettled, onCancel }: EmployeeFormButtonProps) => {
  const [submitError, setSubmitError] = React.useState<string | undefined>();


  //> mutations
  const addEmployee = useMutation(async (props: IEmployee) =>
    EmployeeService.addEmployee(props), {
    onMutate: () => {
      setSubmitError(undefined)
    },
    onError: ((error: Error) => {
      setSubmitError(error.message)
    }),
    onSuccess: (data) => {
      onSettled(data)
    },
  })
  const updateEmployee = useMutation(async (props: IEmployee) =>
    EmployeeService.updateEmployee(props), {
    onMutate: () => {
      setSubmitError(undefined)
    },
    onError: ((error: Error) => {
      setSubmitError(error.message)
    }),
    onSuccess: () => {
      onSettled(undefined)
    },
  })


  //> main
  return (
    <FormModal
      label="Employee"
      type={type}
      initialValues={initialValues}
      submitError={submitError}
      inputs={AddEmployeeFormInputs}
      createFormMutation={addEmployee}
      updateFormMutation={updateEmployee}
      open={open}
      setOpen={setOpen}
      onCancel={onCancel}
      existing={existingEmployees}
    />
  )
}

export default EmployeeFormModal