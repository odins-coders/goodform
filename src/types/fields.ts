import type { ComponentType } from 'react'
import type * as Schema from 'effect/Schema'

export type GoodFormSelectOption = { label: string; value: string }
export type GoodFormRadioOption = { label: string; value: string }

export type GoodFormTextFieldProps = {
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
  placeholder?: string
  disabled?: boolean
}

export type GoodFormSelectFieldProps = {
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
  options: GoodFormSelectOption[]
  disabled?: boolean
}

export type GoodFormSwitchFieldProps = {
  name: string
  value: boolean
  onChange: (value: boolean) => void
  error?: string
  label?: string
  disabled?: boolean
}

export type GoodFormRadioFieldProps = {
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
  options: GoodFormRadioOption[]
  disabled?: boolean
}

export type GoodFormDatePickerFieldProps = {
  name: string
  value: Date | null
  onChange: (value: Date | null) => void
  error?: string
  label?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
}

export type GoodFormComponents = {
  text?: ComponentType<GoodFormTextFieldProps>
  select?: ComponentType<GoodFormSelectFieldProps>
  switch?: ComponentType<GoodFormSwitchFieldProps>
  radio?: ComponentType<GoodFormRadioFieldProps>
  datepicker?: ComponentType<GoodFormDatePickerFieldProps>
}

export type TextFieldDef = {
  name: string
  type: 'text'
  label?: string
  placeholder?: string
  defaultValue?: string
  disabled?: boolean
  validation?: Schema.Schema<string, string>
}

export type SelectFieldDef = {
  name: string
  type: 'select'
  label?: string
  options: GoodFormSelectOption[]
  defaultValue?: string
  disabled?: boolean
  validation?: Schema.Schema<string, string>
}

export type SwitchFieldDef = {
  name: string
  type: 'switch'
  label?: string
  defaultValue?: boolean
  disabled?: boolean
  validation?: Schema.Schema<boolean, boolean>
}

export type RadioFieldDef = {
  name: string
  type: 'radio'
  label?: string
  options: GoodFormRadioOption[]
  defaultValue?: string
  disabled?: boolean
  validation?: Schema.Schema<string, string>
}

export type DatePickerFieldDef = {
  name: string
  type: 'datepicker'
  label?: string
  minDate?: Date
  maxDate?: Date
  defaultValue?: Date | null
  disabled?: boolean
  validation?: Schema.Schema<Date | null, Date | null>
}

export type FieldDefinition =
  | TextFieldDef
  | SelectFieldDef
  | SwitchFieldDef
  | RadioFieldDef
  | DatePickerFieldDef
