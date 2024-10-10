import * as React from "react";
import moment, { Moment } from "moment";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  MobileDatePicker,
  MobileDatePickerProps,
} from "@mui/x-date-pickers/MobileDatePicker";
import { UseDateFieldProps } from "@mui/x-date-pickers/DateField";
import {
  BaseSingleInputFieldProps,
  DateValidationError,
  FieldSection,
} from "@mui/x-date-pickers";
import {
  Box,
  Icon,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Props {
  title: string;
  subTitle?: string;
  searchTitle?: string;
  options?: {
    showCalendar?: boolean;
    showFilter?: boolean; //used with setFilterText
    showBackButton?: boolean;
  };
  setFilterText?: (filter: string) => void;
}

export const MobileTitleBar = ({
  title,
  subTitle,
  searchTitle,
  options,
  setFilterText,
}: Props) => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const date = moment(params.get("date") || new Date());

  return (
    <Stack
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      sx={{
        height: (theme) => {
          let height = 120;
          if (options?.showFilter === false)
            height = height - Number(theme.spacing(8));
          if (options?.showCalendar === false)
            height = height - Number(theme.spacing(8));
          return `${height}px`;
        },
      }}
    >
      {options?.showBackButton && (
        <Box
          sx={{
            position: "absolute",
            left: 10,
            top: 15,
          }}
        >
          <IconButton
            onClick={() => {
              navigate("/");
            }}
          >
            <Icon>arrow_back</Icon>
          </IconButton>
        </Box>
      )}

      <Stack spacing={2} alignItems="center">
        <Typography
          variant="h4"
          sx={{
            textTransform: "uppercase",
          }}
        >
          <b>{title}</b>
        </Typography>

        {subTitle && (
          <Typography
            variant="body1"
            sx={{
              textTransform: "uppercase",
            }}
          >
            <b>{subTitle}</b>
          </Typography>
        )}
      </Stack>

      {!options?.showCalendar && <div></div>}
      {options?.showCalendar === true && (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ButtonDatePicker
            label={date.format("DD MMMM YYYY")}
            value={date}
            onChange={(newValue) =>
              newValue && setParams({ date: newValue.format("YYYY-MM-DD") })
            }
          />
        </LocalizationProvider>
      )}
      {options?.showCalendar && <></>}

      {options?.showFilter === true && (
        <FilterResults
          setFilterText={setFilterText}
          title={searchTitle || ""}
        />
      )}
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
      justifyContent="space-between"
      sx={{
        // border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        width: "60%",
      }}
    >
      {/* back button */}
      <IconButton
        size="small"
        onClick={() => {
          setParams({
            date: moment(value).subtract(1, "day").format("YYYY-MM-DD"),
          });
        }}
      >
        <Icon sx={{ paddingLeft: 0.5 }}>arrow_back_ios</Icon>
      </IconButton>

      {/* title and calendar button */}
      <Button
        id={id}
        variant="text"
        disabled={disabled}
        ref={ref}
        onClick={() => setOpen?.((prev) => !prev)}
        sx={{
          fontSize: "1rem",
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

      {/* next button */}
      <IconButton
        size="small"
        onClick={() => {
          setParams({ date: moment(value).add(1, "day").format("YYYY-MM-DD") });
        }}
      >
        <Icon sx={{ paddingRight: 0.3 }}>arrow_forward_ios</Icon>
      </IconButton>
    </Stack>
  );
};

const ButtonDatePicker = (
  props: Omit<MobileDatePickerProps<Moment>, "open" | "onOpen" | "onClose">
) => {
  const [open, setOpen] = React.useState(false);

  return (
    <MobileDatePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } as any }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      closeOnSelect
      // views={['month']}
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
        width: "100%",
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
