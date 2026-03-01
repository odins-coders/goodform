export type FormBuilderProps = {
  fields: any[];
  onSubmit: (values: Record<string, unknown>) => void;
}

export type FieldRegistry = {
  text: (props: { label: string, name: string }) => React.ReactNode;
  select: (props: { label: string, name: string, options: string[] }) => React.ReactNode;
  radio: (props: { label: string, name: string, options: string[] }) => React.ReactNode;
  checkbox: (props: { label: string, name: string, options: string[] }) => React.ReactNode;
}

export type TextFieldDefinition = {
  type: 'text';
  label: string;
  name: string;
}

export type SelectFieldDefinition = {
  type: 'select';
  label: string;
  name: string;
  options: string[];
}

export type RadioFieldDefinition = {
  type: 'radio';
  label: string;
  name: string;
  options: string[];
}

export type CheckboxFieldDefinition = {
  type: 'checkbox';
  label: string;
  name: string;
  options: string[];
}

export type FieldDefinition = TextFieldDefinition | SelectFieldDefinition | RadioFieldDefinition | CheckboxFieldDefinition;