import { styled } from '@mui/material/styles';
import { TableCell as MUITableCell } from '@mui/material';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { AutocompleteGetTagProps, Icon, useAutocomplete } from '@mui/material';
import { TableCellProps } from '.';
import { isArray } from 'lodash';

const top100Films = ['Building 1', 'Building 2'];

const Root = styled('div')(
	({ theme }) => `
  color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'};
  font-size: 14px;
`
);

const InputWrapper = styled('div')(
	({ theme }) => `
  border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,.85)'};
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
);

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
	label: string;
}

function Tag(props: TagProps) {
	const { label, onDelete, ...other } = props;
	return (
		<div {...other}>
			<span>{label}</span>
			<Icon onClick={onDelete} fontSize="small">
				close
			</Icon>
		</div>
	);
}

const StyledTag = styled(Tag)<TagProps>(
	({ theme }) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'};
  border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
);

const Listbox = styled('ul')(
	({ theme }) => `
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
);

export const CellInputTags = (props: TableCellProps) => {
	const _values = props?.value ? props.value : '';
	const _options = props?.options ? [...props.options] : [];

	const { getRootProps, getInputProps, getTagProps, getListboxProps, getOptionProps, groupedOptions, value, focused, setAnchorEl } =
		useAutocomplete({
			id: props.name,
			freeSolo: true,
			multiple: true,
			defaultValue: isArray(_values) ? [..._values] : [],
			options: _options,
			getOptionLabel: (option) => option.toString(),
			onChange(event: any) {
				props.onBlur && props.onBlur(event);
			},
		});

	return (
		<MUITableCell
			colSpan={props.colSpan}
			padding="none"
			sx={{
				p: 0.2,
				border: 0,
			}}
			width={props.width}
			align={props.align || 'left'}
		>
			<Root>
				<div {...getRootProps()}>
					<InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
						{value.map((option: string, index: number) => (
							<StyledTag label={option} {...getTagProps({ index })} />
						))}
						<input {...getInputProps()} />
					</InputWrapper>
				</div>
				{groupedOptions.length > 0 ? (
					<Listbox {...getListboxProps()}>
						{(groupedOptions as typeof top100Films).map((option, index) => (
							<li {...getOptionProps({ option, index })}>
								<span>{option}</span>
								<Icon fontSize="small">check</Icon>
							</li>
						))}
					</Listbox>
				) : null}
			</Root>
		</MUITableCell>
	);
};
