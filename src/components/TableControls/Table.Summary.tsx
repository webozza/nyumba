import React from 'react';
import { TableBody, TableCell as MUITableCell, TableRow, Typography, Table, TableContainer } from '@mui/material';
import moment from 'moment';
import { CompactTableHeaderItemProps, CompactTableHeaders } from '../Table/Header/Table.Compact.Headers';
import { useSearchParams } from 'react-router-dom';
import { ISummary } from '../../lib/interfaces/Summary.interface';
import { useQuery } from 'react-query';
import SummaryService from '../../lib/services/Summary.service';
import { Loading } from '../Loader/Loading';
import { ErrorPage } from '../../pages/Error.Page';
import { toCurrencyText } from '../../lib/utils/text.utils';

export const SummaryTable = () => {
	const [searchParams] = useSearchParams();
	const date = moment(searchParams.get('date') || new Date());

	// data
	const { data, isLoading, isError } = useQuery<{ rows: ISummary[]; headers: any[] }, Error>(
		[`summary-page-${moment(date).format('YYYY-MM')}`, { month: moment(date).format('MM'), year: moment(date).format('YYYY') }],
		SummaryService.getSummary,
		{ enabled: !!date }
	);

	const headerConfig = React.useMemo(() => {
		if (data) {
			const _headers: CompactTableHeaderItemProps[] = [
				{ title: 'Name', width: '200px', sticky: true },
				{ title: 'Travel', align: 'center', width: '120px' },
				{ title: 'Admin Mgmt', align: 'center', width: '120px' },
			];
			data?.headers &&
				data?.headers?.map((_header) => {
					_headers.push({ title: _header?.value || '', align: 'center', width: '120px' });
				});
			return _headers;
		}

		return [];
	}, [data]);

	if (isLoading) return <Loading />;
	if (isError) return <ErrorPage />;

	return (
		<TableContainer
			sx={{
				width: (theme) => `calc(100vw- ${theme.spacing(8)})`,
				maxHeight: (theme) => `calc(100vh - ${theme.spacing(30)})`,
				overflow: 'auto',
			}}
		>
			<Table stickyHeader>
				<CompactTableHeaders headers={headerConfig} />
				<TableBody>
					{data &&
						data?.rows?.map((summaryItem: any, summaryItemIdx: number) => {
							return (
								<TableRow key={`summary-row-${summaryItem.name}-${summaryItemIdx}`}>
									<TableCellDefault type="text" sticky={true} value={summaryItem.name} />
									<TableCellDefault type="currency" value={summaryItem.travelAllowance || ''} />
									<TableCellDefault type="currency" borderRight={true} value={summaryItem.adminAllowance || ''} />

									{data?.headers?.map((header, headerIdx) => {
										return (
											<TableCellDefault
												key={`summary-cell-${headerIdx}-${header.name}`}
												type="currency"
												value={summaryItem?.[header?.name as string] as string}
												isTotal={headerIdx < data?.headers.length - 7 ? true : false}
											/>
										);
									})}
								</TableRow>
							);
						})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

interface TableCellProps {
	type: 'text' | 'currency';
	value: any;
	sticky?: boolean;
	isTotal?: boolean;
	borderRight?: boolean;
}
export const TableCellDefault = ({ sticky, borderRight, type, value, isTotal }: TableCellProps) => {
	return (
		<MUITableCell
			padding="none"
			align={type === 'currency' ? 'right' : 'left'}
			sx={{
				p: 0.2,
				border: 1,
				borderColor: (theme) => theme.palette.divider,
				borderRight: borderRight ? 2 : 1,
				borderRightColor: (theme) =>
					borderRight ? (theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[600]) : theme.palette.divider,
				position: sticky ? 'sticky' : undefined,
				left: sticky ? 0 : undefined,
				backgroundColor: (theme) => (isTotal ? theme.palette.background.paper : theme.palette.background.default),
			}}
		>
			<Typography
				align={type === 'currency' ? 'right' : 'left'}
				variant="caption"
				sx={{
					px: 1,
					color: (theme) => {
						if (value === undefined) return theme.palette.text.disabled;
						if (type === 'currency' && value === 0) return theme.palette.text.disabled;
						if (type === 'text' && value === '') return theme.palette.text.disabled;
					},
				}}
			>
				{type === 'currency' && value && `R ${toCurrencyText(value)}`}
				{type === 'text' && value}
			</Typography>
		</MUITableCell>
	);
};
