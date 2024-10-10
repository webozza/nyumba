import { Container, Grid, Icon, Paper } from '@mui/material';
// components
import { TreeView } from '@mui/lab';
import { Outlet } from 'react-router-dom';
import { DefaultPage } from '../../components/Page/Page';
import { TreeItem } from '../../components/Tree/Tree.Item';

export const SettingsDefaultPage = () => {
	return (
		<DefaultPage type="default" title="Settings" status="" description="Manage employee's, access and settings">
			<Grid container>
				<Grid item xs={0} md={2.5}>
					<Paper>
						<TreeView
							sx={{ p: 0, m: 0, overflowY: 'auto', height: (theme) => `calc(100vh - ${theme.spacing(30)})` }}
							defaultCollapseIcon={<Icon sx={{ rotate: '90deg' }}>chevron_right</Icon>}
							defaultExpandIcon={<Icon>chevron_right</Icon>}
						>
							<TreeItem nodeId="access_user" url="/settings/user" title="User access" icon="admin_panel_settings" />

							<TreeItem nodeId="settings" title="Advanced" icon="settings">
								<TreeItem nodeId="settings_email" url="/settings/email" title="Email settings" icon="email" disabled={true} />
								<TreeItem
									nodeId="settings_storage"
									url="/settings/storage"
									title="Storage management"
									icon="folder_open"
									disabled={true}
								/>
							</TreeItem>
						</TreeView>
					</Paper>
				</Grid>

				<Grid item xs={12} md={9.5}>
					<Container maxWidth={false}>
						<Outlet />
					</Container>
				</Grid>
			</Grid>
		</DefaultPage>
	);
};
