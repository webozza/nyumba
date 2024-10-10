import React from 'react'
import { useMutation, UseMutationResult } from "react-query"
import { Form } from 'react-final-form'
//mui
import { Alert, Button, Grid, Icon, ButtonProps, Fab } from '@mui/material'
import { Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from '@mui/material'
import { LoadingButton } from '@mui/lab'
//components
import IUser, { ICreateUserParams, IUpdateUserParams } from '../../../../lib/interfaces/User.interface'
import Validations from '../../../../lib/validations/input.validations'
import UserService from '../../../../lib/services/User.service'
import { SelectUserRole } from '../../Selects/Select.UserRole'
import { Config } from '../../../../lib/config'
import { InputText } from '../../Inputs/Input.Text'
import { InputPassword } from '../../Inputs/Input.Password'
import { FormType } from '../../../../lib/interfaces/Form.interface'

interface Props {
  type: FormType
  onSettled: () => void

  initialValues?: ICreateUserParams // user id 
  buttonProps?: ButtonProps
}

export const UserFormButton = ({ initialValues, type, buttonProps, onSettled }: Props) => {
  // state
  const [open, setOpen] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string | undefined>();

  // mutations
  const addUser: UseMutationResult<IUser, Error, ICreateUserParams> = useMutation<IUser, Error, ICreateUserParams>
    (async ({ name, email, roles, password, confirmPassword }) =>
      UserService.addUser({ name, email, roles, password, confirmPassword }), {
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
  const updateUser: UseMutationResult<IUser, Error, IUpdateUserParams> = useMutation<IUser, Error, IUpdateUserParams>
    (async ({ _id, name, email, roles }) =>
      UserService.updateUser({ _id, name, email, roles }), {
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
  const onSubmit = async (values: ICreateUserParams | IUpdateUserParams) => {
    // creat new
    if (type === FormType.new) {
      addUser.mutate(values as ICreateUserParams)
    }
    // update existing
    if (type === FormType.update) {
      updateUser.mutate(values as IUpdateUserParams)
    }
  }
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // main
  return (
    <>
      {/* // default buttons */}
      {type === FormType.new && !Config.isMobile && (
        <Button {...buttonProps} variant="outlined" startIcon={<Icon>add</Icon>} onClick={handleOpen}>Add User</Button>
      )}
      {type === FormType.update && !Config.isMobile && (
        <Button {...buttonProps} variant="outlined" startIcon={<Icon>edit</Icon>} onClick={handleOpen}>Edit</Button>
      )}

      {/* // mobile buttons */}
      {type === FormType.new && Config.isMobile && (
        <Fab color="secondary" onClick={handleOpen}
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20
          }}>
          <Icon>add</Icon>
        </Fab>
      )}
      {type === FormType.update && Config.isMobile && (
        <Button {...buttonProps} variant="outlined" startIcon={<Icon>edit</Icon>} onClick={handleOpen}>Edit</Button>
      )}

      {/* // dialog */}
      <Dialog open={open} onClose={handleClose}>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            roles: [],
            ...initialValues
          }}
          validate={(values => {
            let errors = {}
            const formValues = values as ICreateUserParams

            if (formValues.email && !Validations.isValidEmail(formValues.email)) errors = { ...errors, email: "Invalid email address." }
            if (formValues.password && formValues.confirmPassword && formValues.password !== formValues.confirmPassword) errors = { ...errors, confirmPassword: "Paswords do not match." }
            if (formValues.password && formValues.password.length < 6) errors = { ...errors, password: "Password must beminimum 6 characters" }
            return errors
          })}
          render={({ handleSubmit, submitting, pristine, errors }) => (
            <form onSubmit={handleSubmit}>
              <DialogTitle>{type === FormType.new ? 'Add new user' : 'Edit user'}</DialogTitle>
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
                    <InputText name="name" label="Fullname" icon="person" error={errors?.name} required />
                  </Grid>
                  <Grid item xs={12}>
                    <InputText name="email" label="Email" icon="alternate_email" error={errors?.email} required />
                  </Grid>

                  <Grid item xs={12}>
                    <SelectUserRole />
                  </Grid>

                  {type === FormType.new && (
                    <>
                      <Grid item xs={12}>
                        <InputPassword name="password" label="Password" icon="password" error={errors?.password} required />
                      </Grid>
                      <Grid item xs={12}>
                        <InputPassword name="confirmPassword" label="Confirm password" icon="question_mark" error={errors?.confirmPassword} required />
                      </Grid>
                    </>
                  )}
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
                <LoadingButton
                  type="submit"
                  loading={submitting}
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

export default UserFormButton