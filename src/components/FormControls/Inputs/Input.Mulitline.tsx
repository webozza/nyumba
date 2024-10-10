import { TextField } from '@mui/material'
import { useField, useForm } from 'react-final-form'
import { IFormInputComponentProps } from '../../../lib/interfaces/Form.interface'

export const InputMultiline = ({ name, label, placeholder, error, type, rows, required, autoFocus, onChange }: IFormInputComponentProps): JSX.Element => {
  const field = useField(name)
  const form = useForm()

  return (
    <TextField
      size="small"
      fullWidth
      multiline
      autoFocus={autoFocus || false}
      required={!!required}
      name={name}
      label={label}
      InputLabelProps={{
        shrink: true
      }}
      value={field.input.value}
      onChange={(e) => {
        if (onChange) onChange(e)
        if (!onChange) form.change(name, e.target.value)
      }}
      type={type || undefined}
      placeholder={placeholder}
      rows={rows || 5}
      error={error ? true : false}
      helperText={error}
    />
  )
}