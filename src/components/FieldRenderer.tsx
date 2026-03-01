import { memo, useCallback, useSyncExternalStore } from 'react'
import type { FieldDefinition, FieldValue } from '../types'
import { useFieldRegistry } from '../hooks/useFormFieldRegistry'
import { useFormStore } from '../store/FormStoreContext'

function FieldRendererInner(props: FieldDefinition) {
  const registry = useFieldRegistry()
  const store = useFormStore()

  const { value, options } = useSyncExternalStore(
    store.subscribeToField(props.name),
    store.getFieldSnapshot(props.name),
  )

  const onChange = useCallback(
    (newValue: FieldValue) => store.setFieldValue(props.name, newValue),
    [store, props.name],
  )

  switch (props.type) {
    case 'text':
      return registry.text({
        label: props.label,
        name: props.name,
        value: (value as string) ?? '',
        onChange: onChange as (v: string) => void,
      })
    case 'select':
      return registry.select({
        label: props.label,
        name: props.name,
        options,
        value: (value as string) ?? '',
        onChange: onChange as (v: string) => void,
      })
    case 'radio':
      return registry.radio({
        label: props.label,
        name: props.name,
        options,
        value: (value as string) ?? '',
        onChange: onChange as (v: string) => void,
      })
    case 'checkbox':
      return registry.checkbox({
        label: props.label,
        name: props.name,
        options,
        value: (value as string[]) ?? [],
        onChange: onChange as (v: string[]) => void,
      })
  }
}

export const FieldRenderer = memo(FieldRendererInner)
