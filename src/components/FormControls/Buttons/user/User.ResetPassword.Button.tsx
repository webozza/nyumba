import React from 'react'
import { useMutation, UseMutationResult } from "react-query"
import { Form } from 'react-final-form'
//mui
import { ListItemIcon, MenuItem, Typography } from '@mui/material'
import { Alert, Button, Grid, Icon } from '@mui/material'
import { Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from '@mui/material'
import { LoadingButton } from '@mui/lab'
//components
import IUser, { IUpdateUserPasswordParams } from '../../../../lib/interfaces/User.interface'
import UserService from '../../../../lib/services/User.service'
import { InputPassword } from '../../Inputs/Input.Password'

interface Props {
  onSettled: () => void
  initialValues?: IUpdateUserPasswordParams // user id 
}

export const ResetPasswordButton = ({ initialValues, onSettled }: Props) => {
  // state
  const [open, setOpen] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string | undefined>();

  // mutations
  const updateUserPassword: UseMutationResult<IUser, Error, IUpdateUserPasswordParams> = useMutation<IUser, Error, IUpdateUserPasswordParams>
    (async ({ _id, password }) =>
      UserService.resetPassword({ _id, password }), {
      onMutate: () => {
        setSubmitError(undefined)
      },
      onError: ((error) => {
        setSubmitError(error.message)
      }),
      onSuccess: () => {
        setOpen(false)
        onSettled()
      },
    })

  // handlers
  // prevents the modal from closing when Tab is presed to move to next input element
  const stopPropagationForTab = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Tab") {
      event.stopPropagation();
    }
  };
  const onSubmit = async (values: IUpdateUserPasswordParams) => {
    updateUserPassword.mutate(values)
  }
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // main
  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          <Icon fontSize="small">password</Icon>
        </ListItemIcon>
        <Typography>Reset password</Typography>
      </MenuItem>

      <Dialog open={open} onClose={handleClose} onKeyDown={stopPropagationForTab}>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            ...initialValues
          }}
          validate={(values => {
            let errors = {}
            const formValues = values
            if (formValues.password && formValues.confirmPassword && formValues.password !== formValues.confirmPassword) errors = { ...errors, confirmPassword: "Paswords do not match." }
            if (formValues.password && formValues.password.length < 6) errors = { ...errors, password: "Password must beminimum 6 characters" }
            return errors
          })}
          render={({ handleSubmit, submitting, pristine, errors }) => (
            <form onSubmit={handleSubmit}>
              {/* // header */}
              <DialogTitle>{`Reset password for ${initialValues?.name}`}</DialogTitle>

              {/* // content */}
              <DialogContent>
                {submitError && (
                  <DialogContentText>
                    <Alert severity="error">{submitError}</Alert>
                  </DialogContentText>
                )}
                <Grid container spacing={2} sx={{
                  mt: 0.5
                }}>
                  <Grid item xs={12}>
                    <InputPassword name="password" label="Password" icon="password" error={errors?.password} required />
                  </Grid>
                  <Grid item xs={12}>
                    <InputPassword name="confirmPassword" label="Confirm password" icon="question_mark" error={errors?.confirmPassword} required />
                  </Grid>
                </Grid>
              </DialogContent>

              {/* // footer */}
              <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
                <LoadingButton
                  type="submit"
                  loading={submitting || updateUserPassword.isLoading}
                  disabled={pristine || submitting}
                  autoFocus
                  loadingPosition="start"
                  startIcon={<Icon>save</Icon>}
                >
                  Submit
                </LoadingButton>
              </DialogActions>
            </form>
          )
          }
        />
      </Dialog>
    </>
  )
}

export default ResetPasswordButton