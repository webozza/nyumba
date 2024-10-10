import React from 'react';
import { Avatar, Box, Container, Dialog, Divider, Icon, IconButton, List, ListItem, ListItemIcon } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { Config } from '../../lib/config';
import AuthService from '../../lib/services/Auth.service';
import { useThemeContext } from '../../lib/context/ThemeContext';

export const MobileLayout = () => {
	const navigate = useNavigate();
	const { setDarkMode, theme } = useThemeContext();
	const [open, setOpen] = React.useState<boolean>(false);

	const handleClick = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleThemeMode = () => {
		setDarkMode((prev) => {
			localStorage.setItem('darkMode', prev ? 'false' : 'true');
			return !prev;
		});
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<Box
				sx={{
					position: 'absolute',
					top: 7.5,
					right: 15,
					zIndex: 999,
				}}
			>
				<IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
					<Avatar sx={{ width: 32, height: 32 }}>
						<Icon>person</Icon>
					</Avatar>
				</IconButton>
			</Box>
			<Box
				sx={{
					p: 2,
					m: 0,
					flex: 1,
					height: '100vh',
					maxWidth: Config.screenWidth,
					width: Config.screenWidth,
				}}
			>
				<Outlet />
			</Box>

			<Dialog open={open} onClose={handleClose} maxWidth="md">
				<List sx={{ p: 2 }}>
					<ListItem
						onClick={() => {
							handleThemeMode();
						}}
					>
						{theme?.palette?.mode === 'dark' && (
							<>
								<ListItemIcon>
									<Icon>light_mode</Icon>
								</ListItemIcon>
								Light mode
							</>
						)}
						{theme?.palette?.mode === 'light' && (
							<>
								<ListItemIcon>
									<Icon>dark_mode</Icon>
								</ListItemIcon>
								Dark mode
							</>
						)}
					</ListItem>

					<Divider />

					<ListItem
						onClick={() => {
							handleClose();
							AuthService.logout();
							navigate('/sign-in');
						}}
					>
						<ListItemIcon>
							<Icon>logout</Icon>
						</ListItemIcon>
						Logout
					</ListItem>

					<Divider />

					<ListItem
						onClick={() => {
							handleClose();
						}}
					>
						<ListItemIcon>
							<Icon>close</Icon>
						</ListItemIcon>
						Close
					</ListItem>
				</List>
			</Dialog>
		</Box>
	);
};

interface MobileBodyProps {
	children?: React.ReactNode;
}

export const MobileBody = ({ children }: MobileBodyProps) => {
	return (
		<Container
			sx={{
				m: 0,
				p: 0,
				flex: 1,
				'&::before': {
					content: '""',
					display: 'block',
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					maxHeight: '100vh',
					height: '100%',
					opacity: 0.05,
					backgroundImage: "url('https://nyumba.glovebox.co.za/logo.png')",
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundSize: '400px 230px',
				},
			}}
		>
			{children}
		</Container>
	);
};
