import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormBuilder } from '../FormBuilder';
import { FieldRegistryProvider } from '../hooks/useFormFieldRegistry';
import { fieldRegistry } from './formBuilderShared';

const meta: Meta<typeof FormBuilder> = {
  component: FormBuilder,
  title: 'FormBuilder/WithNumberFields',
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

export const PlainNumber: Story = {
  args: {
    fields: [
      {
        type: 'number',
        label: 'Quantity',
        name: 'quantity',
        step: 1,
        min: 0,
        defaultValue: 1,
      },
    ],
    onSubmit: console.log,
  },
};

export const Currency: Story = {
  args: {
    fields: [
      {
        type: 'number',
        label: 'Price',
        name: 'price',
        format: 'currency',
        step: 0.01,
        min: 0,
        defaultValue: 9.99,
      },
    ],
    onSubmit: console.log,
  },
};

export const Percentage: Story = {
  args: {
    fields: [
      {
        type: 'number',
        label: 'Discount',
        name: 'discount',
        format: 'percentage',
        step: 1,
        min: 0,
        max: 100,
        defaultValue: 10,
      },
    ],
    onSubmit: console.log,
  },
};

export const MixedFormats: Story = {
  args: {
    fields: [
      {
        type: 'text',
        label: 'Product Name',
        name: 'productName',
        defaultValue: 'Widget',
      },
      {
        type: 'number',
        label: 'Unit Price',
        name: 'unitPrice',
        format: 'currency',
        step: 0.01,
        min: 0,
        defaultValue: 19.99,
      },
      {
        type: 'number',
        label: 'Quantity',
        name: 'quantity',
        step: 1,
        min: 1,
        defaultValue: 1,
      },
      {
        type: 'number',
        label: 'Discount',
        name: 'discount',
        format: 'percentage',
        step: 1,
        min: 0,
        max: 100,
        defaultValue: 0,
      },
    ],
    onSubmit: console.log,
  },
};

export const ComputedTotal: Story = {
  args: {
    fields: [
      {
        type: 'number',
        label: 'Unit Price',
        name: 'unitPrice',
        format: 'currency',
        step: 0.01,
        min: 0,
        defaultValue: 10,
      },
      {
        type: 'number',
        label: 'Quantity',
        name: 'quantity',
        step: 1,
        min: 1,
        defaultValue: 1,
      },
      {
        type: 'number',
        label: 'Total',
        name: 'total',
        format: 'currency',
        disabled: true,
        dependsOn: {
          value: {
            on: ['unitPrice', 'quantity'],
            compute: ({ unitPrice, quantity }) =>
              typeof unitPrice === 'number' && typeof quantity === 'number'
                ? Math.round(unitPrice * quantity * 100) / 100
                : null,
          },
        },
      },
    ],
    onSubmit: console.log,
  },
};
