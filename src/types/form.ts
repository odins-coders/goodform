import type { ReactNode } from 'react'
import type { Effect } from 'effect'
import type { FieldDefinition } from './fields'

export type FieldValueMap = {
  text: string
  select: string
  switch: boolean
  radio: string
  datepicker: Date | null
}

export type InferFormValues<TFields extends FieldDefinition[]> = {
  [F in TFields[number] as F['name']]: FieldValueMap[F['type']]
}

export type FormBuilderProps<TFields extends FieldDefinition[]> = {
  fields: TFields
  onSubmit: (values: InferFormValues<TFields>) => Effect.Effect<void, unknown, never>
  children?: ReactNode
  disabled?: boolean
}
