import React from 'react'
import { useMutation } from "react-query"
//mui
import { ButtonProps } from '@mui/material'
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../../../lib/interfaces/Form.interface'
import FormButton from '../../../Form/Form.Button'
import IProject from '../../../../lib/interfaces/Project.interface'
import ProjectService from '../../../../lib/services/Project.service'

interface ProjectFormButtonProps {
  type: FormType
  initialValues?: {
    projectId: string
  }
  onSettled: () => void
  buttonProps?: ButtonProps
}

export const ProjectAddManagerButton = ({ type, initialValues, onSettled, buttonProps }: ProjectFormButtonProps) => {
  const [submitError, setSubmitError] = React.useState<string | undefined>();


  //> mutations
  const addManager = useMutation<any, Error, IProject>
    (async (props: any) =>
      ProjectService.addManager(props), {
      onMutate: (data) => {
        setSubmitError(undefined)
      },
      onError: ((error) => {
        setSubmitError(error.message)
      }),
      onSuccess: () => {
        onSettled && onSettled()
      },
    })

  const updateProject = useMutation<IProject, Error, IProject>
    (async (props: IProject) =>
      ProjectService.updateProject(props), {
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

  //> form inputs
  const FormInputs: IFormInputComponentProps[] = [
    {
      name: "managerId", //db field
      label: "Name",
      type: FormInputTypes.employee,
      icon: "engineering",
      required: true,
    }]

  //> main
  return (
    <FormButton
      label="Manager"
      title="Manager"
      type={type}
      initialValues={initialValues}
      submitError={submitError}
      setSubmitError={setSubmitError}
      inputs={FormInputs}
      createFormMutation={addManager}
      updateFormMutation={updateProject}
      buttonProps={buttonProps}
      canClose={() => submitError === undefined ? true : false}
    />
  )
}