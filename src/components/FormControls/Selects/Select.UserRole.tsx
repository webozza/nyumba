import React from "react";
import { useField, useForm } from "react-final-form";
import { Box, Chip, FormControl, Icon, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";

const ROLES: Array<string> = ['Site', 'Accounting', "Admin"]

export const SelectUserRole = () => {
  const field = useField('roles')
  const form = useForm()

  const [roles, setRoles] = React.useState<string[]>(field && field.input.value as []); // contains the selected user roles

  const handleRolesChange = (event: SelectChangeEvent<typeof roles>) => {
    const { value } = event.target;
    const _role = typeof value === 'string' ? value.split(',') : value
    // set roles state
    setRoles(_role);
    form.change('roles', _role)
  };

  return (
    <FormControl fullWidth required>
      <InputLabel shrink>Roles</InputLabel>
      <Select
        label='Roles'
        multiple
        value={roles}
        defaultChecked={field.input.value}
        onChange={handleRolesChange}
        input={<OutlinedInput notched label="Role" />}  // always add notched else label shrinks all funny
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            <Icon sx={{
              opacity: 0.6
            }}>admin_panel_settings</Icon>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
              width: 250,
            },
          },
        }}
      >
        {ROLES.map((role: string) => (
          <MenuItem key={role} value={role}>
            <ListItemText primary={role} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}