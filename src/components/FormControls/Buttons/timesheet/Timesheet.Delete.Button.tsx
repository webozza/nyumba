import React from "react";
import { useMutation } from "react-query";
//components
import TimesheetService from "../../../../lib/services/Timesheet.service";
import { IDeleteTimesheetParams } from "../../../../lib/interfaces/Timesheet.interface";
import { DeleteButton } from "../Delete.Button";

interface Props {
  onSettled: () => void
  timesheet: {
    _id: string
    name: string // timesheet name 
  }
}

export const DeleteTimesheetButton = ({ onSettled, timesheet }: Props) => {
  // state
  const [submitError, setSubmitError] = React.useState<string | undefined>();

  // mutations
  const deleteTimesheet = useMutation<unknown, Error, IDeleteTimesheetParams>
    (async ({ _id }) =>
      TimesheetService.deleteTimesheet({ _id }), {
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
  const handleSubmit = async () => deleteTimesheet.mutate({ _id: timesheet._id })

  return (
    <DeleteButton
      label="Timesheet"
      onSubmit={handleSubmit}
      deleteFormMutation={deleteTimesheet}
      submitError={submitError}
    />
  )
}