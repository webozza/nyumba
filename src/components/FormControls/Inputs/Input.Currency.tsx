import { NumericFormat } from 'react-number-format'
import { useField, useForm } from 'react-final-form'
import { FormControl, FormHelperText, InputAdornment, TextField } from '@mui/material'
import { IFormInputComponentProps } from '../../../lib/interfaces/Form.interface'

export const InputCurrency = ({ name, label, uom, error, required, max }: IFormInputComponentProps): JSX.Element => {
  const field = useField(name)
  const form = useForm()

  return (
    <FormControl fullWidth>
      <NumericFormat
        required={!!required}
        name={name}
        label={label}
        fullWidth
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
          size: "small"
        }}
        InputProps={{
          error: error ? true : false,
          startAdornment: (
            <InputAdornment position="start">
              R
            </InputAdornment>
          ),
          endAdornment: uom && (
            <InputAdornment position="end">
              {uom}
            </InputAdornment>
          ),
        }}
      />
      <FormHelperText >{error}</FormHelperText>
    </FormControl>
  )
}