import { createContext, useContext } from 'react'

export type GoodFormContextValue = {
  isSubmitting: boolean
  submitError: unknown
  hasSubmitted: boolean
}

export const FormContext = createContext<GoodFormContextValue | null>(null)

export function useGoodFormContext(): GoodFormContextValue {
  const context = useContext(FormContext)
  if (context === null) {
    throw new Error('goodform: useGoodFormContext must be used inside a FormBuilder')
  }
  return context
}
