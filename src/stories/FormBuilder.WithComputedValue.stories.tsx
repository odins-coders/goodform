import type { StoryObj } from '@storybook/react-vite';
import { formBuilderMeta } from './formBuilderShared';

export default formBuilderMeta;
type Story = StoryObj<typeof formBuilderMeta>;

export const WithComputedValue: Story = {
  args: {
    fields: [
      { type: 'text', name: 'firstName', label: 'First Name' },
      { type: 'text', name: 'lastName', label: 'Last Name' },
      {
        type: 'text',
        name: 'fullName',
        label: 'Full Name (computed)',
        dependsOn: {
          value: {
            on: ['firstName', 'lastName'],
            compute: ({ firstName, lastName }) =>
              [firstName, lastName].filter(Boolean).join(' ') || null,
          },
        },
      },
    ],
    onSubmit: console.log,
  },
};
