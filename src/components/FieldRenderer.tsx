import { memo, useCallback, useSyncExternalStore } from 'react'
import type { FieldDefinition, FieldValue } from '../types'
import { useFieldRegistry } from '../hooks/useFormFieldRegistry'
import { useFormStore } from '../store/FormStoreContext'

function FieldRendererInner(props: FieldDefinition) {
  const registry = useFieldRegistry()
  const store = useFormStore()

  const { value, options, visible, disabled } = useSyncExternalStore(
    store.subscribeToField(props.name),
    store.getFieldSnapshot(props.name),
  )

  const onChange = useCallback(
    (newValue: FieldValue) => store.setFieldValue(props.name, newValue),
    [store, props.name],
  )

  if (!visible) return null

  switch (props.type) {
    case 'text':
      return registry.text({
        label: props.label,
        name: props.name,
        value: (value as string) ?? '',
        onChange: onChange as (v: string) => void,
        disabled,
      })
    case 'select':
      return registry.select({
        label: props.label,
        name: props.name,
        options,
        value: (value as string) ?? '',
        onChange: onChange as (v: string) => void,
        disabled,
      })
    case 'radio':
      return registry.radio({
        label: props.label,
        name: props.name,
        options,
        value: (value as string) ?? '',
        onChange: onChange as (v: string) => void,
        disabled,
      })
    case 'checkbox':
      return registry.checkbox({
        label: props.label,
        name: props.name,
        options,
        value: (value as string[]) ?? [],
        onChange: onChange as (v: string[]) => void,
        disabled,
      })
    case 'multiselect':
      return registry.multiselect({
        label: props.label,
        name: props.name,
        options,
        value: (value as string[]) ?? [],
        onChange: onChange as (v: string[]) => void,
        disabled,
      })
    case 'date':
      return registry.date({
        label: props.label,
        name: props.name,
        value: (value as Date | null) ?? null,
        onChange: onChange as (v: Date | null) => void,
        disabled,
      })
    case 'switch':
      return registry.switch({
        label: props.label,
        name: props.name,
        value: (value as boolean) ?? false,
        onChange: onChange as (v: boolean) => void,
        disabled,
      })
    case 'number':
      return registry.number({
        label: props.label,
        name: props.name,
        value: (value as number | null) ?? null,
        onChange: onChange as (v: number | null) => void,
        format: props.format,
        step: props.step,
        min: props.min,
        max: props.max,
        disabled,
      })
  }
}

export const FieldRenderer = memo(FieldRendererInner)
