# goodform

A headless React form library with an external store, 9 field types, and a declarative dependency system.

## Features

- **Headless** — you supply the UI components; goodform handles state and wiring
- **External store** — `FormStore` is a plain class; React subscribes via `useSyncExternalStore`, so only fields that actually change re-render
- **9 field types** — text, select, radio, checkbox, multiselect, autocomplete, date, switch, number
- **Declarative dependencies** — conditionally show/hide fields, enable/disable them, compute dynamic options, or derive values from other fields
- **TypeScript-first** — all types exported, fully typed field definitions and registry

## Installation

```bash
npm install goodform
```

Requires React 18 or later as a peer dependency.

## Quick Start

```tsx
import { FieldRegistryProvider, FormBuilder } from 'goodform'
import type { FieldRegistry, FieldDefinition, FormValues } from 'goodform'

// 1. Define your UI components once
const registry: FieldRegistry = {
  text: ({ label, name, value, onChange, disabled }) => (
    <label>
      {label}
      <input
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
    </label>
  ),
  select: ({ label, name, options, value, onChange, disabled }) => (
    <label>
      {label}
      <select name={name} value={value} onChange={e => onChange(e.target.value)} disabled={disabled}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  ),
  // … implement the remaining 7 types
}

// 2. Declare your fields
const fields: FieldDefinition[] = [
  { type: 'text',   name: 'firstName', label: 'First name' },
  { type: 'text',   name: 'lastName',  label: 'Last name'  },
  { type: 'select', name: 'country',   label: 'Country', options: ['Canada', 'USA'] },
]

// 3. Handle submission
function handleSubmit(values: FormValues) {
  console.log(values)
}

// 4. Render
export function MyForm() {
  return (
    <FieldRegistryProvider value={registry}>
      <FormBuilder fields={fields} onSubmit={handleSubmit} />
    </FieldRegistryProvider>
  )
}
```

## Core Concepts

### External Store

`FormStore` is a plain TypeScript class that holds all field state. React components subscribe to it via `useSyncExternalStore`. Each field subscribes only to its own slice of state, so a change to one field never re-renders unrelated fields.

### FieldRegistryProvider

You are responsible for providing a `FieldRegistry` — an object with one render function per field type. This keeps goodform completely headless: use any UI library (Material UI, Radix, shadcn/ui, your own design system) without any adapter layer.

Wrap your application (or the subtree that contains forms) once:

```tsx
<FieldRegistryProvider value={registry}>
  {/* FormBuilder components anywhere in the tree */}
</FieldRegistryProvider>
```

### FormBuilder

`FormBuilder` creates a `FormStore` internally (stable across re-renders), provides it via React context, and renders each field through the matching registry function. It also renders a `<form>` element with a submit button.

## Field Types

| Type | Value type | Extra props |
|------|-----------|-------------|
| `text` | `string` | — |
| `select` | `string` | `options: string[]` |
| `radio` | `string` | `options: string[]` |
| `checkbox` | `string[]` | `options: string[]` |
| `multiselect` | `string[]` | `options: string[]` |
| `autocomplete` | `string` | `options: string[]` |
| `date` | `Date \| null` | — |
| `switch` | `boolean` | — |
| `number` | `number \| null` | `format?: 'number' \| 'currency' \| 'percentage'`, `step?: number`, `min?: number`, `max?: number` |

All field definitions share these common props:

| Prop | Type | Description |
|------|------|-------------|
| `type` | string | Field type identifier |
| `name` | string | Unique field name (used as the key in `FormValues`) |
| `label` | string | Display label passed to the registry function |
| `visible` | `boolean` | Initial visibility (default `true`) |
| `disabled` | `boolean` | Initial disabled state (default `false`) |
| `defaultValue` | varies | Initial value for the field |
| `dependsOn` | `FieldDependency` | Reactive dependencies (see below) |

## Dependency System

The `dependsOn` property on any field definition declares reactive relationships to other fields. Four dependency types are available and can be combined freely on a single field.

### `visible` — conditional visibility

```ts
{
  type: 'text',
  name: 'spouseName',
  label: 'Spouse name',
  dependsOn: {
    visible: {
      on: ['maritalStatus'],
      compute: ({ maritalStatus }) => maritalStatus === 'Married',
    },
  },
}
```

### `disabled` — conditional disabled state

```ts
{
  type: 'text',
  name: 'promoCode',
  label: 'Promo code',
  dependsOn: {
    disabled: {
      on: ['hasPromo'],
      compute: ({ hasPromo }) => hasPromo !== true,
    },
  },
}
```

### `options` — dynamic options computed from other fields

```ts
{
  type: 'select',
  name: 'province',
  label: 'Province / State',
  options: [],
  dependsOn: {
    options: {
      on: ['country'],
      compute: ({ country }) =>
        country === 'Canada'
          ? ['Alberta', 'British Columbia', 'Ontario']
          : ['California', 'New York', 'Texas'],
    },
  },
}
```

### `value` — auto-computed or auto-reset value

Provide `compute` to derive a value from dependencies:

