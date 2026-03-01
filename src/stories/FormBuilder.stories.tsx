import type { Meta, StoryObj } from '@storybook/react'
import * as Effect from 'effect/Effect'
import * as Schema from 'effect/Schema'
import { GoodFormProvider } from '../context/RegistryContext'
import { FormBuilder } from '../components/FormBuilder'
import { useGoodFormContext } from '../context/FormContext'
import type {
  GoodFormComponents,
  GoodFormTextFieldProps,
  GoodFormSelectFieldProps,
  GoodFormSwitchFieldProps,
  GoodFormRadioFieldProps,
  GoodFormDatePickerFieldProps,
} from '../types/fields'

// ---------------------------------------------------------------------------
// Minimal native-HTML component implementations
// ---------------------------------------------------------------------------

function fieldStyle(error?: string): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginBottom: 16,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 14,
  }
}

const labelStyle: React.CSSProperties = { fontWeight: 600, color: '#333' }
const errorStyle: React.CSSProperties = { color: '#c00', fontSize: 12 }
const inputStyle = (disabled?: boolean): React.CSSProperties => ({
  padding: '6px 8px',
  border: '1px solid #ccc',
  borderRadius: 4,
  fontSize: 14,
  opacity: disabled ? 0.5 : 1,
})

function TextField({ name, value, onChange, error, label, placeholder, disabled }: GoodFormTextFieldProps) {
  return (
    <div style={fieldStyle(error)}>
      {label && <label htmlFor={name} style={labelStyle}>{label}</label>}
      <input
        id={name}
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle(disabled)}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  )
}

function SelectField({ name, value, onChange, error, label, options, disabled }: GoodFormSelectFieldProps) {
  return (
    <div style={fieldStyle(error)}>
      {label && <label htmlFor={name} style={labelStyle}>{label}</label>}
      <select
        id={name}
        value={value}
        disabled={disabled}
        style={inputStyle(disabled)}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- select --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  )
}

