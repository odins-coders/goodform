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
      {
        type: 'date',
        label: 'Birth Date',
        name: 'birthDate',
        defaultValue: new Date('1990-01-01T00:00:00'),
      },
    ],
    onSubmit: console.log,
  },
};
