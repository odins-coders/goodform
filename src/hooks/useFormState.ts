import { useReducer, useRef } from 'react'
import type { FieldDefinition } from '../types/fields'

export type FormState = {
  values: Record<string, unknown>
  errors: Record<string, string | undefined>
  touched: Record<string, boolean>
  isSubmitting: boolean
  submitError: unknown
  hasSubmitted: boolean
}

type FormAction =
  | { type: 'SET_VALUE'; name: string; value: unknown }
  | { type: 'SET_ERRORS'; errors: Record<string, string | undefined> }
  | { type: 'SET_TOUCHED'; name: string }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_SUBMIT_ERROR'; error: unknown }
  | { type: 'RESET' }

function buildInitialValues(fields: FieldDefinition[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.type === 'switch') {
      values[field.name] = field.defaultValue ?? false
    } else if (field.type === 'datepicker') {
      values[field.name] = field.defaultValue ?? null
    } else {
      values[field.name] = (field as { defaultValue?: string }).defaultValue ?? ''
    }
  }
  return values
}

function buildInitialState(fields: FieldDefinition[]): FormState {
  return {
    values: buildInitialValues(fields),
    errors: {},
    touched: {},
    isSubmitting: false,
    submitError: undefined,
    hasSubmitted: false,
  }
}

function reducer(initialState: FormState) {
  return function (state: FormState, action: FormAction): FormState {
    switch (action.type) {
      case 'SET_VALUE':
        return { ...state, values: { ...state.values, [action.name]: action.value } }
      case 'SET_ERRORS':
        return { ...state, errors: action.errors }
      case 'SET_TOUCHED':
        return { ...state, touched: { ...state.touched, [action.name]: true } }
      case 'SET_SUBMITTING':
        return {
          ...state,
          isSubmitting: action.value,
          hasSubmitted: action.value ? true : state.hasSubmitted,
        }
      case 'SET_SUBMIT_ERROR':
        return { ...state, submitError: action.error, isSubmitting: false }
      case 'RESET':
        return initialState
    }
  }
}

export function useFormState(fields: FieldDefinition[]) {
  const initialStateRef = useRef<FormState | null>(null)
  if (initialStateRef.current === null) {
    initialStateRef.current = buildInitialState(fields)
  }

  const reducerFn = useRef(reducer(initialStateRef.current))

  const [state, dispatch] = useReducer(reducerFn.current, initialStateRef.current)

  return { state, dispatch }
}
