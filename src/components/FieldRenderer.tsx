import type { FieldDefinition } from '../types'
import { useFieldRegistry } from '../hooks/useFormFieldRegistry'

type FieldRendererProps = FieldDefinition

export function FieldRenderer(props: FieldRendererProps) {
  const registry = useFieldRegistry()

  switch (props.type) {
    case 'text':
      return registry.text({ label: props.label, name: props.name })
    case 'select':
      return registry.select({ label: props.label, name: props.name, options: props.options })
    case 'radio':
      return registry.radio({ label: props.label, name: props.name, options: props.options })
    case 'checkbox':
      return registry.checkbox({ label: props.label, name: props.name, options: props.options })
    default:
      return null
  }
}