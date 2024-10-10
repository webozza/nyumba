import React from "react";
import { useMutation, UseMutationResult } from "react-query";
//mui
import { LoadingButton } from "@mui/lab";
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Button, Icon, ListItemIcon, MenuItem, Typography } from "@mui/material";
//components
import { IDeleteUserParams } from "../../../../lib/interfaces/User.interface";
import UserService from "../../../../lib/services/User.service";

interface Props {
  onSettled: () => void
  user: {
    _id: string // user id 
    name: string // user name 
  }
}

export const DeleteUserButton = ({ onSettled, user }: Props) => {
  // state
  const [open, setOpen] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string | undefined>();

  // mutations
  const deleteUser: UseMutationResult<unknown, Error, IDeleteUserParams> = useMutation<unknown, Error, IDeleteUserParams>
    (async ({ _id }) =>
      UserService.deleteUser({ _id }), {
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
  const handleSubmit = async () => deleteUser.mutate({ _id: user._id })
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          <Icon fontSize="small" color="error">delete</Icon>
        </ListItemIcon>
        <Typography color="error">Delete</Typography>
      </MenuItem>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          Delete user
        </DialogTitle>
        <DialogContent>
          {submitError && (
            <DialogContentText>
              <Alert severity="error">{submitError}</Alert>
            </DialogContentText>
          )}
          <DialogContentText>
            {`Are you sure you want to delete ${user.name} ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <LoadingButton
            autoFocus
            loading={deleteUser.isLoading}
            disabled={deleteUser.isLoading}
            loadingPosition="start"
            startIcon={<Icon>delete</Icon>}
            color="error"
            onClick={handleSubmit}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}