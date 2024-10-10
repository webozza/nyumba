import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {
  MenuItem as MUIMenuItem,
  AppBar,
  Container,
  Icon,
  IconButton,
  Divider,
  Toolbar,
  Box,
  ListItemIcon,
  Stack,
  Avatar,
  Menu,
  Grid,
  Button,
  alpha,
} from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../lib/context/AppContext';
import { useThemeContext } from '../../lib/context/ThemeContext';
import AuthService from '../../lib/services/Auth.service';

export const drawerWidth = 240;

export const DefaultLayout = () => {
	const navigate = useNavigate();
	const { user, setUser } = useAppContext();
	const { setDarkMode, theme } = useThemeContext();

	// load
	React.useEffect(() => {
		if (!user) {
			const _user = localStorage.getItem('user');
			if (_user) setUser(JSON.parse(_user));
		}
	}, []);

	// state
	const isAdminUser = React.useMemo(() => {
		return user?.roles.includes('Admin');
	}, [user]);

	// handlers
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleThemeMode = () => {
		setDarkMode((prev) => {
			localStorage.setItem('darkMode', prev ? 'false' : 'true');
			return !prev;
		});
	};

	// components
	const userMenuButton = React.useMemo(() => {
		return (
			<Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
				<IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
					<Avatar sx={{ width: 32, height: 32 }}>
						<Icon>person</Icon>
					</Avatar>
				</IconButton>
			</Stack>
		);
	}, []);

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />

			{/* // APPBAR */}
			<AppBar
				variant="outlined"
				elevation={0}
				sx={{
					border: 0,
					position: 'fixed',
					backgroundColor: (theme) => theme.palette.background.paper,
					color: (theme) => theme.palette.getContrastText(theme.palette.background.paper),
				}}
			>
				<Toolbar>
					<Grid container alignItems="center">
						<Grid item xs={2}>
							<Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1, width: '100%' }}>
								<img alt="logo" src="/logo.png" width="100" height="52" />
							</Stack>
						</Grid>

						<Grid item xs={8}>
							<Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
								<MenuItem title="Summary" url="/" icon="dashboard" />
								<Divider flexItem orientation="vertical" />
								<MenuItem id="main-menu" title="Projects" url="/projects" icon="engineering" />
								<MenuItem title="Advances" url="/advances" icon="volunteer_activism" />
								<MenuItem title="Payslips" url="/payslips" icon="receipt_long" />
								<Divider flexItem orientation="vertical" />
								<MenuItem title="Employees" url="/employees" icon="people" />
							</Stack>
						</Grid>

						<Grid item xs={2}>
							<>
								{userMenuButton}

								{/* // profile menu */}
								<Stack direction="row">
									<Menu
										anchorEl={anchorEl}
										id="account-menu"
										open={open}
										onClose={handleClose}
										onClick={handleClose}
										PaperProps={{
											elevation: 0,
											sx: {
												overflow: 'visible',
												filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
												mt: 0,
												'& .MuiAvatar-root': {
													width: 32,
													height: 32,
													ml: -0.5,
													mr: 1,
												},
												'&:before': {
													content: '""',
													display: 'block',
													position: 'absolute',
													top: 0,
													right: 14,
													width: 10,
													height: 10,
													transform: 'translateY(-50%) rotate(45deg)',
													zIndex: 0,
												},
											},
										}}
										transformOrigin={{ horizontal: 'right', vertical: 'top' }}
										anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
									>
										<MUIMenuItem>
											<ListItemIcon>
												<Icon>person</Icon>
											</ListItemIcon>
											{AuthService.getCurrentUser()?.name}
										</MUIMenuItem>

										{isAdminUser && (
											<MUIMenuItem
												onClick={() => {
													handleClose();
													navigate('/settings');
												}}
											>
												<ListItemIcon>
													<Icon>settings</Icon>
												</ListItemIcon>
												Settings
											</MUIMenuItem>
										)}

										<Divider />

										<MUIMenuItem
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
										</MUIMenuItem>

										<Divider />

										<MUIMenuItem
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
										</MUIMenuItem>
									</Menu>
								</Stack>
							</>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>

			{/* // BODY */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					height: '100vh',
					overflow: 'auto',
				}}
			>
				<Toolbar />
				<Box
					sx={{
						position: 'absolute',
						width: '100%',
						p: 0,
						pt: 3,
						m: 0,
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
};

type DefaultBodyProps = {
	children?: React.ReactNode;
};
export const DefaultBody = ({ children }: DefaultBodyProps) => {
	return (
		<Container sx={{ m: 0, p: 0 }} maxWidth={false}>
			{children}
		</Container>
	);
};

type IMenuProps = {
	url: string;
	icon: string;
	title: string;
	id?: string;
};
const MenuItem = ({ url, icon, title, id }: IMenuProps) => {
	const navigate = useNavigate();
	const location = useLocation();

	const active: boolean = location.pathname.split('/')[1].split('?')[0] === url.split('/')[1];

	return (
		<Button
			id={id ? id : undefined}
			color={'primary'}
			variant="text"
			sx={{
				color: (theme) => (active ? theme.palette.primary.dark : theme.palette.text.secondary),
				// fontWeight: active ? 'bold' : 'inherit',
				backgroundColor: (theme) => (active ? alpha(theme.palette.primary.dark, 0.1) : 'none'),
				borderRadius: 2.5,
				border: (theme) => (active ? theme.palette.divider : 'none'),
				px: 4,
			}}
			size={'medium'}
			startIcon={<Icon>{icon}</Icon>}
			onClick={() => navigate(url)}
		>
			{title}
		</Button>
	);
};
