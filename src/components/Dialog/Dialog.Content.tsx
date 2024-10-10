import { DialogContent as MUIDialogContent } from "@mui/material"

type DialogTitleProp = {
  children: any
}

export const DialogContent = ({ children }: DialogTitleProp) => {
  return (
    <MUIDialogContent dividers sx={{
      py: 4,
    }}>
      {children}
    </MUIDialogContent>
  )
}