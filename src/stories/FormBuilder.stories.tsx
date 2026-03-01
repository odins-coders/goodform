import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormBuilder } from '../FormBuilder';
import { FieldRegistryProvider } from '../hooks/useFormFieldRegistry';
import { FieldRegistry } from '../types';


const fieldRegistry: FieldRegistry = {
  text: (props) => (
    <label>
      {props.label}
      <input type="text" name={props.name} />
    </label>
  ),
  select: (props) => (
    <label>
      {props.label}
      <select name={props.name}>
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