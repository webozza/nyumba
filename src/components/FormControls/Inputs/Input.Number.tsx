import { FormControl, FormHelperText, Icon, InputAdornment, TextField } from '@mui/material'
import { useField, useForm } from 'react-final-form'
import { IFormInputComponentProps } from '../../../lib/interfaces/Form.interface'
import { NumericFormat } from 'react-number-format'

export const InputNumber = ({ name, label, uom, icon, error, max, required }: IFormInputComponentProps): JSX.Element => {
  const field = useField(name)
  const form = useForm()

  return (
    <FormControl fullWidth>
      <NumericFormat
        fullWidth
        required={!!required}
        name={name}
        label={label}
        customInput={TextField}
        value={field.input.value}
        variant="outlined"
        thousandSeparator={true}
        onValueChange={({ floatValue }) => form.change(name, floatValue)}
        max={max}
        InputLabelProps={{ shrink: true, error: error ? true : false, }}
        inputProps={{
          helperText: error,
          error: error ? true : false,
          size: "small",
          align: "center",
        }}
        InputProps={{
          error: error ? true : false,
          startAdornment: icon && (
            <InputAdornment position="start">
              <Icon>{icon}</Icon>
            </InputAdornment>
          ),
          endAdornment: uom && (
            <InputAdornment position="end">
              {uom}
            </InputAdornment>
          ),
        }}
      />
      <FormHelperText>{error ? error : ''}</FormHelperText>
    </FormControl>
  )
}