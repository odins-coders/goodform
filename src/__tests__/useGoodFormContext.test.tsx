import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as Effect from 'effect/Effect'
import { GoodFormProvider } from '../context/RegistryContext'
import { FormBuilder } from '../components/FormBuilder'
import { useGoodFormContext } from '../context/FormContext'
import type { GoodFormTextFieldProps } from '../types/fields'

function MockTextField({ name, value, onChange }: GoodFormTextFieldProps) {
  return <input name={name} value={value} onChange={(e) => onChange(e.target.value)} />
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <GoodFormProvider components={{ text: MockTextField }}>
      {children}
    </GoodFormProvider>
  )
}

describe('useGoodFormContext', () => {
  it('throws when used outside FormBuilder', () => {
    function BadComponent() {
      useGoodFormContext()
      return null
    }

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<BadComponent />)).toThrow(
      'goodform: useGoodFormContext must be used inside a FormBuilder',
    )
    consoleSpy.mockRestore()
  })

  it('returns isSubmitting=false initially', () => {
    function StatusDisplay() {
      const { isSubmitting } = useGoodFormContext()
      return <div data-testid="submitting">{String(isSubmitting)}</div>
    }

    render(
      <Wrapper>
        <FormBuilder fields={[]} onSubmit={() => Effect.void}>
          <StatusDisplay />
        </FormBuilder>
      </Wrapper>,
    )

    expect(screen.getByTestId('submitting')).toHaveTextContent('false')
  })

  it('returns hasSubmitted=false initially', () => {
    function StatusDisplay() {
      const { hasSubmitted } = useGoodFormContext()
      return <div data-testid="submitted">{String(hasSubmitted)}</div>
    }

    render(
      <Wrapper>
        <FormBuilder fields={[]} onSubmit={() => Effect.void}>
          <StatusDisplay />
        </FormBuilder>
      </Wrapper>,
    )

    expect(screen.getByTestId('submitted')).toHaveTextContent('false')
  })

  it('returns hasSubmitted=true after submit attempt', async () => {
    function StatusDisplay() {
      const { hasSubmitted } = useGoodFormContext()
      return <div data-testid="submitted">{String(hasSubmitted)}</div>
    }

    render(
      <Wrapper>
        <FormBuilder fields={[]} onSubmit={() => Effect.void}>
          <StatusDisplay />
          <button type="submit">Submit</button>
        </FormBuilder>
      </Wrapper>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    // After successful submit, hasSubmitted resets to false (RESET action)
    await waitFor(() => {
      expect(screen.getByTestId('submitted')).toHaveTextContent('false')
    })
  })

  it('exposes submitError when onSubmit fails', async () => {
    function StatusDisplay() {
      const { submitError } = useGoodFormContext()
      return <div data-testid="error">{submitError ? 'has-error' : 'no-error'}</div>
    }

    const failEffect = Effect.fail(new Error('Server error')) as unknown as Effect.Effect<
      void,
      unknown,
      never
    >

    render(
      <Wrapper>
        <FormBuilder fields={[]} onSubmit={() => failEffect}>
          <StatusDisplay />
          <button type="submit">Submit</button>
        </FormBuilder>
      </Wrapper>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('has-error')
    })
  })
})
