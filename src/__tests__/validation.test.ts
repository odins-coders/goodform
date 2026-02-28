import { describe, it, expect } from 'vitest'
import * as Schema from 'effect/Schema'
import { validateField, validateForm } from '../utils/validation'
import type { FieldDefinition } from '../types/fields'

describe('validateField', () => {
  it('returns undefined for a valid string', () => {
    expect(validateField('hello', Schema.String)).toBeUndefined()
  })

  it('returns an error message when value fails type check', () => {
    const error = validateField(123, Schema.String)
    expect(error).toBeDefined()
    expect(typeof error).toBe('string')
  })

  it('returns undefined when string passes minLength', () => {
    const schema = Schema.String.pipe(Schema.minLength(3))
    expect(validateField('hello', schema)).toBeUndefined()
  })

  it('returns an error when string is too short', () => {
    const schema = Schema.String.pipe(Schema.minLength(5))
    const error = validateField('hi', schema)
    expect(error).toBeDefined()
  })

  it('returns undefined for a valid number', () => {
    expect(validateField(42, Schema.Number)).toBeUndefined()
  })

  it('returns an error for an empty string with NonEmptyString', () => {
    const schema = Schema.String.pipe(Schema.minLength(1))
    const error = validateField('', schema)
    expect(error).toBeDefined()
  })
})

describe('validateForm', () => {
  it('returns errors for fields that fail validation', () => {
    const fields: FieldDefinition[] = [
      {
        name: 'email',
        type: 'text',
        validation: Schema.String.pipe(Schema.minLength(1)),
      },
    ]
    const errors = validateForm({ email: '' }, fields)
    expect(errors.email).toBeDefined()
  })

  it('returns undefined for fields that pass validation', () => {
    const fields: FieldDefinition[] = [
      {
        name: 'email',
        type: 'text',
        validation: Schema.String.pipe(Schema.minLength(1)),
      },
    ]
    const errors = validateForm({ email: 'user@example.com' }, fields)
    expect(errors.email).toBeUndefined()
  })

  it('skips fields without a validation schema', () => {
    const fields: FieldDefinition[] = [
      { name: 'name', type: 'text' },
    ]
    const errors = validateForm({ name: '' }, fields)
    expect(errors.name).toBeUndefined()
  })

  it('validates multiple fields independently', () => {
    const fields: FieldDefinition[] = [
      {
        name: 'first',
        type: 'text',
        validation: Schema.String.pipe(Schema.minLength(1)),
      },
      {
        name: 'second',
        type: 'text',
        validation: Schema.String.pipe(Schema.minLength(1)),
      },
    ]
    const errors = validateForm({ first: '', second: 'valid' }, fields)
    expect(errors.first).toBeDefined()
    expect(errors.second).toBeUndefined()
  })
})
