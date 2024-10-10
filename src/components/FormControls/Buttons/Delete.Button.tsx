import React from "react";
//mui
import { LoadingButton } from "@mui/lab";
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Button, Icon, ListItemIcon, MenuItem, Typography } from "@mui/material";

interface DeleteTimesheetButtonProps {
  label: string
  deleteFormMutation: any
  onSubmit: () => void
  onClose?: () => void
  submitError: string | undefined
}

export const DeleteButton = ({ label, deleteFormMutation, onSubmit, onClose, submitError }: DeleteTimesheetButtonProps) => {
  // state
  const [open, setOpen] = React.useState<boolean>(false);

  // handlers
  const handleOpen = () => {
    setOpen(true);
    onClose && onClose()
  }
  const handleClose = () => {
    setOpen(false)
    onClose && onClose()
  };

  return (
    <>
      <MenuItem onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleOpen()
      }}>
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
          Delete timesheet
        </DialogTitle>
        <DialogContent>
          {submitError && (
            <DialogContentText>
              <Alert severity="error">{submitError}</Alert>
            </DialogContentText>
          )}
          <DialogContentText>
            {`Are you sure you want to delete ${label.toLocaleLowerCase().trim()}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleClose()
            }}
          >
            Cancel
          </Button>

          <LoadingButton
            autoFocus
            loading={deleteFormMutation.isLoading}
            disabled={deleteFormMutation.isLoading}
            loadingPosition="start"
            startIcon={<Icon>delete</Icon>}
            color="error"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onSubmit()
              setOpen(false)
            }}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog >
    </>
  )
}