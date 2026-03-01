import type { FieldDefinition, FieldDependency, FormValues, FieldValue } from '../types'

export type FieldSnapshot = {
  value: FieldValue
  options: string[]
}

type DependentEdge = {
  field: string
  concern: 'value' | 'options'
}

function shallowEqualArrays(a: string[], b: string[]): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export class FormStore {
  private _values: Map<string, FieldValue> = new Map()
  private _options: Map<string, string[]> = new Map()
  private _snapshots: Map<string, FieldSnapshot> = new Map()
  private _subscribers: Map<string, Set<() => void>> = new Map()
  private _dependents: Map<string, DependentEdge[]> = new Map()
  private _fields: Map<string, FieldDefinition> = new Map()

  // Stable memoised references per field
  private _subscribeRefs: Map<string, (cb: () => void) => () => void> = new Map()
  private _snapshotRefs: Map<string, () => FieldSnapshot> = new Map()

  constructor(fields: FieldDefinition[], defaultValues?: FormValues) {
    // Register fields
    for (const field of fields) {
      this._fields.set(field.name, field)
      this._subscribers.set(field.name, new Set())
    }

    // Initialise values from field defaultValue then override with defaultValues
    for (const field of fields) {
      const fieldDefault = 'defaultValue' in field ? field.defaultValue ?? null : null
      this._values.set(field.name, fieldDefault as FieldValue)
    }
    if (defaultValues) {
      for (const [name, value] of Object.entries(defaultValues)) {
        if (this._values.has(name)) {
          this._values.set(name, value)
        }
      }
    }

    // Initialise static options
    for (const field of fields) {
      if ('options' in field && !('dependsOn' in field && (field as any).dependsOn?.options)) {
        this._options.set(field.name, (field as any).options ?? [])
      } else {
        this._options.set(field.name, [])
      }
    }

    // Build reverse adjacency map
    this._buildDependentsMap(fields)

    // Resolve initial options for fields with computed options
    for (const field of fields) {
      const dep = ('dependsOn' in field ? (field as any).dependsOn : undefined) as FieldDependency | undefined
      if (dep?.options) {
        const depValues = this._collectDepValues(dep.options.on)
        const resolved = dep.options.compute(depValues)
        this._options.set(field.name, resolved)
      }
    }

    // Resolve initial computed values
    for (const field of fields) {
      const dep = ('dependsOn' in field ? (field as any).dependsOn : undefined) as FieldDependency | undefined
      if (dep?.value?.compute) {
        const depValues = this._collectDepValues(dep.value.on)
        const computed = dep.value.compute(depValues)
        this._values.set(field.name, computed)
      }
    }

    // Pre-build snapshots
    for (const field of fields) {
      this._snapshots.set(field.name, {
        value: this._values.get(field.name) ?? null,
        options: this._options.get(field.name) ?? [],
      })
    }
  }

  private _buildDependentsMap(fields: FieldDefinition[]): void {
    for (const field of fields) {
      const dep = ('dependsOn' in field ? (field as any).dependsOn : undefined) as FieldDependency | undefined
      if (!dep) continue

      if (dep.value?.on) {
        for (const watchedField of dep.value.on) {
          const edges = this._dependents.get(watchedField) ?? []
          edges.push({ field: field.name, concern: 'value' })
          this._dependents.set(watchedField, edges)
        }
      }

      if (dep.options?.on) {
        for (const watchedField of dep.options.on) {
          const edges = this._dependents.get(watchedField) ?? []
          edges.push({ field: field.name, concern: 'options' })
          this._dependents.set(watchedField, edges)
        }
      }
    }
  }

  private _collectDepValues(names: string[]): FormValues {
    const result: FormValues = {}
    for (const name of names) {
      result[name] = this._values.get(name) ?? null
    }
    return result
  }

  private _notify(name: string): void {
    // Rebuild snapshot
    const prev = this._snapshots.get(name)
    const value = this._values.get(name) ?? null
    const options = this._options.get(name) ?? []
    if (prev && prev.value === value && prev.options === options) return
    this._snapshots.set(name, { value, options })
    const subs = this._subscribers.get(name)
    if (subs) {
      for (const cb of subs) cb()
    }
  }

  private _propagateDependents(changedField: string): void {
    // BFS
    const queue: string[] = [changedField]
    const visited = new Set<string>()

    while (queue.length > 0) {
      const current = queue.shift()!
      if (visited.has(current)) continue
      visited.add(current)

      const edges = this._dependents.get(current) ?? []
      // Collect unique dependent fields to update
      const depFields = new Set(edges.map(e => e.field))

      for (const depField of depFields) {
        const fieldDef = this._fields.get(depField)
        if (!fieldDef) continue
        const dep = ('dependsOn' in fieldDef ? (fieldDef as any).dependsOn : undefined) as FieldDependency | undefined
        if (!dep) continue

        let changed = false

        // Update options if this edge is relevant
        if (dep.options?.on.includes(current)) {
          const depValues = this._collectDepValues(dep.options.on)
          const newOptions = dep.options.compute(depValues)
          const prevOptions = this._options.get(depField) ?? []
          if (!shallowEqualArrays(prevOptions, newOptions)) {
            this._options.set(depField, newOptions)
            changed = true
          }
        }

        // Update value if this edge is relevant
        if (dep.value?.on.includes(current)) {
          const depValues = this._collectDepValues(dep.value.on)
          const newValue = dep.value.compute ? dep.value.compute(depValues) : null
          const prevValue = this._values.get(depField) ?? null
          if (prevValue !== newValue) {
            this._values.set(depField, newValue)
            changed = true
          }
        }

        if (changed) {
          this._notify(depField)
          queue.push(depField)
        }
      }
    }
  }

  subscribeToField(name: string): (cb: () => void) => () => void {
    if (!this._subscribeRefs.has(name)) {
      this._subscribeRefs.set(name, (cb: () => void) => {
        const subs = this._subscribers.get(name)
        if (subs) subs.add(cb)
        return () => {
          const subs = this._subscribers.get(name)
          if (subs) subs.delete(cb)
        }
      })
    }
    return this._subscribeRefs.get(name)!
  }

  getFieldSnapshot(name: string): () => FieldSnapshot {
    if (!this._snapshotRefs.has(name)) {
      this._snapshotRefs.set(name, () => {
        return this._snapshots.get(name) ?? { value: null, options: [] }
      })
    }
    return this._snapshotRefs.get(name)!
  }

  setFieldValue(name: string, value: FieldValue): void {
    this._values.set(name, value)
    this._notify(name)
    this._propagateDependents(name)
  }

  getValues(): FormValues {
    const result: FormValues = {}
    for (const [name, value] of this._values) {
      result[name] = value
    }
    return result
  }
}
