import React from 'react'
import { useMutation } from "react-query"
//mui
import { ButtonProps } from '@mui/material'
//components
import { FormInputTypes, FormType, IFormInputComponentProps } from '../../../../lib/interfaces/Form.interface'
import FormButton from '../../../Form/Form.Button'
import INote from '../../../../lib/interfaces/Note.interface'
import NoteService from '../../../../lib/services/Note.service'

interface NoteFormButtonProps {
  type: FormType
  initialValues?: INote
  onSettled: () => void
  buttonProps?: ButtonProps
}

// form inputs
const AddNoteFormInputs: IFormInputComponentProps[] = [
  {
    name: "message",
    label: "Message",
    type: FormInputTypes.multiline,
    icon: "description",
  },
]

export const NoteFormButton = ({ type, initialValues, onSettled, buttonProps }: NoteFormButtonProps) => {
  const [submitError, setSubmitError] = React.useState<string | undefined>();

  // mutations
  const addNote = useMutation<INote, Error, INote>
    (async (props: INote) =>
      NoteService.addNote(props), {
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

  const updateNote = useMutation<INote, Error, INote>
    (async (props: INote) =>
      NoteService.updateNote(props), {
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
      label="Note"
      title="Note"
      type={type}
      initialValues={initialValues}
      submitError={submitError}
      inputs={AddNoteFormInputs}
      createFormMutation={addNote}
      updateFormMutation={updateNote}
      buttonProps={buttonProps}
      setSubmitError={setSubmitError}
      canClose={() => submitError === undefined ? true : false}
    />
  )
}

export default NoteFormButton