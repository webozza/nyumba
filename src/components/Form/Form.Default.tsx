
import { Form } from 'react-final-form';
//mui
import { Alert, Box, Grid, Icon, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
//components
import { IFormInputComponentProps } from '../../lib/interfaces/Form.interface';
import { Input } from '../FormControls/Inputs';
import { isEmpty } from 'lodash';

interface Props {
  submitError: string | undefined
  inputs: IFormInputComponentProps[]
  updateFormMutation: any

  label?: string
  initialValues?: any
  existing?: any,
  maxWidth?: string | number
}

const DefaultForm = ({
  label,
  submitError,
  initialValues,
  maxWidth,
  inputs,
  updateFormMutation,
}: Props) => {

  //> handlers
  const onSubmit = async (values: any) => {
    await updateFormMutation.mutate(values)
  }

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, pristine, errors }) => (
        <form onSubmit={handleSubmit}>
          {/* //> header */}
          <Box maxWidth={maxWidth}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h6"><b>{label}</b></Typography>
              <LoadingButton
                type="submit"
                variant="outlined"
                color="secondary"
                loading={submitting}
                disabled={pristine || submitting || !isEmpty(errors)}
                autoFocus
                loadingPosition="start"
                startIcon={<Icon>save</Icon>}
              >
                Submit
              </LoadingButton>
            </Stack>
          </Box>

          {/* //> body */}
          <Box maxWidth={maxWidth}>
            <Stack spacing={1}>

              {submitError && (
                <Alert severity="error">{submitError}</Alert>
              )}

              <Grid container spacing={2} sx={{
                mt: 0.5
              }}>
                {/* //> inputs */}
                {inputs?.map((input: IFormInputComponentProps, inputIdx: number) =>
                  <Grid item xs={input.width || 12} key={`input-${input.name}-${inputIdx}`}>
                    <Input
                      {...input}
                      error={errors?.[input.name]}
                    />
                  </Grid>
                )}
              </Grid>
            </Stack>
          </Box>
        </form>
      )}
    />
  )
}

export default DefaultForm