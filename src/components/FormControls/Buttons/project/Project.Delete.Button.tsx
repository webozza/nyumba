import React from "react";
import { useMutation } from "react-query";
//components
import ProjectService from "../../../../lib/services/Project.service";
import { IDeleteProjectParams } from "../../../../lib/interfaces/Project.interface";
import { DeleteButton } from "../Delete.Button";

interface Props {
  onSettled: () => void
  onClose?: () => void
  project: {
    _id: string
    name: string // project name 
  }
}

export const DeleteProjectButton = ({ onSettled, onClose, project }: Props) => {
  // state
  const [submitError, setSubmitError] = React.useState<string | undefined>();

  // mutations
  const deleteProject = useMutation<unknown, Error, IDeleteProjectParams>
    (async ({ _id }) =>
      ProjectService.deleteProject({ _id }), {
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

  // handlers
  const handleSubmit = async () => deleteProject.mutate({ _id: project._id })

  return (
    <DeleteButton
      label="Project"
      onSubmit={handleSubmit}
      deleteFormMutation={deleteProject}
      submitError={submitError}
      onClose={onClose}
    />
  )
}