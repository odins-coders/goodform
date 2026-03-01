import React from 'react'
import { FieldRenderer } from './components/FieldRenderer';
import { FieldDefinition } from './types';

type FormBuilderProps = {
  fields: FieldDefinition[];
  onSubmit: (values: Record<string, unknown>) => void;
}

export function FormBuilder({ fields, onSubmit }: FormBuilderProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(event)
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid red' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {fields.map(config => {
          return <FieldRenderer key={config.name} {...config} />
        })}
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
