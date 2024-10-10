import { TableRow, TableCell as MUITableCell, TableHead, Typography, Stack, Box, alpha } from '@mui/material';

export interface CompactTableHeaderItemProps {
	title: string;
	subtitle?: string;
	sticky?: boolean;
	highlight?: boolean;
	width?: string | number | undefined;
	align?: 'center' | 'left' | 'right' | 'inherit' | 'justify' | undefined;
}
export interface Props {
	headers: CompactTableHeaderItemProps[];
}
export const CompactTableHeaders = ({ headers }: Props) => {
	return (
		<TableHead>
			<TableRow>
				{headers &&
					headers?.map((header: CompactTableHeaderItemProps, itemKey: number) => {
						return (
							<MUITableCell
								key={`table-header-${itemKey}`}
								width={header?.width}
								align={header?.align}
								sx={{
									p: 0,
									border: 0,
									verticalAlign: 'bottom',
									...(header.sticky && {
										zIndex: 999 - itemKey,
										position: 'sticky',
										left: 0,
									}),
									backgroundColor: (theme) =>
										theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50],
								}}
							>
								<Stack
									justifyContent={header.align === 'center' ? 'center' : 'flex-start'}
									alignItems={header.align === 'center' ? 'center' : 'flex-start'}
									sx={{ minWidth: header?.width || undefined, px: 1 }}
								>
									<Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
										{header?.subtitle}
									</Typography>
									<Box
										sx={{
											...(header.highlight && {
												width: '100%',
												zIndex: 999 - itemKey,
												backgroundColor: (theme) =>
													theme.palette.mode === 'dark'
														? alpha(theme.palette.grey[300], 0.5)
														: alpha(theme.palette.grey[800], 0.5),
												borderRadius: 5,
											}),
										}}
									>
										<Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
											<b>{header?.title}</b>
										</Typography>
									</Box>
								</Stack>
							</MUITableCell>
						);
					})}
			</TableRow>
		</TableHead>
	);
};
