export type FieldValue = string | string[] | boolean | Date | null

export type FormValues = Record<string, FieldValue>

export type FieldDependency = {
  value?: {
    on: string[]
    compute?: (depValues: FormValues) => FieldValue
  }
  options?: {
    on: string[]
    compute: (depValues: FormValues) => string[]
  }
  visible?: {
    on: string[]
    compute: (depValues: FormValues) => boolean
  }
  disabled?: {
    on: string[]
    compute: (depValues: FormValues) => boolean
  }
}

export type FormBuilderProps = {
  fields: FieldDefinition[]
  onSubmit: (values: FormValues) => void
  defaultValues?: FormValues
}

export type FieldRegistry = {
  text:     (props: { label: string; name: string; value: string;    onChange: (v: string)   => void; disabled?: boolean }) => React.ReactNode
  select:   (props: { label: string; name: string; options: string[]; value: string;    onChange: (v: string)   => void; disabled?: boolean }) => React.ReactNode
  radio:    (props: { label: string; name: string; options: string[]; value: string;    onChange: (v: string)   => void; disabled?: boolean }) => React.ReactNode
  checkbox:     (props: { label: string; name: string; options: string[]; value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) => React.ReactNode
  multiselect:  (props: { label: string; name: string; options: string[]; value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) => React.ReactNode
  date:         (props: { label: string; name: string; value: Date | null; onChange: (v: Date | null) => void; disabled?: boolean }) => React.ReactNode
  switch:       (props: { label: string; name: string; value: boolean;     onChange: (v: boolean)     => void; disabled?: boolean }) => React.ReactNode
}

export type TextFieldDefinition = {
  type: 'text'
  label: string
  name: string
  visible?: boolean
  disabled?: boolean
  defaultValue?: string
  dependsOn?: FieldDependency
}

export type SelectFieldDefinition = {
  type: 'select'
  label: string
  name: string
  options: string[]
  visible?: boolean
  disabled?: boolean
  defaultValue?: string
  dependsOn?: FieldDependency
}

export type RadioFieldDefinition = {
  type: 'radio'
  label: string
  name: string
  options: string[]
  visible?: boolean
  disabled?: boolean
  defaultValue?: string
  dependsOn?: FieldDependency
}

export type CheckboxFieldDefinition = {
  type: 'checkbox'
  label: string
  name: string
  options: string[]
  visible?: boolean
  disabled?: boolean
  defaultValue?: string[]
  dependsOn?: FieldDependency
}

export type DateFieldDefinition = {
  type: 'date'
  label: string
  name: string
  visible?: boolean
  disabled?: boolean
  defaultValue?: Date
  dependsOn?: FieldDependency
}

export type MultiSelectFieldDefinition = {
  type: 'multiselect'
  label: string
  name: string
  options: string[]
  visible?: boolean
  disabled?: boolean
  defaultValue?: string[]
  dependsOn?: FieldDependency
}

export type SwitchFieldDefinition = {
  type: 'switch'
  label: string
  name: string
  visible?: boolean
  disabled?: boolean
  defaultValue?: boolean
  dependsOn?: FieldDependency
}

export type FieldDefinition =
  | TextFieldDefinition
  | SelectFieldDefinition
  | RadioFieldDefinition
  | CheckboxFieldDefinition
  | MultiSelectFieldDefinition
  | DateFieldDefinition
  | SwitchFieldDefinition
