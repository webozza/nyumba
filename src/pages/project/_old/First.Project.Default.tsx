import { Grid, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
// components
import { Loading } from '../../../components/Loader/Loading';
import { FormType } from '../../../lib/interfaces/Form.interface';
import ProjectAddButton from '../../../components/FormControls/Buttons/project/Project.Add.Button';
import ProjectService from '../../../lib/services/Project.service';
import NoteFormButton from '../../../components/FormControls/Buttons/notes/Note.Add.Button';
import { NotesTable } from '../../../components/TableControls/Table.Notes';
import { OldBudgetTable } from '../../../components/TableControls/_old/Table.OldBudget';
import { BudgetTypeEnum } from '../../../lib/interfaces/Budget.interface';
import { DefaultPage } from '../../../components/Page/Page';
import { EmployeeTable } from '../../../components/TableControls/Table.Employees';
import { ErrorPage } from '../../Error.Page';
import { ManagersTable } from '../../../components/TableControls/Table.Managers';
import IProject from '../../../lib/interfaces/Project.interface';
import { toCurrencyText } from '../../../lib/utils/text.utils';

export const DefaultProjectPage = () => {
  const params = useParams();
  const id: string = params.id || ''

  // data
  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => ProjectService.getProject(id),
    enabled: !!id
  });


  const type: string = (data?.type.toString()) || 'No Project type found'
  const managers = (data && data.managers && data.managers.length > 0) ? populateManagers() : 'No managers assigned'

  function populateManagers(): string | undefined {
    return data?.managers?.reduce((prev, manager, i) => {
      return prev + `${manager.name}${(i === data?.managers.length - 1) ? '' : ', '}`
    }, '')
  }

  function capatilzeFirstLetter(word: string): string {
    return `${word.slice(0, 1).toUpperCase() + word.slice(1)}`
  }


  const description = `Type: ${capatilzeFirstLetter(type)} | ${(data && data.managers && data.managers.length > 1) ? "Managers" : "Manager"}: ${managers}`
  if (isLoading) return <Loading />;
  if (isError) return <ErrorPage />;

  return (
    <DefaultPage
      type='tabs'
      title={data?.name ?? 'could not find project '}
      status={(data?.archived) ? "Archived" : "Active"}
      description={description}

      buttons={<>
        {/* <ProjectAddManagerButton initialValues={data?.manager} /> */}
        <ProjectAddButton type={FormType.update} onSettled={() => refetch()} initialValues={data} />

        <NoteFormButton
          type={FormType.new}
          initialValues={{
            parentId: id, // always pass in the id of the table you want to attach to
          }}
          onSettled={() => { refetch() }}
        />
      </>}
      tabs={[
        {
          title: 'BUDGET',
          icon: 'paid',
          component: (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Stack spacing={2} sx={{
                      p: 1,
                      border: theme => `1px solid ${theme.palette.divider}`
                    }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2">Paying out</Typography>
                        <Typography variant="body2"><b>R {toCurrencyText((data?.totals?.budget?.total || 0) - (data?.totals?.expenses?.total || 0))}</b></Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2">Total incl. site mgmt.</Typography>
                        <Typography variant="body2"><b>R 123</b></Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <OldBudgetTable title="Budget" type={BudgetTypeEnum.budget} projectId={id} budgets={data?.budgetItems} refetch={refetch} />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <OldBudgetTable title="Overheads" type={BudgetTypeEnum.expense} projectId={id} budgets={data?.expenseItems} refetch={refetch} />
                </Stack>
              </Grid>
            </Grid>
          )
        },
        {
          title: 'NOTES',
          icon: 'comment',
          component: <NotesTable notes={data?.notes || []} />
        },
        {
          title: 'Time sheets',
          icon: 'people',
          component: <EmployeeTable employees={data?.employees} refetchEmployees={refetch} />
        },
        {
          title: 'Managers',
          icon: 'engineering',
          component: <ManagersTable project={data || {} as IProject} refetch={refetch} />
        }
      ]}
    />
  )
}

