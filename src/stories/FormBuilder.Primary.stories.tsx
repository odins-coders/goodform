import type { StoryObj } from '@storybook/react-vite';
import { formBuilderMeta } from './formBuilderShared';

export default formBuilderMeta;
type Story = StoryObj<typeof formBuilderMeta>;

export const Primary: Story = {
  args: {
    fields: [
      {
        type: 'text',
        label: 'Name',
        name: 'name',
      },
      {
        type: 'select',
        label: 'Color',
        name: 'color',
        options: ['Red', 'Green', 'Blue'],
      },
      {
        type: 'radio',
        label: 'Size',
        name: 'size',
        options: ['Small', 'Medium', 'Large'],
      },
      {
        type: 'checkbox',
        label: 'Agree to terms',
        name: 'agree',
        options: ['Yes', 'No'],
      },
    ],
    onSubmit: console.log,
  },
};
