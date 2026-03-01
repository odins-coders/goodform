import { createContext, useContext } from 'react'
import { FormStore } from './FormStore'

export const FormStoreContext = createContext<FormStore | null>(null)

export function useFormStore(): FormStore {
  const store = useContext(FormStoreContext)
  if (!store) {
    throw new Error('useFormStore must be used within a FormBuilder')
  }
  return store
}
