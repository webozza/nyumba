import React from "react";
// mui
import {
  TableBody,
  TableRow,
  TableCell as MUITableCell,
  TableContainer,
  Stack,
  Icon,
  Typography,
} from "@mui/material";
// components
import { CompactTable } from "../Table/CompactTable";
import {
  BudgetTypeEnumV2,
  IBudgetItemV2,
  IBudgetV2,
} from "../../lib/interfaces/Budget.interface";
import { toCurrencyText, toNumber } from "../../lib/utils/text.utils";
import moment from "moment";
import { useSearchParams } from "react-router-dom";

type Props = {
  budgets: IBudgetV2[];
  budgetItems: IBudgetItemV2[] | undefined;
};

export const ProjectBudgetSummaryTable = ({ budgets, budgetItems }: Props) => {
  const [searchParams] = useSearchParams();
  const date = moment(searchParams.get("date") || new Date());

  function totalCompletionPercenatge() {
    let counter = 0;
    let totalPercentage = 0;

    budgets.forEach((budget)=>{
      const filteredBudgetItems = budget.budgetItems 
      ?.filter(
        (item: IBudgetItemV2) => item.type === BudgetTypeEnumV2.budget && item.description !== ""
      )   
      counter += filteredBudgetItems?.length || 0;

      totalPercentage += filteredBudgetItems?.reduce((acc, curr) => acc + (curr.completedPercentage || 0), 0) || 0;
    });
    
    return totalPercentage/counter;
  }

  if (!budgets || budgets.length === 0) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ p: 1, color: "text.secondary" }}
      >
        <Icon fontSize="large">search</Icon>
        <Typography variant="body2">No budgets found</Typography>
        <Typography variant="body2">
          Start by adding a new budget for this project
        </Typography>
        {/* <TimesheetAddBlankTableButton
					initialValues={{
						projectId,
						type: TimesheetTypeEnumV2.erection,
						date: new Date(),
						qty: 0,
					}}
					type={FormType.new}
					onSettled={() => {
						refetch();
					}}
				/> */}
      </Stack>
    );
  }

  return (
    <TableContainer
      sx={{
        border: 0,
        borderTopRadius: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        "& .MuiTableCell-root": {
          fontSize: "0.9rem",
          border: (theme) => `0.5px solid ${theme.palette.divider}`,
          p: 1,
          verticalAlign: "bottom",
        },
        // '& td:nth-child(n)': {
        // 	borderLeft: 0,
        // },
        "& td:last-child": {
          borderRight: 0,
        },
        "& tr:last-child > td": {
          borderBottom: 0,
        },
      }}
    >
      <CompactTable>
        <TableBody>
          <TableRow>
            <MUITableCell
              rowSpan={2}
              sx={{ backgroundColor: "background.default" }}
            >
              <b>Description</b>
            </MUITableCell>

            <MUITableCell
              rowSpan={2}
              sx={{ backgroundColor: "background.default" }}
            />
          </TableRow>

          <TableRow>
            <React.Fragment key={`summary-header-main`}>
              <MUITableCell
                align="center"
                sx={{ backgroundColor: "background.default" }}
              >
                <b>Amount</b>
              </MUITableCell>
              <MUITableCell
                align="center"
                sx={{ backgroundColor: "background.default" }}
              >
                <b>Completed</b>
              </MUITableCell>
              <MUITableCell
                align="center"
                sx={{ backgroundColor: "background.default" }}
              >
                <b>Invoice</b>
              </MUITableCell>
              <MUITableCell
                align="center"
                sx={{ backgroundColor: "background.default" }}
              >
                <b>Balance</b>
              </MUITableCell>
              <MUITableCell
                rowSpan={2}
                sx={{ backgroundColor: "background.default" }}
              />
            </React.Fragment>
          </TableRow>
        </TableBody>
        <TableBody key={`table`}>
          {budgets.map((budget) => {
            // Initialize values
            budget.totalAmount = 0;
            budget.totalInvoice = 0;
            budget.averageCount = 0;

            // Map budgetItems to rows
            const budgetItemRows = budget.budgetItems
              ?.filter(
                (item: IBudgetItemV2) => item.type === BudgetTypeEnumV2.budget
              )
              .map((budgetItem: IBudgetItemV2) => {
                if (budgetItem?.description) {
                  let amount = 0;
                  if (budgetItem.ratePerM2 && budgetItem.m2) {
                    amount = budgetItem.ratePerM2 * budgetItem.m2;
                  }

                  let balanceAmount = 0;
                  let invoiceAmount = 0;

                  if (
                    budget.totalAmount !== undefined &&
                    budget.totalInvoice !== undefined &&
                    budget.averageCount !== undefined
                  ) {
                    invoiceAmount =
                      Number(amount) /
                      (100 / Number(budgetItem?.completedPercentage || 0));
                    balanceAmount = (amount || 0) - invoiceAmount;

                    budget.totalAmount += amount;
                    budget.totalInvoice += invoiceAmount;
                    budget.averageCount += Number(
                      budgetItem?.completedPercentage || 0
                    );
                  }

                  return (
                    <TableRow key={budgetItem._id}>
                      <MUITableCell>{budgetItem?.description}</MUITableCell>
                      <MUITableCell
                        sx={{ backgroundColor: "background.default" }}
                      />
                      <MUITableCell align="center">
                        R {toCurrencyText(amount || 0)}
                      </MUITableCell>
                      <MUITableCell align="center">
                        {budgetItem.completedPercentage || 0} %
                      </MUITableCell>
                      <MUITableCell align="center">
                        R {toCurrencyText(invoiceAmount)}
                      </MUITableCell>
                      <MUITableCell align="center">
                        R {toCurrencyText(balanceAmount)}
                      </MUITableCell>
                      <MUITableCell
                        sx={{ backgroundColor: "background.default" }}
                      />
                    </TableRow>
                  );
                }
                return null;
              });

            return <>{budgetItemRows}</>;
          })}

          {/* //- TOTALS */}
          <TableRow>
            <MUITableCell sx={{ backgroundColor: "background.default" }} />
            <MUITableCell sx={{ backgroundColor: "background.default" }} />

            <>
              <MUITableCell
                align="center"
                sx={{ backgroundColor: "background.default" }}
              >
                <b>{`R ${toCurrencyText(budgets.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0))}`}</b>
              </MUITableCell>

              <MUITableCell
                align="center"
                sx={{ backgroundColor: "background.default" }}
              >
                <b>{`${toCurrencyText(toNumber(totalCompletionPercenatge()))} %`}</b>
              </MUITableCell>

              <MUITableCell
                align="center"
                sx={{ backgroundColor: "background.default" }}
              >
                <b>R {`${toCurrencyText(toNumber(budgets.reduce((acc, curr) => acc + (curr.totalInvoice || 0), 0)))}`}</b>
              </MUITableCell>

              <MUITableCell
                align="center"
                sx={{ backgroundColor: "background.default" }}
              >
                <b>R {`${toCurrencyText(toNumber((budgets.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0))-(budgets.reduce((acc, curr) => acc + (curr.totalInvoice || 0), 0))))}`}</b>
              </MUITableCell>

              <MUITableCell sx={{ backgroundColor: "background.default" }} />
            </>
          </TableRow>
        </TableBody>
      </CompactTable>
    </TableContainer>
  );
};
