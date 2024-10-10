import React from 'react'
import { useMutation } from "react-query"
//mui
import { ButtonProps } from '@mui/material'
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../../../lib/interfaces/Form.interface'
import FormButton from '../../../Form/Form.Button'
import IEmployee from '../../../../lib/interfaces/Employee.interface'
import EmployeeService from '../../../../lib/services/Employee.service'

interface EmployeeFormButtonProps {
  type: FormType
  initialValues?: IEmployee
  onSettled: () => void
  buttonProps?: ButtonProps
}

export const AddEmployeeFormInputs: IFormInputComponentProps[] = [
  {
    name: "employeeId",
    label: "Employee Id",
    type: FormInputTypes.text,
    icon: "description",
    width: 7,
  },
  {
    name: "name",
    label: "Name",
    type: FormInputTypes.text,
    icon: "engineering",
    required: true,
  },
  {
    name: "",
    label: "Overheads",
    type: FormInputTypes.label
  },
  {
    name: "dayRate",
    label: "Rate",
    type: FormInputTypes.currency,
    uom: "per day",
    width: 7,
  },
  {
    name: "travelAllowance",
    label: "Travel Allowance",
    type: FormInputTypes.currency,
    uom: "per month",
    width: 7,
  },
  {
    name: "adminAllowance",
    label: "Admin Management",
    type: FormInputTypes.currency,
    uom: "per month",
    width: 7,
  },
]

export const EmployeeAddButton = ({ type, initialValues, onSettled, buttonProps }: EmployeeFormButtonProps) => {
  const [submitError, setSubmitError] = React.useState<string | undefined>();

  // mutations
  const addEmployee = useMutation<IEmployee, Error, IEmployee>
    (async (props: IEmployee) =>
      EmployeeService.addEmployee(props), {
      onMutate: () => {
        setSubmitError(undefined)
      },
      onError: ((error) => {
        setSubmitError(error.message)
      }),
      onSuccess: () => {
        setSubmitError(undefined)
        onSettled()
      },
    })
  const updateEmployee = useMutation<IEmployee, Error, IEmployee>
    (async (props: IEmployee) =>
      EmployeeService.updateEmployee(props), {
      onMutate: () => {
        setSubmitError(undefined)
      },
      onError: ((error) => {
        setSubmitError(error.message)
      }),
      onSuccess: () => {
        onSettled()
      },
    })

  // main
  return (
		<FormButton
			title="Add employee"
			label="Add employee"
			type={type}
			initialValues={initialValues}
			submitError={submitError}
			setSubmitError={setSubmitError}
			inputs={AddEmployeeFormInputs}
			createFormMutation={addEmployee}
			updateFormMutation={updateEmployee}
			buttonProps={buttonProps}
			maxWidth="xs"
			canClose={() => (submitError === undefined ? true : false)}
		/>
  );
}

export default EmployeeAddButton