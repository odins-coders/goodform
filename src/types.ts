export type FieldValue = string | string[] | null

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
}

export type FormBuilderProps = {
  fields: FieldDefinition[]
  onSubmit: (values: FormValues) => void
  defaultValues?: FormValues
}

export type FieldRegistry = {
  text:     (props: { label: string; name: string; value: string;    onChange: (v: string)   => void }) => React.ReactNode
  select:   (props: { label: string; name: string; options: string[]; value: string;    onChange: (v: string)   => void }) => React.ReactNode
  radio:    (props: { label: string; name: string; options: string[]; value: string;    onChange: (v: string)   => void }) => React.ReactNode
  checkbox: (props: { label: string; name: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) => React.ReactNode
}

export type TextFieldDefinition = {
  type: 'text'
  label: string
  name: string
  defaultValue?: string
  dependsOn?: FieldDependency
}

export type SelectFieldDefinition = {
  type: 'select'
  label: string
  name: string
  options: string[]
  defaultValue?: string
  dependsOn?: FieldDependency
}

export type RadioFieldDefinition = {
  type: 'radio'
  label: string
  name: string
  options: string[]
  defaultValue?: string
  dependsOn?: FieldDependency
}

export type CheckboxFieldDefinition = {
  type: 'checkbox'
  label: string
  name: string
  options: string[]
  defaultValue?: string[]
  dependsOn?: FieldDependency
}

export type FieldDefinition =
  | TextFieldDefinition
  | SelectFieldDefinition
  | RadioFieldDefinition
  | CheckboxFieldDefinition
