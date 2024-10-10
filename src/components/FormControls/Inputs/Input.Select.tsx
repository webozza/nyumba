import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useField, useForm } from 'react-final-form'
import { IFormInputComponentProps } from '../../../lib/interfaces/Form.interface'
import { toProperCase } from '../../../lib/utils/text.utils'

export const InputSelect = ({ name, label, error, options, required }: IFormInputComponentProps): JSX.Element => {
  const field = useField(name)
  const form = useForm()

  return (
    <FormControl fullWidth>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        notched
        required={!!required}
        name={name}
        label={label}
        value={field.input.value}
        error={error ? true : false}
        onChange={(e) => {
          form.change(name, e.target.value)
        }}
      >
        {options && options.map((option) =>
          <MenuItem value={option}>{toProperCase(option)}</MenuItem>
        )}
      </Select>

      <FormHelperText>{error ? error : ''}</FormHelperText>
    </FormControl>
  )
}