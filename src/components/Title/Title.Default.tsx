import * as React from "react";
import moment, { Moment } from "moment";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { UseDateFieldProps } from "@mui/x-date-pickers/DateField";
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from "@mui/x-date-pickers";
import {
  Box,
  Chip,
  Divider,
  Icon,
  IconButton,
  InputBase,
  Paper,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";

interface Props {
  title?: string;
  options?: {
    showCalendar?: boolean;
    showFilter?: boolean; //used with setFilterText
    showDateButtons?: boolean; //shows a list of selected dates.
    dateButtonValues?: string[];
  };
  setFilterText?: (filter: string) => void;
}

export const TitleBar = ({ title, options, setFilterText }: Props) => {
  const [params, setParams] = useSearchParams();
  const date = moment(params.get("date") || new Date());

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      {options?.showFilter === true && (
        <FilterResults setFilterText={setFilterText} title={title || ""} />
      )}

      {options?.showDateButtons && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ pr: 2 }}
        >
          {options.dateButtonValues &&
            options.dateButtonValues?.map((value, index) => {
              return (
                <Chip
                  key={`date-select-${index}-${value}`}
                  label={moment(value).format(`MMMM 'YY`)}
                  onClick={() =>
                    setParams({
                      budgetId: params.get("budgetId") || "",
                      date: moment(value).format("YYYY-MM-DD"),
                    })
                  }
                  color={
                    moment(value).format("YYYY-MM") === date.format("YYYY-MM")
                      ? "primary"
                      : "default"
                  }
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                />
              );
            })}
        </Stack>
      )}

      {options?.showFilter && <Divider orientation="vertical" flexItem />}

      {!options?.showCalendar && <div></div>}
      {options?.showCalendar === true && (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ButtonDatePicker
            label={date.format("MMMM YYYY")}
            value={date}
            onChange={(newValue) =>
              newValue &&
              setParams({
                budgetId: params.get("budgetId") || "",
                date: newValue.format("YYYY-MM-DD"),
              })
            }
          />
        </LocalizationProvider>
      )}
      {options?.showCalendar && <></>}
    </Stack>
  );
};

interface ButtonFieldProps
  extends UseDateFieldProps<Moment>,
    BaseSingleInputFieldProps<
      Moment | null,
      Moment,
      FieldSection,
      DateValidationError
    > {
  label?: React.ReactNode; // Allow `label` to accept ReactNode, not just string
  id?: string;
  disabled?: boolean;
  InputProps?: { ref?: React.Ref<any> };
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ButtonField = (props: ButtonFieldProps) => {
  const { setOpen, label, id, disabled, value, InputProps = {} } = props;
  const { ref } = InputProps; // Extract ref from InputProps

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [params, setParams] = useSearchParams();

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        // border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      }}
    >
      {/* title and calendar button */}
      <Button
        id={id}
        variant="text"
        disabled={disabled}
        ref={ref}
        onClick={() => setOpen?.((prev) => !prev)}
        sx={{
          fontSize: "1.4rem",
          color: (theme) => theme.palette.text.primary,
          // textDecoration: 'underline',
          textDecorationLine: "underline",
          textDecorationStyle: "dashed",
          textDecorationThickness: 1,
          textDecorationColor: (theme) => theme.palette.text.disabled,
        }}
      >
        <b>{label}</b>
      </Button>
      <ButtonBackwardForwards value={value} />
    </Stack>
  );
};

const ButtonBackwardForwards = ({
  value,
}: {
  value: moment.Moment | null | undefined;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [params, setParams] = useSearchParams();

  return (
    <>
      {/* back button */}
      <IconButton
        size="small"
        onClick={() => {
          setParams({
            budgetId: params.get("budgetId") || "",
            date: moment(value).subtract(1, "month").format("YYYY-MM-DD"),
          });
        }}
      >
        <Icon sx={{ paddingLeft: 0.5 }}>arrow_back_ios</Icon>
      </IconButton>

      {/* next button */}
      <IconButton
        size="small"
        onClick={() => {
          setParams({
            budgetId: params.get("budgetId") || "",
            date: moment(value).add(1, "month").format("YYYY-MM-DD"),
          });
        }}
      >
        <Icon sx={{ paddingRight: 0.3 }}>arrow_forward_ios</Icon>
      </IconButton>
    </>
  );
};

const ButtonDatePicker = (
  props: Omit<DatePickerProps<Moment>, "open" | "onOpen" | "onClose">
) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DatePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } as any }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      openTo="month"
      views={["month"]}
    />
  );
};

type FilterResultsProps = {
  title: string;
  setFilterText?: (filter: string) => void;
};

export const FilterResults = ({ title, setFilterText }: FilterResultsProps) => {
  const ref = React.useRef<any>();
  const [value, setValue] = React.useState<string | undefined>();

  const handleChange = (newValue: string | undefined) => {
    setValue(newValue || "");
    setFilterText && setFilterText(newValue || "");
  };

  return (
    <Paper
      sx={{
        p: "4px 10px",
        display: "flex",
        alignItems: "center",
        color: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.common.white
            : theme.palette.common.black,
        borderRadius: 10,
        backgroundColor: "transparent",
      }}
    >
      <InputBase
        inputRef={ref}
        sx={{ ml: 1, flex: 1, color: "inherit", fontSize: "0.9rem" }}
        placeholder={title}
        onChange={(e) => handleChange(e.target.value)}
        value={value}
        // onKeyDown={handleKeyDown}
      />

      {!value && <Icon>search</Icon>}
      {value && (
        <Box
          onClick={() => {
            handleChange("");
            ref.current.focus();
          }}
        >
          <Icon>close</Icon>
        </Box>
      )}
    </Paper>
  );
};
