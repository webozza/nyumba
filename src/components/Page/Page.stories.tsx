import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { DefaultPage } from './Page';
import { Button, Typography } from '@mui/material';

export default {
  title: 'Components/Page',
  component: DefaultPage,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  decorators: [withRouter],
  parameters: {
    reactRouter: {
      routePath: '/',
    }
  }
} as ComponentMeta<typeof DefaultPage>;

const Template: ComponentStory<typeof DefaultPage> = (args) => <DefaultPage {...args} />;

// components
const buttons = <>
  <Button variant="contained">Button 1</Button>
  <Button variant="contained">Button 2</Button>
</>

const tabs = [
  {
    title: 'Tab 1',
    icon: 'swipe-up',
    component: 'This is tab 1 content',
  },
  {
    title: 'Tab 2',
    icon: 'swipe-up',
    component: 'This is tab 2 content',
  },
]

// export
export const Default = Template.bind({});
Default.args = {
  type: 'default',
  title: 'Title',
  status: 'Status',
  description: 'Description',
  buttons: buttons,
  children: <Typography>Body</Typography>
};

export const Tabs = Template.bind({});
Tabs.args = {
  type: 'tabs',
  title: 'Title',
  status: 'Status',
  description: 'Description',
  buttons: buttons,
  tabs: tabs,
};