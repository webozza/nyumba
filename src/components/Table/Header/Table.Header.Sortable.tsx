import { TableCell, Typography, Stack, Icon } from '@mui/material';
import { TableHeaderSortProps } from '../AutoTable';

type Props = {
	name: string;
	label: string;
	sortable?: boolean;
	width?: number | string;
	align?: 'center' | 'left' | 'right' | 'inherit' | 'justify' | undefined;
	onSort?: (name: string, direction: 1 | -1) => void;
	currentSort?: TableHeaderSortProps; // holds the current sort direction and field
};

export const TableHeaderItemSortable = ({ name, label, sortable, align, width, currentSort, onSort }: Props) => {
	const sortDirection = currentSort && currentSort?.name === name ? currentSort.direction : 1;
	return (
		<TableCell
			align={align || 'left'}
			width={width || 'auto'}
			sx={{
				py: 2,
				backgroundColor: (theme) => theme.palette.background.default,
			}}
		>
			<Stack direction="row" alignItems="center" justifyContent={align || 'flex-start'} spacing={1}>
				<Typography variant="body2">{label}</Typography>
				{sortable && (
					<Icon
						sx={{
							fontSize: 12,
							transform: `scaleY(${sortDirection})`,
							'&:hover': {
								cursor: 'pointer',
							},
						}}
						onClick={() => {
							if (sortDirection === -1) {
								onSort && onSort(name, 1);
							} else {
								onSort && onSort(name, -1);
							}
						}}
					>
						sort
					</Icon>
				)}
			</Stack>
		</TableCell>
	);
};
