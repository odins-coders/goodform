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

export const WithDependencies: Story = {
  args: {
    fields: [
      {
        type: 'select',
        name: 'country',
        label: 'Country',
        options: ['USA', 'Canada', 'UK'],
      },
      {
        type: 'select',
        name: 'region',
        label: 'State / Province',
        options: [],
        dependsOn: {
          options: {
            on: ['country'],
            compute: ({ country }) => {
              if (country === 'USA') return ['California', 'Texas', 'New York']
              if (country === 'Canada') return ['Ontario', 'Quebec', 'British Columbia']
              return []
            },
          },
          value: { on: ['country'] },
        },
      },
      {
        type: 'text',
        name: 'city',
        label: 'City',
        dependsOn: {
          value: { on: ['country'] },
        },
      },
    ],
    onSubmit: console.log,
  },
};
