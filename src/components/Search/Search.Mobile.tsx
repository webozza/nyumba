import React from 'react'
import { Icon, IconButton, InputBase, Paper } from '@mui/material'

interface Props {
  onSearch: React.ChangeEventHandler
}

export const SearchMobile = ({ onSearch }: Props) => {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 10px', display: 'flex', alignItems: 'center', borderRadius: 10 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
        onChange={onSearch}
      />
      <IconButton type="button">
        <Icon>search</Icon>
      </IconButton>
    </Paper>
  )
}
