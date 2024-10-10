import { Box, Icon, Paper, Stack, Typography } from '@mui/material'

interface Props {
  title: string
  subtitle: string
  subtitle1?: string
  icon: string
  onClick: () => void
}

export const MobileSiteMenu = ({ title, subtitle, subtitle1, icon, onClick }: Props) => {
  return (
    <Paper sx={{ borderRadius: 5, p: 2 }} onClick={onClick}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Icon>{icon}</Icon>
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="subtitle2" sx={{
              color: theme => theme.palette.text.secondary
            }}>{subtitle}</Typography>
            <Typography variant="subtitle2" sx={{
              color: theme => theme.palette.text.secondary
            }}>{subtitle1}</Typography>
          </Box>
        </Stack>
        <Box><Icon>navigate_next</Icon></Box>
      </Stack>
    </Paper >
  )
}
