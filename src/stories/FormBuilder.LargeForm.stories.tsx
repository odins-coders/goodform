import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormBuilder } from '../FormBuilder'
import { FieldRegistryProvider } from '../hooks/useFormFieldRegistry'
import { fieldRegistry } from './formBuilderShared'
import type { FieldDefinition, FormValues } from '../types'

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
}

export default meta
type Story = StoryObj<typeof meta>

function computeVariantOptions(variant: unknown, index: number): string[] {
  if (typeof variant !== 'string' || !variant) return []
  // Keep options stable-ish but varied across fields
  const seed = `${variant}-${index % 5}`
  if (seed.startsWith('Red')) return ['Crimson', 'Scarlet', 'Ruby']
  if (seed.startsWith('Green')) return ['Emerald', 'Mint', 'Olive']
  if (seed.startsWith('Blue')) return ['Navy', 'Sky', 'Teal']
  if (seed.startsWith('Small')) return ['XS', 'S', 'M']
  if (seed.startsWith('Medium')) return ['M', 'L', 'XL']
  if (seed.startsWith('Large')) return ['L', 'XL', 'XXL']
  return ['Option A', 'Option B', 'Option C']
}

function generateLargeFormFields(): FieldDefinition[] {
  const fields: FieldDefinition[] = []

  // 0–24: Independent fields (25)
  for (let i = 0; i < 10; i++) {
    fields.push({
      type: 'text',
      name: `ind_text_${i}`,
      label: `Independent text ${i + 1}`,
    })
  }

  for (let i = 0; i < 5; i++) {
    fields.push({
      type: 'select',
      name: `ind_select_${i}`,
      label: `Independent select ${i + 1}`,
      options: ['Red', 'Green', 'Blue'],
    })
  }

  for (let i = 0; i < 5; i++) {
    fields.push({
      type: 'radio',
      name: `ind_radio_${i}`,
      label: `Independent radio ${i + 1}`,
      options: ['Small', 'Medium', 'Large'],
    })
  }

  for (let i = 0; i < 5; i++) {
    fields.push({
      type: 'checkbox',
      name: `ind_checkbox_${i}`,
      label: `Independent checkbox ${i + 1}`,
      options: ['Alpha', 'Beta', 'Gamma'],
    })
  }

  // 25–49: dependsOn.value only (25)
  for (let i = 0; i < 25; i++) {
    const parent =
      i % 3 === 0 ? `ind_select_${i % 5}` : i % 3 === 1 ? `ind_radio_${i % 5}` : `ind_text_${i % 10}`

    fields.push({
      type: 'text',
      name: `value_dep_${i}`,
      label: `Value dependent text ${i + 1} (on ${parent})`,
      dependsOn:
        i % 5 === 0
          ? {
              value: {
                on: [parent],
                compute: (depValues: FormValues) => {
                  const v = depValues[parent]
                  if (typeof v !== 'string' || !v) return null
                  return `${v} (computed)`
                },
              },
            }
          : {
              value: { on: [parent] },
            },
    })
  }

  // 50–74: dependsOn.options only (25)
  for (let i = 0; i < 25; i++) {
    const parent = `ind_select_${i % 5}`

    if (i % 2 === 0) {
      fields.push({
        type: 'select',
        name: `options_dep_select_${i}`,
        label: `Options dependent select ${i + 1} (on ${parent})`,
        options: [],
        dependsOn: {
          options: {
            on: [parent],
            compute: (depValues: FormValues) => computeVariantOptions(depValues[parent], i),
          },
        },
      })
    } else {
      fields.push({
        type: 'radio',
        name: `options_dep_radio_${i}`,
        label: `Options dependent radio ${i + 1} (on ${parent})`,
        options: [],
        dependsOn: {
          options: {
            on: [parent],
            compute: (depValues: FormValues) => computeVariantOptions(depValues[parent], i),
          },
        },
      })
    }
  }

  // 75–99: dependsOn.value + dependsOn.options (25)
  for (let i = 0; i < 25; i++) {
    const parent = i % 2 === 0 ? `ind_select_${i % 5}` : `ind_radio_${i % 5}`

    fields.push({
      type: 'select',
      name: `both_dep_${i}`,
      label: `Cascading select ${i + 1} (options+value depend on ${parent})`,
      options: [],
      dependsOn: {
        value: { on: [parent] },
        options: {
          on: [parent],
          compute: (depValues: FormValues) => computeVariantOptions(depValues[parent], i),
        },
      },
    })
  }

  return fields
}

export const LargeForm: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxHeight: '70vh', overflow: 'auto', padding: 12 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    fields: generateLargeFormFields(),
    onSubmit: console.log,
  },
}

