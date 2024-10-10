import React from "react";
import { useMutation, UseMutationResult } from "react-query";
//mui
import { LoadingButton } from "@mui/lab";
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Button, Icon, ListItemIcon, MenuItem, Typography } from "@mui/material";
//components
import { IDeleteEmployeeParams } from "../../../../lib/interfaces/Employee.interface";
import EmployeeService from "../../../../lib/services/Employee.service";

interface Props {
  onSettled: () => void
  employee: {
    _id: string 
    name: string // employee name 
  }
}

export const DeleteEmployeeButton = ({ onSettled, employee }: Props) => {
  // state
  const [open, setOpen] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string | undefined>();

  // mutations
  const deleteEmployee: UseMutationResult<unknown, Error, IDeleteEmployeeParams> = useMutation<unknown, Error, IDeleteEmployeeParams>
    (async ({ _id }) =>
      EmployeeService.deleteEmployee({ _id }), {
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
  const handleSubmit = async () => deleteEmployee.mutate({ _id: employee._id })
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
          Delete employee
        </DialogTitle>
        <DialogContent>
          {submitError && (
            <DialogContentText>
              <Alert severity="error">{submitError}</Alert>
            </DialogContentText>
          )}
          <DialogContentText>
            {`Are you sure you want to delete ${employee.name} ?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          <LoadingButton
            autoFocus
            loading={deleteEmployee.isLoading}
            disabled={deleteEmployee.isLoading}
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