import React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { DefaultBody } from '../Layouts/Layout.Default';
import { DefaultTabs } from '../Tab/Tabs.Default';

interface ITabs {
	title: string;
	component: any;
	icon?: string; //https://fonts.google.com/icons
}
interface Props {
	type: 'default' | 'tabs';
	title: string;
	status?: string;
	description?: string;
	buttons?: JSX.Element | JSX.Element[];
	tabs?: ITabs[];
	tabOptions?: {
		defaultTabIndex?: string;
		showHistory?: boolean;
		showFilter?: boolean;
		setFilterText?: (filter: string) => void;
	};
	children?: React.ReactNode;
}

export const DefaultPage = ({ type, title, status, description, buttons, tabs, tabOptions, children }: Props) => {
	return (
		<DefaultBody>
			<Stack spacing={2}>
				{/* title */}
				<Paper variant="outlined" sx={{ p: 1, px: 2 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Stack spacing={0}>
							<Stack direction="row" spacing={3} alignItems="center">
								<Typography variant="h5" sx={{ letterSpacing: 1 }}>
									<b>{title}</b>
								</Typography>
								{status && <Chip label={status} color="secondary" size="small" />}
							</Stack>
							<Typography variant="caption">{description}</Typography>
						</Stack>

						<Box>
							<Stack direction="row" spacing={1}>
								{buttons}
							</Stack>
						</Box>
					</Stack>
				</Paper>

				{/* tabs */}
				{type === 'tabs' && tabs && tabs.length > 0 && (
					<Stack
						spacing={1}
						sx={{
							width: '100%',
							p: 0,
						}}
					>
						<Box>{children}</Box>
						<DefaultTabs
							{...tabOptions}
							defaultTabIndex="0"
							tabs={tabs.map((tab) => ({
								title: tab.title,
								hidden: false,
								icon: tab?.icon || '',
								component: tab?.component,
							}))}
						/>
					</Stack>
				)}

				{/* body */}
				{type === 'default' && <Box sx={{ width: '100%', typography: 'body1', p: 1 }}>{children}</Box>}
			</Stack>
		</DefaultBody>
	);
};
