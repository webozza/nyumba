import { useNavigate } from 'react-router-dom'
import { Box, Icon, Paper, Stack, Typography } from '@mui/material'

interface Props {
  title: string
  subtitle: string
  subtitle1?: string
  icon: string
  toPage?: string | undefined
}

export const TableMainMenuItem = ({ title, subtitle, subtitle1, icon, toPage }: Props) => {
  const navigate = useNavigate()
  return (
    <Paper sx={{ borderRadius: 5, p: 2 }} onClick={() => {
      if (toPage) navigate(toPage)
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Icon>{icon}</Icon>
          <Box>
            <Typography variant="body1">{title}</Typography>
            <Typography variant="body2" sx={{
              color: theme => theme.palette.text.secondary
            }}>{subtitle}</Typography>
            <Typography variant="body2" sx={{
              color: theme => theme.palette.text.secondary
            }}>{subtitle1}</Typography>
          </Box>
        </Stack>
        <Icon sx={{ p: 0, m: 0 }}>navigate_next</Icon>
      </Stack>
    </Paper >
  )
} 
