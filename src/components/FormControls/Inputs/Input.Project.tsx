import React from 'react'
import { useField, useForm } from 'react-final-form'
import { alpha, Autocomplete, createFilterOptions, FilterOptionsState, FormControl, FormHelperText, Icon, InputAdornment, Skeleton, TextField } from '@mui/material'
import { IFormInputComponentProps } from '../../../lib/interfaces/Form.interface'
import IProject from '../../../lib/interfaces/Project.interface'
import { UseQueryResult, useQuery } from 'react-query'
import ProjectService from '../../../lib/services/Project.service'


export const InputProject = ({ name, label, error, required }: IFormInputComponentProps): JSX.Element => {
  const form = useForm()
  const field = useField(name)
  const filter = createFilterOptions<IProject>();
  const [open, setOpen] = React.useState(false);

  const { data, isLoading, isError }: UseQueryResult<IProject[], Error> =
    useQuery<IProject[], Error>(
      'projects',
      ProjectService.getProjects
    )

  const selectedName: IProject | undefined = React.useMemo(() => data?.find((item) => item._id === field.input.value), [data, field])

  if (isLoading) return <Skeleton
    variant="rectangular"
    width='100%'
    sx={{
      borderRadius: 1,
      height: theme => theme.spacing(7),
      backgroundColor: theme => alpha(theme.palette.background.default, 0.2)
    }}
  />

  return (
    <FormControl fullWidth>
      <Autocomplete
        fullWidth
        autoComplete
        autoHighlight
        disabled={isError}
        loading={isLoading}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        options={data || []}
        defaultValue={selectedName}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              label={label}
              required={required || false}
              InputProps={{
                ...params.InputProps,
                startAdornment: <InputAdornment position='start'><Icon>person</Icon></InputAdornment>,
                endAdornment: params.InputProps.endAdornment,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )
        }}
        filterOptions={(options: IProject[], params: FilterOptionsState<IProject>) => {
          const filtered = filter(options, params);
          return filtered;
        }}
        getOptionLabel={(option) => {
          return option.name;
        }}
        onChange={(event, newValue) => {
          form.change(name, newValue?._id || null)
        }}
        renderOption={(props, option) => <li {...props}>{option.name}</li>}
        isOptionEqualToValue={(option, value) => option.name === value.name}
      />
      <FormHelperText>{error ? error : ''}</FormHelperText>
    </FormControl >
  )
}
