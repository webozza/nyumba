import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { AutoTable } from './AutoTable';
import { Button } from '@mui/material';

export default {
  title: 'Components/Tables',
  component: AutoTable,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  decorators: [withRouter],
  parameters: {
    reactRouter: {
      routePath: '/',
    }
  }
} as ComponentMeta<typeof AutoTable>;

const Template: ComponentStory<typeof AutoTable> = (args) => <AutoTable {...args} />;

// export
export const Default = Template.bind({});
Default.args = {
  options: {
    canDelete: false,
    onRowClick: (rowId) => {
      alert(rowId + ' is clicked')
    }
  },
  headers: [
    { label: "Column 1" },
    { label: "Column 2" },
    { label: "Column 3", align: "center" },
    { label: "Column 4", align: "center" },
    { label: "Column 5", align: "center" },
  ],
  rows: [
    {
      _id: "1",
      columns: [
        { value: "Row 1 - Column 1" },
        { value: "Column 2" },
        { component: <Button>3</Button> },
        { component: <Button>4</Button> },
        { component: <Button>5</Button> },
      ]
    },
    {
      _id: "2",
      columns: [
        { value: "Row 2 - Column 1" },
        { value: "Column 2" },
        { component: <Button>3</Button> },
        { component: <Button>4</Button> },
        { component: <Button>5</Button> },
      ]
    }
  ]
};
