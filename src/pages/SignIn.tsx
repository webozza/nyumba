import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, UseMutationResult } from "react-query"
import { Form } from 'react-final-form'
//mui
import { Avatar, Box, Container, Link, Typography } from '@mui/material'
import { Alert, Grid, Icon } from '@mui/material'
import { LoadingButton } from '@mui/lab'
//components
import ILoginParams, { ILoginResponse } from '../lib/interfaces/Login.interface'
import Validations from '../lib/validations/input.validations'
import AuthService from '../lib/services/Auth.service'
import { InputText } from '../components/FormControls/Inputs/Input.Text'
import { InputSigninPassword } from '../components/FormControls/Inputs/Input.Password.Signin'
import { FormInputTypes } from '../lib/interfaces/Form.interface'


export const SignInPage = () => {
  const navigate = useNavigate()
  // state
  const [error, setError] = React.useState<string | undefined>(undefined);

  // mutations
  const login: UseMutationResult<ILoginResponse, Error, ILoginParams> = useMutation<ILoginResponse, Error, ILoginParams>
    (async ({ email, password }) =>
      await AuthService.login({ email, password }), {
      onMutate: () => {
        setError(undefined)
      },
      onError: ((err: Error) => {
        setError(err.message)
      }),
      onSuccess: () => {
        setError(undefined)
        navigate("/", {
          replace: true
        })
      },
    })

  // handlers
  const onSubmit = async (values: ILoginParams) => {
    login.mutate({ ...values })
  }

  // main
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        email: '',
        password: '',
      }}
      validate={(values => {
        let errors = {}
        const formValues = values
        if (formValues.email && !Validations.isValidEmail(formValues.email)) errors = { ...errors, email: "Invalid email address." }
        return errors
      })}
      render={({ handleSubmit, submitting, pristine, errors }) => (
        <form onSubmit={handleSubmit}>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '90vh'
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'transparent', width: 125, height: 70 }}>
                <img alt="logo" src="/logo.png" width={125} height={70} />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>

              <Grid container spacing={2} sx={{
                mt: 0.5
              }}>
                <Grid item xs={12}>
                  <InputText name="email" label="Email" icon="alternate_email" error={errors?.email} required />
                </Grid>
                <Grid item xs={12}>
                  <InputSigninPassword
                    type={FormInputTypes.password}
                    name="password"
                    label="Password"
                    icon="password"
                    error={errors?.password}
                    required
                  />
                </Grid>
                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box sx={{
                    display: "flex",
                    flexDirection: 'column',
                    width: "100%",
                    alignItems: 'center',
                  }}>

                    <LoadingButton
                      type="submit"
                      loading={submitting || login.isLoading}
                      disabled={pristine || submitting}
                      autoFocus
                      loadingPosition="start"
                      variant="contained"
                      startIcon={<Icon>save</Icon>}
                    >
                      Login
                    </LoadingButton>
                  </Box>

                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }} />
              <Copyright />
            </Box>
          </Container>
        </form >
      )
      }
    />
  )
}

export default SignInPage

const Copyright = () => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
    >
      {'Copyright © '}
      <Link color="inherit" href="">
        SpearPoint Software
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}