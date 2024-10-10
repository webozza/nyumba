import React from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import { Box, Stack, Typography } from '@mui/material'
// components
import { MobileBody } from '../../../components/Layouts/Layout.Mobile'
import { Loading } from '../../../components/Loader/Loading'
import { TableMainMenuItem } from '../../../components/Menu/TableMenu.Mobile'
import { SearchMobile } from '../../../components/Search/Search.Mobile'
import IProject from '../../../lib/interfaces/Project.interface'
import ProjectService from '../../../lib/services/Project.service'
import ProjectAddButton from '../../../components/FormControls/Buttons/project/Project.Add.Button'
import { FormType } from '../../../lib/interfaces/Form.interface'
import { ErrorPage } from '../../Error.Page'

export const MobileProjectsPage = (): JSX.Element => {
	const [searchFilter, setSearchFilter] = React.useState<string>();
	const { data, refetch, isLoading, isError }: UseQueryResult<IProject[], Error> = useQuery<IProject[], Error>('users', ProjectService.getProjects);

	if (isLoading) return <Loading />;
	if (isError) return <ErrorPage />;

	const handleSearch: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setSearchFilter(e.target.value);
	};

	return (
		<MobileBody>
			<Box sx={{ mb: 2 }}>
				<SearchMobile onSearch={handleSearch} />
			</Box>

			<Stack spacing={3}>
				{/* no data without search*/}
				{(!data || (data.length <= 0 && !searchFilter)) && <Typography align="center">No data</Typography>}

				{/* data */}
				{data &&
					data
						.filter((val) => (searchFilter ? val.name.toLowerCase().includes(searchFilter.toLowerCase() as string) : true))
						.map((user) => {
							return (
								<TableMainMenuItem
									key={user._id}
									title={user.name}
									subtitle={user?.description ? user?.description?.toString().toLowerCase() : ''}
									subtitle1={user.type.toString()}
									icon="constuction"
								/>
							);
						})}
			</Stack>

			<ProjectAddButton type={FormType.new} onSettled={() => refetch()} />
		</MobileBody>
	);
};
