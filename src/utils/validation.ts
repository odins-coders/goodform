import * as Schema from 'effect/Schema'
import { ArrayFormatter } from 'effect/ParseResult'
import type { FieldDefinition } from '../types/fields'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySchema = Schema.Schema<any, any, never>

export const validateField = (
  value: unknown,
  schema: AnySchema,
): string | undefined => {
  const result = Schema.decodeUnknownEither(schema)(value)
  if (result._tag === 'Left') {
    const issues = ArrayFormatter.formatIssueSync(result.left.issue)
    return issues[0]?.message ?? 'Invalid value'
  }
  return undefined
}

export const validateForm = (
  values: Record<string, unknown>,
  fields: FieldDefinition[],
): Record<string, string | undefined> => {
  const errors: Record<string, string | undefined> = {}
  for (const field of fields) {
    if (field.validation) {
      errors[field.name] = validateField(values[field.name], field.validation)
    }
  }
  return errors
}