function SwitchField({ name, value, onChange, error, label, disabled }: GoodFormSwitchFieldProps) {
  return (
    <div style={{ ...fieldStyle(error), flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <input
        id={name}
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label && <label htmlFor={name} style={labelStyle}>{label}</label>}
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  )
}

function RadioField({ name, value, onChange, error, label, options, disabled }: GoodFormRadioFieldProps) {
  return (
    <div style={fieldStyle(error)}>
      {label && <span style={labelStyle}>{label}</span>}
      {options.map((opt) => (
        <label key={opt.value} style={{ display: 'flex', gap: 6, alignItems: 'center', opacity: disabled ? 0.5 : 1 }}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            disabled={disabled}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  )
}

function DatePickerField({ name, value, onChange, error, label, disabled, minDate, maxDate }: GoodFormDatePickerFieldProps) {
  const toInputValue = (d: Date | null) =>
    d ? d.toISOString().slice(0, 10) : ''

  const fromInputValue = (s: string) =>
    s ? new Date(s) : null

  return (
    <div style={fieldStyle(error)}>
      {label && <label htmlFor={name} style={labelStyle}>{label}</label>}
      <input
        id={name}
        type="date"
        value={toInputValue(value)}
        disabled={disabled}
        min={minDate ? toInputValue(minDate) : undefined}
        max={maxDate ? toInputValue(maxDate) : undefined}
        style={inputStyle(disabled)}
        onChange={(e) => onChange(fromInputValue(e.target.value))}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  )
}

const nativeComponents: GoodFormComponents = {
  text: TextField,
  select: SelectField,
  switch: SwitchField,
  radio: RadioField,
  datepicker: DatePickerField,
}

// ---------------------------------------------------------------------------
// Submit button that reads form context
// ---------------------------------------------------------------------------

function SubmitButton() {
  const { isSubmitting, submitError } = useGoodFormContext()
  return (
    <div>
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '8px 16px',
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
          fontSize: 14,
        }}
      >
        {isSubmitting ? 'Submitting…' : 'Submit'}
      </button>
      {submitError instanceof Error && (
        <p style={{ color: '#c00', marginTop: 8 }}>{submitError.message}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Wrapper that provides the component registry
// ---------------------------------------------------------------------------

function WithProvider({ children }: { children: React.ReactNode }) {
  return <GoodFormProvider components={nativeComponents}>{children}</GoodFormProvider>
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'goodform/FormBuilder',
  decorators: [(Story) => <WithProvider><Story /></WithProvider>],
}

export default meta
type Story = StoryObj

// -- All field types ---------------------------------------------------------

export const AllFieldTypes: Story = {
  name: 'All field types',
  render: () => (
    <FormBuilder
      fields={[
        {
          name: 'username',
          type: 'text',
          label: 'Username',
          placeholder: 'e.g. jsmith',
          validation: Schema.String.pipe(
            Schema.minLength(2, { message: () => 'At least 2 characters' }),
          ),
        },
        {
          name: 'role',
          type: 'select',
          label: 'Role',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ],
          validation: Schema.NonEmptyString.annotations({
            message: () => 'Please select a role',
          }),
        },
        {
          name: 'notifications',
          type: 'switch',
          label: 'Enable notifications',
          defaultValue: true,
        },
        {
          name: 'plan',
          type: 'radio',
          label: 'Plan',
          options: [
            { label: 'Free', value: 'free' },
            { label: 'Pro', value: 'pro' },
            { label: 'Enterprise', value: 'enterprise' },
          ],
          defaultValue: 'free',
        },
        {
          name: 'startDate',
          type: 'datepicker',
          label: 'Start date',
        },
      ]}
      onSubmit={(values) =>
        Effect.sync(() => {
          // eslint-disable-next-line no-console
          console.log('Submitted:', values)
          alert(JSON.stringify(values, null, 2))
        })
      }
    >
      <SubmitButton />
    </FormBuilder>
  ),
}

// -- Text only with validation -----------------------------------------------

export const TextWithValidation: Story = {
  name: 'Text field with validation',
  render: () => (
    <FormBuilder
      fields={[
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          placeholder: 'you@example.com',
          validation: Schema.String.pipe(
            Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
              message: () => 'Must be a valid email address',
            }),
          ),
        },
        {
          name: 'password',
          type: 'text',
          label: 'Password',
          placeholder: '8+ characters',
          validation: Schema.String.pipe(
            Schema.minLength(8, { message: () => 'At least 8 characters required' }),
          ),
        },
      ]}
      onSubmit={(values) =>
        Effect.sync(() => {
          // eslint-disable-next-line no-console
          console.log('Submitted:', values)
          alert(JSON.stringify(values, null, 2))
        })
      }
    >
      <SubmitButton />
    </FormBuilder>
  ),
}

// -- Disabled form -----------------------------------------------------------

export const DisabledForm: Story = {
  name: 'Disabled form',
  render: () => (
    <FormBuilder
      disabled
      fields={[
        { name: 'name', type: 'text', label: 'Name', defaultValue: 'Read-only value' },
        {
          name: 'tier',
          type: 'select',
          label: 'Tier',
          defaultValue: 'pro',
          options: [
            { label: 'Free', value: 'free' },
            { label: 'Pro', value: 'pro' },
          ],
        },
      ]}
      onSubmit={() => Effect.void}
    >
      <SubmitButton />
    </FormBuilder>
  ),
}

// -- Async submit with simulated delay ----------------------------------------

export const AsyncSubmit: Story = {
  name: 'Async submit (1 s delay)',
  render: () => (
    <FormBuilder
      fields={[
        { name: 'message', type: 'text', label: 'Message', placeholder: 'Say something…' },
      ]}
      onSubmit={(values) =>
        Effect.gen(function* () {
          yield* Effect.sleep('1 second')
          // eslint-disable-next-line no-console
          console.log('Submitted:', values)
          alert(JSON.stringify(values, null, 2))
        })
      }
    >
      <SubmitButton />
    </FormBuilder>
  ),
}
