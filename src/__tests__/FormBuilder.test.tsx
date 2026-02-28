import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import * as Schema from 'effect/Schema'
import * as Effect from 'effect/Effect'
import { GoodFormProvider } from '../context/RegistryContext'
import { FormBuilder } from '../components/FormBuilder'
import type {
  GoodFormTextFieldProps,
  GoodFormSelectFieldProps,
  GoodFormSwitchFieldProps,
} from '../types/fields'

// Minimal mock field components
function MockTextField({ name, value, onChange, error, label }: GoodFormTextFieldProps) {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span role="alert">{error}</span>}
    </div>
  )
}

function MockSelectField({ name, value, onChange, error, label, options }: GoodFormSelectFieldProps) {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <select id={name} name={name} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span role="alert">{error}</span>}
    </div>
  )
}

function MockSwitchField({ name, value, onChange, label }: GoodFormSwitchFieldProps) {
  return (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type="checkbox"
        name={name}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  )
}

const components = {
  text: MockTextField,
  select: MockSelectField,
  switch: MockSwitchField,
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <GoodFormProvider components={components}>{children}</GoodFormProvider>
}

describe('FormBuilder', () => {
  it('renders text fields with labels', () => {
    render(
      <Wrapper>
        <FormBuilder
          fields={[{ name: 'email', type: 'text', label: 'Email' }]}
          onSubmit={() => Effect.void}
        />
      </Wrapper>,
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('renders fields in order', () => {
    render(
      <Wrapper>
        <FormBuilder
          fields={[
            { name: 'first', type: 'text', label: 'First' },
            { name: 'second', type: 'text', label: 'Second' },
          ]}
          onSubmit={() => Effect.void}
        />
      </Wrapper>,
    )
    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(2)
  })

  it('updates value on change', () => {
    render(
      <Wrapper>
        <FormBuilder
          fields={[{ name: 'name', type: 'text', label: 'Name' }]}
          onSubmit={() => Effect.void}
        />
      </Wrapper>,
    )
    const input = screen.getByLabelText('Name')
    fireEvent.change(input, { target: { value: 'Alice' } })
    expect(input).toHaveValue('Alice')
  })

  it('shows validation errors after failed submit', async () => {
    render(
      <Wrapper>
        <FormBuilder
          fields={[
            {
              name: 'email',
              type: 'text',
              label: 'Email',
              validation: Schema.String.pipe(Schema.minLength(1)),
            },
          ]}
          onSubmit={() => Effect.void}
        >
          <button type="submit">Submit</button>
        </FormBuilder>
      </Wrapper>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('does not show errors before first submit attempt', () => {
    render(
      <Wrapper>
        <FormBuilder
          fields={[
            {
              name: 'email',
              type: 'text',
              label: 'Email',
              validation: Schema.String.pipe(Schema.minLength(1)),
            },
          ]}
          onSubmit={() => Effect.void}
        />
      </Wrapper>,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('calls onSubmit with current values on valid submit', async () => {
    const onSubmit = vi.fn().mockReturnValue(Effect.void)

    render(
      <Wrapper>
        <FormBuilder
          fields={[{ name: 'name', type: 'text', label: 'Name' }]}
          onSubmit={onSubmit}
        >
          <button type="submit">Submit</button>
        </FormBuilder>
      </Wrapper>,
    )

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Alice' })
    })
  })

  it('resets form after successful submit', async () => {
    render(
      <Wrapper>
        <FormBuilder
          fields={[{ name: 'name', type: 'text', label: 'Name' }]}
          onSubmit={() => Effect.void}
        >
          <button type="submit">Submit</button>
        </FormBuilder>
      </Wrapper>,
    )

    const input = screen.getByLabelText('Name')
    fireEvent.change(input, { target: { value: 'Alice' } })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('re-validates on change after first submit', async () => {
    render(
      <Wrapper>
        <FormBuilder
          fields={[
            {
              name: 'email',
              type: 'text',
              label: 'Email',
              validation: Schema.String.pipe(Schema.minLength(1)),
            },
          ]}
          onSubmit={() => Effect.void}
        >
          <button type="submit">Submit</button>
        </FormBuilder>
      </Wrapper>,
    )

    // Trigger submit to show error
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())

    // Fix the value
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'valid@example.com' } })
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })

  it('throws at render time if component type is not registered', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <GoodFormProvider components={{}}>
          <FormBuilder
            fields={[{ name: 'email', type: 'text', label: 'Email' }]}
            onSubmit={() => Effect.void}
          />
        </GoodFormProvider>,
      ),
    ).toThrow("goodform: no component registered for field type 'text'")
    consoleSpy.mockRestore()
  })

  it('renders children inside the form', () => {
    render(
      <Wrapper>
        <FormBuilder
          fields={[]}
          onSubmit={() => Effect.void}
        >
          <button type="submit">Submit</button>
        </FormBuilder>
      </Wrapper>,
    )
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })
})
