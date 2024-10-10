import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { DefaultPage } from "../../components/Page/Page";
import { TitleBar } from "../../components/Title/Title.Default";
import {
  AutoTable,
  TableRowsTypesEnum,
} from "../../components/Table/AutoTable";
import { Loading } from "../../components/Loader/Loading";
import { ErrorPage } from "../Error.Page";
import { useMutation, useQuery } from "react-query";
import IEmployee from "../../lib/interfaces/Employee.interface";
import EmployeeService from "../../lib/services/Employee.service";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { ErrorSnackbar } from "../../components/Errors/Error.Snackbar";
import { PrintPayslipButton } from "../../components/FormControls/Buttons/payslip/Payslip.Print.Button";
import { toCurrencyText } from "../../lib/utils/text.utils";
import { DownloadPayslipButton } from "../../components/FormControls/Buttons/payslip/Payslip.Download.Button";
import { DownloadAllPayslipsButton } from "../../components/FormControls/Buttons/payslip/Payslip.DownloadAll.Button";
import { IPrintPayslipProps } from "../../lib/interfaces/Payslip.interface";
import PayslipService from "../../lib/services/Payslip.service";

export const DefaultPayslipsPage = (): JSX.Element => {
  const [params, setParams] = useSearchParams();
  const date = params.get("date");
  const month = moment(date).month() + 1;
  const year = moment(date).year();
  const [filter, setFilter] = React.useState<string>("");
  const [submitError, setSubmitError] = React.useState<string | undefined>();
  const [payslipData, setPayslipData] = React.useState<Map<string, any>>(
    new Map()
  );
  const [employees, setEmployees] = React.useState<IEmployee[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const getPayslipJSON = useMutation<any, Error, any>(
    async (props: IPrintPayslipProps) => PayslipService.getPayslipJSON(props),
    {
      onSuccess: (responseData: any) => {
        console.log(responseData);
      },
    }
  );

  // Load employees data once
  const loadEmployees = async () => {
    try {
      const data = await EmployeeService.getEmployeesV2();
      setEmployees(data);
      // Load payslip data based on employees data
      for (const employee of data) {
        const result = await getPayslipJSON.mutateAsync({
          employeeId: employee._id,
          month: month,
          year: year,
        });
        setPayslipData((prev) => new Map(prev).set(employee._id, result));
      }
    } catch (err:any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (date) {
      loadEmployees();
    }
  }, [date]);


  if (!date) {
    setParams({ date: moment().format("YYYY-MM-DD") });
  } else if (!employees) {
    // If there's a date and employees data hasn't been loaded yet
    loadEmployees();
  }

  const { data, isLoading, isError } = useQuery<IEmployee[], Error>(
    ["employees"],
    EmployeeService.getEmployeesV2
  );

  // filters by search terms
  const filtered = React.useMemo(() => {
    if (data && filter) {
      return data.filter((employee) =>
        employee.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return data;
  }, [data, filter]);

  // returns the table rows
  const rows = React.useMemo(() => {
    return filtered?.map((employee) => {
      const employeePayslip = payslipData.get(employee._id) || {};
      return {
        _id: employee._id,
        columns: [
          {
            type: TableRowsTypesEnum.string,
            name: "name",
            value: employee.name,
          },
          {
            type: TableRowsTypesEnum.number,
            name: "openingBalance",
            value: employeePayslip.openingBalance || 0,
            component: (
              <Typography variant="body2">
                R {toCurrencyText(employeePayslip.openingBalance || 0)}
              </Typography>
            ),
          },
          {
            type: TableRowsTypesEnum.number,
            name: "totalEarnings",
            value: employeePayslip.totalEarnings || 0,
            component: (
              <Typography variant="body2">
                R {toCurrencyText(employeePayslip.totalEarnings || 0)}
              </Typography>
            ),
          },
          {
            type: TableRowsTypesEnum.number,
            name: "totalAdvances",
            value: employeePayslip.totalAdvances || 0,
            component: (
              <Typography variant="body2">
                R {toCurrencyText(employeePayslip.totalAdvances || 0)}
              </Typography>
            ),
          },
          {
            type: TableRowsTypesEnum.number,
            name: "totalPaidToBank",
            value: employeePayslip.totalPaidToBank || 0,
            component: (
              <Typography variant="body2">
                R {toCurrencyText(employeePayslip.totalPaidToBank || 0)}
              </Typography>
            ),
          },
          {
            type: TableRowsTypesEnum.number,
            name: "closingBalance",
            value:
              (employeePayslip.totalEarnings || 0) -
              (employeePayslip.totalPaidToBank || 0),
            component: (
              <Typography variant="body2">
                R{" "}
                {toCurrencyText(
                  (employeePayslip.totalEarnings || 0) -
                    (employeePayslip.totalPaidToBank || 0)
                )}
              </Typography>
            ),
          },
          {
            component: (
              <Stack direction="row">
                <DownloadPayslipButton employeeId={employee._id} />
                <PrintPayslipButton employeeId={employee._id} />
              </Stack>
            ),
          },
        ],
      };
    });
  }, [filtered, payslipData]);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorPage />;

  return (
    <DefaultPage
      type="default"
      title="Payslips"
      status=""
      description="Print payslips for employee or by month"
      buttons={
        <>
          <DownloadAllPayslipsButton />
        </>
      }
    >
      <Box>
        <TitleBar
          title="Filter on employee name"
          setFilterText={setFilter}
          options={{ showFilter: true, showCalendar: true }}
        />

        <AutoTable
          options={{
            width: "60%",
            size: "small",
            compact: true,
            canDelete: false,
            expand: false,
          }}
          headers={[
            { name: "name", label: "Name", sortable: true },
            {
              name: "openingBalance",
              label: "Opening Balance",
              sortable: true,
            },
            { name: "totalEarnings", label: "Total Earnings", sortable: true },
            { name: "totalAdvances", label: "Total Advances", sortable: true },
            { name: "totalPaidToBank", label: "Paid to Bank", sortable: true },
            {
              name: "closingBalance",
              label: "Balance Carried Forward",
              sortable: true,
            },
            { name: "Actions", label: "", sortable: false },
          ]}
          rows={rows}
          data={filtered}
        />
      </Box>

      <ErrorSnackbar
        submitError={submitError}
        setSubmitError={setSubmitError}
      />
    </DefaultPage>
  );
};
