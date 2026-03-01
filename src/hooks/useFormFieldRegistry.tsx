import { createContext, useContext, ReactNode } from 'react'
import type { FieldRegistry } from '../types'

type FieldRegistryProviderProps = {
  value: FieldRegistry
  children: ReactNode
}

const FieldRegistryContext = createContext<FieldRegistry | undefined>(undefined)

export function FieldRegistryProvider({ value, children }: FieldRegistryProviderProps) {
  return (
    <FieldRegistryContext.Provider value={value}>
      {children}
    </FieldRegistryContext.Provider>
  )
}

export function useFieldRegistry(): FieldRegistry {
  const context = useContext(FieldRegistryContext)
  if (!context) {
    throw new Error('useFieldRegistry must be used within a FieldRegistryProvider')
  }
  return context
}