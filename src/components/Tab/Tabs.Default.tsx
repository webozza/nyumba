import React from 'react';
import { Tab, Box, Stack, Icon, Paper, InputBase } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useSearchParams } from 'react-router-dom';

interface Tab {
  title: string
  icon?: string
  hidden?: boolean
  component: JSX.Element
}

interface Props {
  tabs: Tab[],
  defaultTabIndex: string
  showHistory?: boolean
  showFilter?: boolean
  setFilterText?: (filter: string) => void
}

export const DefaultTabs = ({ tabs, defaultTabIndex, showHistory, showFilter, setFilterText }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = React.useState<string>(searchParams.get('tab') || defaultTabIndex);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    addParams("tab", newValue)
    setValue(newValue);
  };

  const addParams = async (name: string, value: string) => {
    if (searchParams.has(name)) searchParams.delete(name)
    searchParams.append(name, value)
    setSearchParams(searchParams)
    return true
  }

  return (
    <Box
      sx={{
        '& .MuiButtonBase-root': {
          minHeight: 36,
          textTransform: 'uppercase',
          m: 0,
        },
        '& .MuiTabs-root': {
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.dark',
            m: 0
          },
          '& .Mui-selected': {
            fontWeight: 'bolder',
            borderBottom: 0,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            color: 'primary.dark',
            backgroundColor: (theme) => theme.palette.background.paper,
          },
        },
        '& .MuiTab-root': {
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        },
      }}
    >
      <TabContext value={value}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`
          }}>
          {/* tab list */}
          <TabList onChange={handleChange}>
            {/* tabs */}
            {tabs.map((tab, tabIdx) => {
              if (tab.title !== "History" && tab.hidden !== true) {
                return (
                  <Tab
                    key={`tab-${String(tabIdx)}`}
                    label={tab.title}
                    value={String(tabIdx)}
                    icon={tab?.icon && <Icon>{tab?.icon}</Icon>}
                    iconPosition="start"
                  />)
              }
            })}
          </TabList>

          {/* history tab */}
          {showHistory && (
            <TabList
              sx={{ height: 50 }}
              onChange={handleChange}
            >
              <Tab value={'999'} icon={<Icon>history</Icon>} />
            </TabList>
          )}

          {/* filter tab */}
          {showFilter && (
            <TabList
              sx={{ height: 50 }}
              onChange={handleChange}
            >
              <FilterResults setFilterText={setFilterText} />
            </TabList>
          )}
        </Stack>


        {/* BODY */}
        <Box sx={{ width: '100%' }}>
          {tabs.map((tab, tabIdx) => {
            if (tab.title !== "History") {
              return <TabPanel
                value={String(tabIdx)}
                sx={{
                  backgroundColor: "transparent",
                  p: 2,
                }}
              >{tab.component}</TabPanel>
            }
          })}
          {showHistory && (
            <TabPanel value={'999'}>{tabs.find(tab => tab.title === 'History')?.component}</TabPanel>
          )}
        </Box>
      </TabContext>
    </Box>
  );
};


type FilterResultsProps = {
  setFilterText?: (filter: string) => void
}

export const FilterResults = ({ setFilterText }: FilterResultsProps) => {
  const ref = React.useRef<any>()
  const [value, setValue] = React.useState<string | undefined>()

  const handleChange = (newValue: string | undefined) => {
    setValue(newValue || "")
    setFilterText && setFilterText(newValue || "")
  }

  return (
    <Paper
      sx={{
        p: '4px 10px',
        display: 'flex',
        alignItems: 'center',
        color: theme => theme.palette.common.white,
        borderRadius: 10,
        backgroundColor: 'transparent',
      }}
    >
      <InputBase
        inputRef={ref}
        sx={{ ml: 1, flex: 1, color: 'inherit', fontSize: '0.9rem' }}
        placeholder="Filter projects by name"
        onChange={(e) => handleChange(e.target.value)}
        value={value}
      // onKeyDown={handleKeyDown}
      />

      {!value && <Icon>search</Icon>}
      {value && <Box
        onClick={() => {
          handleChange("")
          ref.current.focus();
        }}
      ><Icon>close</Icon></Box>}
    </Paper>
  )
}