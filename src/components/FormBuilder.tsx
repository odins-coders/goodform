import { type FormEvent } from 'react'
import * as Effect from 'effect/Effect'
import { useRegistry } from '../context/RegistryContext'
import { FormContext } from '../context/FormContext'
import { useFormState } from '../hooks/useFormState'
import { validateField, validateForm } from '../utils/validation'
import type { FieldDefinition } from '../types/fields'
import type { FormBuilderProps, InferFormValues } from '../types/form'

export function FormBuilder<TFields extends FieldDefinition[]>({
  fields,
  onSubmit,
  children,
  disabled,
}: FormBuilderProps<TFields>) {
  const getComponent = useRegistry()
  const { state, dispatch } = useFormState(fields)

  function handleChange(name: string, value: unknown) {
    dispatch({ type: 'SET_VALUE', name, value })
    dispatch({ type: 'SET_TOUCHED', name })
    if (state.hasSubmitted) {
      const field = fields.find((f) => f.name === name)
      if (field?.validation) {
        const error = validateField(value, field.validation)
        dispatch({ type: 'SET_ERRORS', errors: { ...state.errors, [name]: error } })
      }
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    dispatch({ type: 'SET_SUBMITTING', value: true })

    const errors = validateForm(state.values, fields)
    const hasErrors = Object.values(errors).some((e) => e !== undefined)
    if (hasErrors) {
      dispatch({ type: 'SET_ERRORS', errors })
      dispatch({ type: 'SET_SUBMITTING', value: false })
      return
    }

    try {
      await Effect.runPromise(onSubmit(state.values as InferFormValues<TFields>))
      dispatch({ type: 'RESET' })
    } catch (error) {
      dispatch({ type: 'SET_SUBMIT_ERROR', error })
    }
  }

  function renderField(field: FieldDefinition) {
    const error = state.errors[field.name]
    const isDisabled = disabled || field.disabled

    switch (field.type) {
      case 'text': {
        const Component = getComponent('text')
        return (
          <Component
            key={field.name}
            name={field.name}
            value={state.values[field.name] as string}
            onChange={(value) => handleChange(field.name, value)}
            error={error}
            label={field.label}
            placeholder={field.placeholder}
            disabled={isDisabled}
          />
        )
      }
      case 'select': {
        const Component = getComponent('select')
        return (
          <Component
            key={field.name}
            name={field.name}
            value={state.values[field.name] as string}
            onChange={(value) => handleChange(field.name, value)}
            error={error}
            label={field.label}
            options={field.options}
            disabled={isDisabled}
          />
        )
      }
      case 'switch': {
        const Component = getComponent('switch')
        return (
          <Component
            key={field.name}
            name={field.name}
            value={state.values[field.name] as boolean}
            onChange={(value) => handleChange(field.name, value)}
            error={error}
            label={field.label}
            disabled={isDisabled}
          />
        )
      }
      case 'radio': {
        const Component = getComponent('radio')
        return (
          <Component
            key={field.name}
            name={field.name}
            value={state.values[field.name] as string}
            onChange={(value) => handleChange(field.name, value)}
            error={error}
            label={field.label}
            options={field.options}
            disabled={isDisabled}
          />
        )
      }
      case 'datepicker': {
        const Component = getComponent('datepicker')
        return (
          <Component
            key={field.name}
            name={field.name}
            value={state.values[field.name] as Date | null}
            onChange={(value) => handleChange(field.name, value)}
            error={error}
            label={field.label}
            disabled={isDisabled}
            minDate={field.minDate}
            maxDate={field.maxDate}
          />
        )
      }
    }
  }

  const contextValue = {
    isSubmitting: state.isSubmitting,
    submitError: state.submitError,
    hasSubmitted: state.hasSubmitted,
  }

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit}>
        {fields.map(renderField)}
        {children}
      </form>
    </FormContext.Provider>
  )
}