```ts
{
  type: 'text',
  name: 'fullName',
  label: 'Full name',
  dependsOn: {
    value: {
      on: ['firstName', 'lastName'],
      compute: ({ firstName, lastName }) => `${firstName ?? ''} ${lastName ?? ''}`.trim(),
    },
  },
}
```

Omit `compute` to auto-reset the field to `null` whenever a dependency changes:

```ts
{
  type: 'select',
  name: 'province',
  label: 'Province / State',
  options: [],
  dependsOn: {
    value: { on: ['country'] }, // resets to null when country changes
    options: {
      on: ['country'],
      compute: ({ country }) => getProvinces(country),
    },
  },
}
```

## FieldRegistry Interface

Implement all 9 functions to provide your UI layer:

```ts
type FieldRegistry = {
  text: (props: {
    label: string; name: string; value: string;
    onChange: (v: string) => void; disabled?: boolean
  }) => React.ReactNode

  select: (props: {
    label: string; name: string; options: string[]; value: string;
    onChange: (v: string) => void; disabled?: boolean
  }) => React.ReactNode

  radio: (props: {
    label: string; name: string; options: string[]; value: string;
    onChange: (v: string) => void; disabled?: boolean
  }) => React.ReactNode

  checkbox: (props: {
    label: string; name: string; options: string[]; value: string[];
    onChange: (v: string[]) => void; disabled?: boolean
  }) => React.ReactNode

  multiselect: (props: {
    label: string; name: string; options: string[]; value: string[];
    onChange: (v: string[]) => void; disabled?: boolean
  }) => React.ReactNode

  autocomplete: (props: {
    label: string; name: string; options: string[]; value: string;
    onChange: (v: string) => void; disabled?: boolean
  }) => React.ReactNode

  date: (props: {
    label: string; name: string; value: Date | null;
    onChange: (v: Date | null) => void; disabled?: boolean
  }) => React.ReactNode

  switch: (props: {
    label: string; name: string; value: boolean;
    onChange: (v: boolean) => void; disabled?: boolean
  }) => React.ReactNode

  number: (props: {
    label: string; name: string; value: number | null;
    onChange: (v: number | null) => void;
    format?: 'number' | 'currency' | 'percentage';
    step?: number; min?: number; max?: number; disabled?: boolean
  }) => React.ReactNode
}
```

## FormBuilder Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fields` | `FieldDefinition[]` | Yes | Ordered list of field definitions |
| `onSubmit` | `(values: FormValues) => void` | Yes | Called with all field values on form submit |
| `defaultValues` | `FormValues` | No | Override `defaultValue` on individual fields |

`FormValues` is `Record<string, string | string[] | boolean | number | Date | null>`.

## Examples

### Conditional Visibility

Show a spouse name field only when marital status is "Married":

```tsx
const fields: FieldDefinition[] = [
  {
    type: 'select',
    name: 'maritalStatus',
    label: 'Marital status',
    options: ['Single', 'Married', 'Divorced'],
  },
  {
    type: 'text',
    name: 'spouseName',
    label: 'Spouse name',
    dependsOn: {
      visible: {
        on: ['maritalStatus'],
        compute: ({ maritalStatus }) => maritalStatus === 'Married',
      },
    },
  },
]
```

### Cascading Dropdowns

Reset and repopulate a province/state dropdown when the country changes:

```tsx
const fields: FieldDefinition[] = [
  {
    type: 'select',
    name: 'country',
    label: 'Country',
    options: ['Canada', 'USA'],
  },
  {
    type: 'select',
    name: 'region',
    label: 'Province / State',
    options: [],
    dependsOn: {
      value: { on: ['country'] }, // reset to null on country change
      options: {
        on: ['country'],
        compute: ({ country }) =>
          country === 'Canada'
            ? ['Alberta', 'British Columbia', 'Ontario']
            : ['California', 'New York', 'Texas'],
      },
    },
  },
]
```

### Computed Text Value

Derive a full name from first and last name fields:

```tsx
const fields: FieldDefinition[] = [
  { type: 'text', name: 'firstName', label: 'First name' },
  { type: 'text', name: 'lastName',  label: 'Last name'  },
  {
    type: 'text',
    name: 'fullName',
    label: 'Full name',
    disabled: true,
    dependsOn: {
      value: {
        on: ['firstName', 'lastName'],
        compute: ({ firstName, lastName }) =>
          [firstName, lastName].filter(Boolean).join(' '),
      },
    },
  },
]
```

### Computed Number Value

Calculate a line total from unit price and quantity:

```tsx
const fields: FieldDefinition[] = [
  { type: 'number', name: 'unitPrice', label: 'Unit price', format: 'currency', min: 0 },
  { type: 'number', name: 'quantity',  label: 'Quantity',   step: 1, min: 0 },
  {
    type: 'number',
    name: 'total',
    label: 'Total',
    format: 'currency',
    disabled: true,
    dependsOn: {
      value: {
        on: ['unitPrice', 'quantity'],
        compute: ({ unitPrice, quantity }) =>
          unitPrice != null && quantity != null
            ? (unitPrice as number) * (quantity as number)
            : null,
      },
    },
  },
]
```

## Development

| Command | Description |
|---------|-------------|
| `npm run build` | Compile and bundle the library |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build static Storybook site |
