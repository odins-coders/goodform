import { describe, it, expect, vi } from 'vitest'
import { FormStore } from './FormStore'

describe('FormStore', () => {
  describe('initial state', () => {
    it('initialises values from field defaultValue', () => {
      const store = new FormStore([
        { type: 'text', name: 'name', label: 'Name', defaultValue: 'Alice' },
      ])
      expect(store.getValues()).toEqual({ name: 'Alice' })
    })

    it('overrides field defaultValue with defaultValues prop', () => {
      const store = new FormStore(
        [{ type: 'text', name: 'name', label: 'Name', defaultValue: 'Alice' }],
        { name: 'Bob' },
      )
      expect(store.getValues()).toEqual({ name: 'Bob' })
    })

    it('defaults to null when no defaultValue', () => {
      const store = new FormStore([{ type: 'text', name: 'name', label: 'Name' }])
      expect(store.getValues()).toEqual({ name: null })
    })
  })

  describe('setFieldValue', () => {
    it('updates the field value', () => {
      const store = new FormStore([{ type: 'text', name: 'name', label: 'Name' }])
      store.setFieldValue('name', 'Charlie')
      expect(store.getValues()).toEqual({ name: 'Charlie' })
    })

    it('notifies subscribers on change', () => {
      const store = new FormStore([{ type: 'text', name: 'name', label: 'Name' }])
      const cb = vi.fn()
      const unsub = store.subscribeToField('name')(cb)
      store.setFieldValue('name', 'Dave')
      expect(cb).toHaveBeenCalledTimes(1)
      unsub()
    })

    it('does not notify after unsubscribe', () => {
      const store = new FormStore([{ type: 'text', name: 'name', label: 'Name' }])
      const cb = vi.fn()
      const unsub = store.subscribeToField('name')(cb)
      unsub()
      store.setFieldValue('name', 'Eve')
      expect(cb).not.toHaveBeenCalled()
    })

    it('updates snapshot reference on change', () => {
      const store = new FormStore([{ type: 'text', name: 'name', label: 'Name' }])
      const snap1 = store.getFieldSnapshot('name')()
      store.setFieldValue('name', 'Frank')
      const snap2 = store.getFieldSnapshot('name')()
      expect(snap1).not.toBe(snap2)
      expect(snap2.value).toBe('Frank')
    })

    it('keeps same snapshot reference when value unchanged', () => {
      const store = new FormStore([
        { type: 'text', name: 'name', label: 'Name', defaultValue: 'Grace' },
      ])
      const snap1 = store.getFieldSnapshot('name')()
      store.setFieldValue('name', 'Grace') // same value
      const snap2 = store.getFieldSnapshot('name')()
      expect(snap1).toBe(snap2)
    })
  })

  describe('subscribeToField', () => {
    it('returns stable subscribe reference per field', () => {
      const store = new FormStore([{ type: 'text', name: 'name', label: 'Name' }])
      expect(store.subscribeToField('name')).toBe(store.subscribeToField('name'))
    })
  })

  describe('getFieldSnapshot', () => {
    it('returns stable snapshot getter reference per field', () => {
      const store = new FormStore([{ type: 'text', name: 'name', label: 'Name' }])
      expect(store.getFieldSnapshot('name')).toBe(store.getFieldSnapshot('name'))
    })
  })

  describe('dependency propagation', () => {
    it('auto-resets dependent value when watched field changes', () => {
      const store = new FormStore([
        { type: 'text', name: 'country', label: 'Country' },
        {
          type: 'text',
          name: 'city',
          label: 'City',
          defaultValue: 'Austin',
          dependsOn: { value: { on: ['country'] } },
        },
      ])
      store.setFieldValue('country', 'UK')
      expect(store.getValues().city).toBeNull()
    })

    it('computes dependent value when watched field changes', () => {
      const store = new FormStore([
        { type: 'text', name: 'firstName', label: 'First Name' },
        { type: 'text', name: 'lastName', label: 'Last Name' },
        {
          type: 'text',
          name: 'fullName',
          label: 'Full Name',
          dependsOn: {
            value: {
              on: ['firstName', 'lastName'],
              compute: ({ firstName, lastName }) =>
                [firstName, lastName].filter(Boolean).join(' ') || null,
            },
          },
        },
      ])
      store.setFieldValue('firstName', 'John')
      store.setFieldValue('lastName', 'Doe')
      expect(store.getValues().fullName).toBe('John Doe')
    })

    it('updates dependent options when watched field changes', () => {
      const store = new FormStore([
        { type: 'select', name: 'country', label: 'Country', options: ['USA', 'Canada'] },
        {
          type: 'select',
          name: 'region',
          label: 'Region',
          options: [],
          dependsOn: {
            options: {
              on: ['country'],
              compute: ({ country }) => {
                if (country === 'USA') return ['California', 'Texas']
                if (country === 'Canada') return ['Ontario', 'Quebec']
                return []
              },
            },
          },
        },
      ])
      store.setFieldValue('country', 'USA')
      expect(store.getFieldSnapshot('region')().options).toEqual(['California', 'Texas'])
      store.setFieldValue('country', 'Canada')
      expect(store.getFieldSnapshot('region')().options).toEqual(['Ontario', 'Quebec'])
    })

    it('does not notify dependent when options are unchanged (same contents)', () => {
      const store = new FormStore([
        { type: 'text', name: 'lang', label: 'Language' },
        {
          type: 'select',
          name: 'size',
          label: 'Size',
          options: [],
          dependsOn: {
            options: {
              on: ['lang'],
              compute: () => ['S', 'M', 'L'], // always same options
            },
          },
        },
      ])
      // Trigger once to set options
      store.setFieldValue('lang', 'en')
      const snap1 = store.getFieldSnapshot('size')()

      const cb = vi.fn()
      store.subscribeToField('size')(cb)
      store.setFieldValue('lang', 'fr') // same computed options
      expect(cb).not.toHaveBeenCalled()
      expect(store.getFieldSnapshot('size')()).toBe(snap1)
    })

    it('notifies dependent subscribers when value changes', () => {
      const store = new FormStore([
        { type: 'text', name: 'a', label: 'A' },
        {
          type: 'text',
          name: 'b',
          label: 'B',
          dependsOn: { value: { on: ['a'], compute: ({ a }) => (a ? String(a).toUpperCase() : null) } },
        },
      ])
      const cb = vi.fn()
      store.subscribeToField('b')(cb)
      store.setFieldValue('a', 'hello')
      expect(cb).toHaveBeenCalledTimes(1)
      expect(store.getValues().b).toBe('HELLO')
    })
  })
})
