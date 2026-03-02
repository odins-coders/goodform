import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormBuilder } from '../FormBuilder';
import { FieldRegistryProvider } from '../hooks/useFormFieldRegistry';
import { fieldRegistry } from './formBuilderShared';

const meta: Meta<typeof FormBuilder> = {
  component: FormBuilder,
  title: 'FormBuilder',
  decorators: [
    (Story) => (
      <FieldRegistryProvider value={fieldRegistry}>
        <Story />
      </FieldRegistryProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

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
