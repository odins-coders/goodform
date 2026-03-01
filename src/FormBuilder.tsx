import React, { useState } from 'react'
import { FieldRenderer } from './components/FieldRenderer'
import { FormStore } from './store/FormStore'
import { FormStoreContext } from './store/FormStoreContext'
import type { FormBuilderProps } from './types'

export function FormBuilder({ fields, onSubmit, defaultValues }: FormBuilderProps) {
  const [store] = useState(() => new FormStore(fields, defaultValues))

  const handleSubmit:React.SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSubmit(store.getValues())
  }

  return (
    <FormStoreContext.Provider value={store}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {fields.map(config => <FieldRenderer key={config.name} {...config} />)}
        </div>
        <button type="submit">Submit</button>
      </form>
    </FormStoreContext.Provider>
  )
}
