import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormBuilder } from '../FormBuilder';
import { FieldRegistryProvider } from '../hooks/useFormFieldRegistry';
import { FieldRegistry } from '../types';

const fieldRegistry: FieldRegistry = {
  text: (props) => (
    <label>
      {props.label}
      <input
        type="text"
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  ),
  select: (props) => (
    <label>
      {props.label}
      <select
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">-- select --</option>
        {props.options.map(option => (
          <option value={option} key={option}>{option}</option>
        ))}
      </select>
    </label>
  ),
  radio: (props) => (
    <fieldset>
      <legend>{props.label}</legend>
      {props.options.map(option => (
        <label key={option}>
          <input
            type="radio"
            name={props.name}
            value={option}
            checked={props.value === option}
            onChange={() => props.onChange(option)}
          />
          {option}
        </label>
      ))}
    </fieldset>
  ),
  checkbox: (props) => (
    <fieldset>
      <legend>{props.label}</legend>
      {props.options.map(option => (
        <label key={option}>
          <input
            type="checkbox"
            name={props.name}
            value={option}
            checked={props.value.includes(option)}
            onChange={(e) => {
              const next = e.target.checked
                ? [...props.value, option]
                : props.value.filter(v => v !== option)
              props.onChange(next)
            }}
          />
          {option}
        </label>
      ))}
    </fieldset>
  ),
};

const meta: Meta<typeof FormBuilder> = {
  component: FormBuilder,
  decorators: [
    (Story) => <FieldRegistryProvider value={fieldRegistry}><Story /></FieldRegistryProvider>,
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
    ],
    onSubmit: console.log,
  },
};

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
