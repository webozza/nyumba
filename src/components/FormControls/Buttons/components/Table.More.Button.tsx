import React from "react";
import { Icon, IconButton, Menu } from "@mui/material";
import { DeleteProjectButton } from "../project/Project.Delete.Button";

// interface Props {
//   children?: ReactNode
// }

export enum MoreButtonTypeEnum {
  delete_project = 'delete-project',
  delete_payslip = 'delete-payslip'
}

type OrigProps = {
  children?: React.ReactNode
}

type Props = {
  _id: string,
  buttons?: MoreButtonTypeEnum[],
  refetch?: () => void,
}

export const MoreButton = ({ children }: OrigProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Icon>more_vert</Icon>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </Menu>
    </>
  )
}

export const MoreButton2 = ({ _id, buttons, refetch }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    event.preventDefault()
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Icon>more_vert</Icon>
      </IconButton >
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {buttons?.map((button) => {
          switch (button) {
            case 'delete-project': {
              return (
                <DeleteProjectButton
                  key={`button-${_id}`}
                  onSettled={() => refetch && refetch()}
                  onClose={handleClose}
                  project={{
                    _id: _id,
                    name: 'ABC',
                  }}
                />)
            }

            default: {
              throw new Error('Invalid button type')
            }
          }
        })}
      </Menu>
    </>
  )
}