import { createContext, useContext, type ReactNode } from 'react'
import type { GoodFormComponents } from '../types/fields'

const RegistryContext = createContext<GoodFormComponents | null>(null)

type GoodFormProviderProps = {
  components: GoodFormComponents
  children: ReactNode
}

export function GoodFormProvider({ components, children }: GoodFormProviderProps) {
  return <RegistryContext.Provider value={components}>{children}</RegistryContext.Provider>
}

export function useRegistry() {
  const components = useContext(RegistryContext)
  if (components === null) {
    throw new Error('goodform: useRegistry must be used inside GoodFormProvider')
  }
  return function getComponent<T extends keyof GoodFormComponents>(
    type: T,
  ): NonNullable<GoodFormComponents[T]> {
    const component = components[type]
    if (!component) {
      throw new Error(`goodform: no component registered for field type '${type}'`)
    }
    return component as NonNullable<GoodFormComponents[T]>
  }
}
