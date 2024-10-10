import { ComponentStory, ComponentMeta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Button, Typography } from '@mui/material';
import { DefaultLayout } from './Layout.Default';
import { DefaultPage } from '../Page/Page';


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

// export default
export default {
  title: 'Example/Sample Page',
  component: DefaultLayout,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  decorators: [withRouter],
  parameters: {
    reactRouter: {
      routePath: '/',
      outlet: {
        element: <DefaultPage
          type='tabs'
          title='Title'
          status='Status'
          description='Desription'
          buttons={buttons}
          tabs={tabs}
        >
          <Typography variant="h2">Page goes here</Typography>
        </DefaultPage>,
        // handle: "Article",
        // path: ':articleId',
      },
    }
  },
  subcomponents: { DefaultPage }
} as ComponentMeta<typeof DefaultLayout>;

const Template: ComponentStory<typeof DefaultLayout> = () => <DefaultLayout />;

// 
export const Default = Template.bind({});
Default.args = {};