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

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Belarus',
  'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia',
  'Cameroon', 'Canada', 'Cape Verde', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
  'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala', 'Guinea',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
  'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
  'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia',
  'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'Norway', 'Oman',
  'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tunisia', 'Turkey',
  'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];

export const WithAutocomplete: Story = {
  args: {
    fields: [
      {
        type: 'text',
        label: 'Full Name',
        name: 'fullName',
      },
      {
        type: 'autocomplete',
        label: 'Country',
        name: 'country',
        options: COUNTRIES,
      },
      {
        type: 'autocomplete',
        label: 'Nationality',
        name: 'nationality',
        options: COUNTRIES,
      },
    ],
    onSubmit: console.log,
  },
};

export const AutocompleteWithDependency: Story = {
  args: {
    fields: [
      {
        type: 'autocomplete',
        label: 'Category',
        name: 'category',
        options: ['Fruits', 'Vegetables', 'Dairy'],
      },
      {
        type: 'autocomplete',
        label: 'Item',
        name: 'item',
        options: [],
        dependsOn: {
          options: {
            on: ['category'],
            compute: ({ category }) => {
              if (category === 'Fruits') return ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']
              if (category === 'Vegetables') return ['Artichoke', 'Beetroot', 'Carrot', 'Daikon', 'Endive', 'Fennel']
              if (category === 'Dairy') return ['Butter', 'Cheese', 'Cream', 'Milk', 'Yogurt']
              return []
            },
          },
          value: { on: ['category'] },
        },
      },
    ],
    onSubmit: console.log,
  },
};
