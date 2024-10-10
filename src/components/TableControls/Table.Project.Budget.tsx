import {
  Button,
  Icon,
  TableBody,
  TableRow,
  Tooltip,
  Typography,
  TableCell as MUITableCell,
  Box,
  Stack,
} from "@mui/material";
import { useMutation } from "react-query";
import BudgetService, {
  CopyBudgetItemsFromLastMonthProps,
} from "../../lib/services/Budget.service";
import React from "react";
import { CompactTable } from "../Table/CompactTable";
import {
  CompactTableHeaderItemProps,
  CompactTableHeaders,
} from "../Table/Header/Table.Compact.Headers";
import { ErrorSnackbar } from "../Errors/Error.Snackbar";
import { TableCell, TableCellInputType } from "../Table/Cell";
import { CompactTableRow } from "../Table/Row/Table.Compact.Row";
import {
  BudgetTypeEnumV2,
  IBudgetItemV2,
} from "../../lib/interfaces/Budget.interface";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { toCurrencyText, toNumber } from "../../lib/utils/text.utils";

type Props = {
  budgetItems: IBudgetItemV2[] | undefined;
  type: BudgetTypeEnumV2;
  enabledImport: boolean;
  refetch: () => void;
};

export const ProjectBudgetTable = ({
  budgetItems,
  type,
  enabledImport,
  refetch,
}: Props) => {
  const [searchParams] = useSearchParams();
  const date = moment(searchParams.get("date") || new Date());
  const budgetId = searchParams.get("budgetId") || "";
  const [submitError, setSubmitError] = React.useState<string | undefined>();
  const [importing, setImporting] = React.useState<boolean>(false);

  const updateOrCreateBudgetItem = useMutation<
    IBudgetItemV2,
    Error,
    IBudgetItemV2
  >(
    async (props: IBudgetItemV2) =>
      BudgetService.createOrUpdateBudgetItemV2(props),
    {
      onMutate: () => {
        setSubmitError(undefined);
      },
      onError: (error) => {
        setSubmitError(error.message);
      },
      onSuccess: () => {
        refetch();
      },
    }
  );

  const importLastMonth = useMutation<
    CopyBudgetItemsFromLastMonthProps,
    Error,
    any
  >(
    async (props: CopyBudgetItemsFromLastMonthProps) =>
      BudgetService.importBudgetItemsFromLastMonthV2(props),
    {
      onMutate: () => {
        setImporting(true);
        setSubmitError(undefined);
      },
      onError: (error) => {
        setSubmitError(error.message);
      },
      onSettled: () => {
        refetch();
        setImporting(false);
      },
    }
  );

  const handleChange = (
    name: string,
    value: string | number,
    rowIndex: number
  ) => {
    if (budgetItems) {
      const _current = budgetItems.at(rowIndex);
      updateOrCreateBudgetItem.mutate({
        _id: _current?._id || undefined,
        budgetId,
        type,
        month: Number(moment(date).format("MM")),
        year: Number(moment(date).format("YYYY")),
        [name]: value,
      });
    }
  };

  const headers: CompactTableHeaderItemProps[] = [
    { title: "Description", width: "40%" },
    { title: "M2/M/EACH", align: "center", width: "15%" },
    { title: "Rate", align: "center", width: "15%" },
    { title: "Amount", align: "center", width: "15%" },
    { title: "Completed", align: "center", width: "15%" },
  ];

  const total = React.useMemo(() => {
    // calculates total budget
    if (budgetItems) {
      return budgetItems.reduce((acc: number, budgetItem: IBudgetItemV2) => {
        if (
          budgetItem.m2 !== undefined &&
          budgetItem?.ratePerM2 !== undefined
        ) {
          return (acc +=
            Number(budgetItem?.m2) * Number(budgetItem?.ratePerM2));
        } else {
          return (acc += 0);
        }
      }, 0);
    }

    return 0;
  }, [budgetItems]);

  return (
    <CompactTable width="1000px">
      <CompactTableHeaders headers={headers} />
      <TableBody key={`table`}>
        {/* //- items */}
        {budgetItems &&
          budgetItems?.map(
            (budgetItem: IBudgetItemV2, budgetItemIdx: number) => {
              // calculates line item total
              const lineTotal =
                Number(budgetItem?.m2) * Number(budgetItem?.ratePerM2);
              return (
                <CompactTableRow
                  key={`table-row-${type}-${budgetItemIdx}-${budgetItem.budgetId}-${budgetItem._id}-${budgetItem.month}-${budgetItem.year}`}
                  rowIndex={budgetItemIdx}
                  name={type}
                  onChange={handleChange}
                  columns={[
                    {
                      inputType: TableCellInputType.text,
                      name: "description",
                      value: budgetItem?.description || "",
                      align: "center",
                    },
                    {
                      inputType: TableCellInputType.number,
                      name: "m2",
                      value: toNumber(budgetItem?.m2 || 0),
                      align: "center",
                    },
                    {
                      inputType: TableCellInputType.currency,
                      name: "ratePerM2",
                      value: toNumber(budgetItem?.ratePerM2 || 0),
                      align: "center",
                    },
                    {
                      inputType: TableCellInputType.default,
                      name: "amount",
                      value: `R ${toCurrencyText(lineTotal || 0)}`,
                      align: "center",
                    },
                    {
                      inputType: TableCellInputType.number,
                      name: "completedPercentage",
                      value: toNumber(budgetItem?.completedPercentage || 0),
                      align: "center",
                      uom: "%",
                    },
                  ]}
                />
              );
            }
          )}

        {/* //- total and import*/}
        <TableRow>
          <TableCell>
            <Tooltip title="Click to import the 'Description', 'Qty' (m2/each) and 'Rate' from the previous months entries.">
              <div style={{ display: "inline-block" }}>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<Icon fontSize="small">publish</Icon>}
                  disabled={!enabledImport || importing}
                  onClick={() => {
                    importLastMonth.mutate({
                      budgetId,
                      destMonth: date,
                      type: BudgetTypeEnumV2.budget,
                    });
                  }}
                >
                  Import previous month values
                </Button>
              </div>
            </Tooltip>
          </TableCell>
          <TableCell colSpan={headers.length - 3} />
          <CompactTableTotalCell value={`R ${toCurrencyText(total)}`} />
        </TableRow>
      </TableBody>
      <ErrorSnackbar
        submitError={submitError}
        setSubmitError={setSubmitError}
      />
    </CompactTable>
  );
};

type CellProps = {
  value: number | string;
  uom?: TableCellInputType;
};
export const CompactTableTotalCell = ({ value }: CellProps) => {
  return (
    <MUITableCell
      align="center"
      sx={{
        p: 0.5,
        border: 0,
      }}
    >
      <Box
        sx={{
          py: 1,
          borderRadius: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[200],
        }}
      >
        <Typography align="center">
          <b>{value}</b>
        </Typography>
      </Box>
    </MUITableCell>
  );
};

export const CompactTableSubTotalCell = ({ value }: CellProps) => {
  return (
    <MUITableCell
      align="center"
      sx={{
        p: 0.5,
        border: 0,
      }}
    >
      <Stack
        spacing={0}
        sx={{
          py: 1,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[200],
          borderStyle: "solid",
        }}
      >
        <Typography align="center" variant="caption">
          Remaining:
        </Typography>
        <Typography align="center" variant="caption">
          {value}
        </Typography>
      </Stack>
    </MUITableCell>
  );
};
