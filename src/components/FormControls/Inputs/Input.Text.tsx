import { Icon, InputAdornment, TextField } from '@mui/material'
import { useField, useForm } from 'react-final-form'
import { IFormInputComponentProps } from '../../../lib/interfaces/Form.interface'

export const InputText = ({ name, label, icon, error, type, required }: IFormInputComponentProps): JSX.Element => {
  const field = useField(name)
  const form = useForm()

  return (
    <TextField
      required={!!required}
      name={name}
      label={label}
      value={field.input.value}
      onChange={(e) => {
        form.change(name, e.target.value)
      }}
      type={type || undefined}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon>{icon}</Icon>
          </InputAdornment>
        ),
      }}
      error={error ? true : false}
      helperText={error}
    />
  )
}