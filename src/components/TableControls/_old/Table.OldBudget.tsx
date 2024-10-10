import React from 'react'
import { useMutation } from 'react-query'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  TableFooter,
  Button,
  InputAdornment,
  Alert,
  Stack,
  Typography,
  Checkbox,
  IconButton,
  Icon,
} from '@mui/material'
import BudgetService from '../../../lib/services/Budget.service'
import IBudgetItem, { BudgetTypeEnum, IDeleteBudgetParams } from '../../../lib/interfaces/Budget.interface'
import { NumericFormat } from 'react-number-format'

interface Props {
  title: string
  projectId: string
  type: BudgetTypeEnum
  budgets: IBudgetItem[] | undefined
  refetch: () => void
}


export const OldBudgetTable = ({ title, projectId, budgets, type, refetch }: Props) => {
  const [submitError, setSubmitError] = React.useState<string | undefined>();
  const [selectedId, setSelectedId] = React.useState<string | undefined>();
  const [data, setData] = React.useState<IBudgetItem[]>(budgets || [])

  // data
  const addBudgetItem = useMutation<IBudgetItem, Error, IBudgetItem>
    (async (props: IBudgetItem) =>
      BudgetService.addBudgetItem(props), {
      onMutate: () => {
        setSubmitError(undefined)
      },
      onError: ((error) => {
        setSubmitError(error.message)
      }),
      onSuccess: () => {
        refetch()
      },
    })

  const updateBudgetItem = useMutation<IBudgetItem, Error, IBudgetItem>(async (props: IBudgetItem) => BudgetService.updateBudgetItem(props), {
		onMutate: () => {
			setSubmitError(undefined);
		},
		onError: (error) => {
			setSubmitError(error.message);
		},
		onSuccess: () => {
			refetch();
		},
  });

  const deleteBudgetItem = useMutation<any, Error, any>(async (props: IDeleteBudgetParams) => BudgetService.deleteBudgetItem(props), {
		onMutate: () => {
			setSubmitError(undefined);
		},
		onError: (error) => {
			setSubmitError(error.message);
		},
		onSuccess: () => {
			refetch();
		},
  });

  React.useEffect(() => {
    if (budgets) {
      setData(budgets)
    }
  }, [budgets])

  const total = React.useMemo(() => {
    return data.reduce((acc, obj) => {
      return acc += obj?.amount || 0
    }, 0)
  }, [data])

  // handlers
  const handleChange = (_id: string, name: string, value: any) => {
    updateBudgetItem.mutate({ _id, [name]: value })
  }

  const handleAddRow = () => {
    addBudgetItem.mutate({
      projectId,
      type
    })
  }

  const handleDeleteRow = React.useCallback(() => {
    if (selectedId) {
      deleteBudgetItem.mutate({
        _id: selectedId
      })
    }
  }, [selectedId])


  return (
    <TableContainer component={Paper} variant="outlined">

      {/* // title */}
      <TableTitle title={title} total={total} />
      {/* // table */}
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell padding="none" sx={{ border: 0, width: '10px' }}></TableCell>
            <TableCell padding="none" sx={{ border: 0, pl: 3 }}><b>Description</b></TableCell>
            <TableCell padding="none" align='center' sx={{ border: 0, }}><b>Amount</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* // no data */}
          {(!data || data.length <= 0) && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No data
              </TableCell>
            </TableRow>
          )}

          {/* // data */}
          {data &&
            data.map((budget: IBudgetItem, budgetIdx: number) => (
              <TableRow
                onClick={() => setSelectedId(prev => prev !== budget?._id ? budget?._id : undefined)}
                key={`project-table-row-${budgetIdx}`}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}>
                <TableCell padding="checkbox" sx={{ border: 0 }}>
                  <Checkbox
                    color="primary"
                    checked={selectedId === budget._id}
                  />
                </TableCell>

                <TableCell component="th" scope="row" padding="none" sx={{ border: 0 }}>
                  <TextField
                    fullWidth
                    name="description"
                    size="small"
                    InputProps={{ sx: { borderRadius: 0 } }}
                    inputProps={{ sx: { border: 0, padding: '8px 10px 8px 10px', fontSize: '0.9rem', m: 0 } }}
                    defaultValue={budget.description}
                    onBlur={(e) => {
                      handleChange(budget?._id || '', e.target.name, e.target.value)
                    }}
                  />
                </TableCell>

                <TableCell width="20%" padding="none" sx={{ border: 0 }}>
                  <NumericFormat
                    name="amount"
                    fullWidth
                    customInput={TextField}
                    defaultValue={budget.amount}
                    variant="outlined"
                    size="small"
                    thousandSeparator={true}
                    onBlur={(e) => {
                      handleChange(budget?._id || '', "amount", Number(e.target.value !== undefined ? e.target.value.toString().replaceAll(",", "") : 0))
                    }}
                    InputProps={{ sx: { borderRadius: 0 } }}
                    inputProps={{
                      sx: { textAlign: 'center', border: 0, padding: '8px 10px 8px 10px', fontSize: '0.9rem', m: 0 },
                      startAdornment: (
                        <InputAdornment position="start">
                          R
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* <TextField
                    fullWidth
                    name="amount"
                    size="small"
                    inputProps={{ sx: { textAlign: 'right', border: 0, padding: '8px 10px 8px 10px', fontSize: '0.9rem', m: 0 } }}
                    defaultValue={budget.amount}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          R
                        </InputAdornment>
                      ),
                    }}
                    onBlur={(e) => {
                      handleChange(budget?._id || '', e)
                    }}
                  /> */}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>

        <TableFooter>
          {/* // errors */}
          <TableRow>
            <TableCell colSpan={3}>
              {submitError && (
                <Alert severity="error">{submitError}</Alert>
              )}
            </TableCell>
          </TableRow>
          {/* // actions */}
          <TableRow>
            <TableCell colSpan={2}>
              <IconButton disabled={selectedId === undefined} onClick={handleDeleteRow} color="warning"><Icon>delete</Icon></IconButton>
            </TableCell>
            <TableCell align="right">
              <Button variant="text" onClick={handleAddRow}>Add row</Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer >
  )
}

interface TableTitleProps {
  title: string
  total: number
}

const TableTitle = (props: TableTitleProps) => {
  return (
    <Paper variant="outlined" sx={{
      p: 1,
      px: 2,
      backgroundColor: theme => theme.palette.primary.main,
      color: theme => theme.palette.getContrastText(theme.palette.primary.main),
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      border: 0,
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems='center'>
        <Typography variant="body1"><b>{props.title}</b></Typography>
        <Typography variant="body1"><b>R {props.total}</b></Typography>
      </Stack>
    </Paper>
  )
}
