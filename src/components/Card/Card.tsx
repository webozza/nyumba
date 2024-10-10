import React from 'react';
//mui
import { Box, Collapse, Icon, Stack, Typography, alpha } from '@mui/material/';
//components
import { toCurrencyText } from '../../lib/utils/text.utils';

type CardProps = {
	title?: string;
	value?: number;
	expand?: boolean;
	disabledGutters?: boolean;
	direction?: 'column' | 'column-reverse' | 'row' | 'row-reverse' | undefined;
	component?: JSX.Element | JSX.Element[];
	children: any | any[];
};

export const Card = ({ title, value, direction, expand, disabledGutters, component, children }: CardProps) => {
	const [open, setOpen] = React.useState<boolean>(true);
	return (
		<Stack>
			<Box
				onClick={() => setOpen((prev) => !prev)}
				sx={{
					px: 2,
					py: 1,
					m: 0,
					backgroundColor: (theme) =>
						theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.25) : alpha(theme.palette.primary.main, 0.8),
					borderTopLeftRadius: 5,
					borderTopRightRadius: 5,
					border: (theme) => `1px solid ${theme.palette.divider}`,
					borderBottom: 0,
					'&:hover': {
						cursor: expand ? 'pointer' : undefined,
					},
				}}
			>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Stack direction="row" alignItems="center" spacing={1}>
						{expand && <Icon>{open ? 'expand_less' : 'expand_more'}</Icon>}
						<Typography sx={{ color: 'white' }}>
							<b>{title}</b>
						</Typography>
					</Stack>

					<Box>
						{component && <Box>{component}</Box>}
						{value && (
							<Box>
								<Typography sx={{ color: 'white' }}>R {toCurrencyText(value)}</Typography>
							</Box>
						)}
					</Box>
				</Stack>
			</Box>
			{!expand && (
				<Stack
					spacing={2}
					direction={direction || 'column'}
					sx={{
						p: disabledGutters === true ? 0 : 2,
						backgroundColor: (theme) => (theme.palette.mode === 'dark' ? alpha(theme.palette.grey[200], 0.1) : theme.palette.grey[50]),
						borderBottomLeftRadius: 5,
						borderBottomRightRadius: 5,
						border: (theme) => `1px solid ${theme.palette.divider}`,
						borderTop: 0,
					}}
				>
					{children}
				</Stack>
			)}
			{expand && (
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Stack
						spacing={2}
						direction={direction || 'column'}
						sx={{
							p: disabledGutters === true ? 0 : 2,
							backgroundColor: (theme) =>
								theme.palette.mode === 'dark' ? alpha(theme.palette.grey[200], 0.1) : theme.palette.grey[50],
							borderBottomLeftRadius: 5,
							borderBottomRightRadius: 5,
							border: (theme) => `1px solid ${theme.palette.divider}`,
							borderTop: 0,
						}}
					>
						{children}
					</Stack>
				</Collapse>
			)}
		</Stack>
	);
};
