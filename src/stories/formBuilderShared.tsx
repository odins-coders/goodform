import { FieldRegistry, NumberFormat } from '../types';

export const fieldRegistry: FieldRegistry = {
  text: (props) => (
    <label>
      {props.label}
      <input
        type="text"
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  ),
  select: (props) => (
    <label>
      {props.label}
      <select
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">-- select --</option>
        {props.options.map(option => (
          <option value={option} key={option}>{option}</option>
        ))}
      </select>
    </label>
  ),
  radio: (props) => (
    <fieldset disabled={props.disabled}>
      <legend>{props.label}</legend>
      {props.options.map(option => (
        <label key={option}>
          <input
            type="radio"
            name={props.name}
            value={option}
            checked={props.value === option}
            onChange={() => props.onChange(option)}
          />
          {option}
        </label>
      ))}
    </fieldset>
  ),
  date: (props) => (
    <label>
      {props.label}
      <input
        type="date"
        name={props.name}
        value={props.value ? props.value.toISOString().split('T')[0] : ''}
        disabled={props.disabled}
        onChange={(e) => {
          const raw = e.target.value
          props.onChange(raw ? new Date(raw + 'T00:00:00') : null)
        }}
      />
    </label>
  ),
  multiselect: (props) => (
    <label>
      {props.label}
      <select
        multiple
        name={props.name}
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, (o) => o.value)
          props.onChange(selected)
        }}
      >
        {props.options.map(option => (
          <option value={option} key={option}>{option}</option>
        ))}
      </select>
    </label>
  ),
  autocomplete: (props) => {
    const listId = `${props.name}-list`
    return (
      <label>
        {props.label}
        <input
          type="text"
          list={listId}
          name={props.name}
          value={props.value}
          disabled={props.disabled}
          onChange={(e) => props.onChange(e.target.value)}
        />
        <datalist id={listId}>
          {props.options.map(option => (
            <option value={option} key={option} />
          ))}
        </datalist>
      </label>
    )
  },
  switch: (props) => (
    <label>
      {props.label}
      <input
        type="checkbox"
        role="switch"
        name={props.name}
        checked={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.checked)}
      />
    </label>
  ),
  checkbox: (props) => (
    <fieldset disabled={props.disabled}>
      <legend>{props.label}</legend>
      {props.options.map(option => (
        <label key={option}>
          <input
            type="checkbox"
            name={props.name}
            value={option}
            checked={props.value.includes(option)}
            onChange={(e) => {
              const next = e.target.checked
                ? [...props.value, option]
                : props.value.filter(v => v !== option)
              props.onChange(next)
            }}
          />
          {option}
        </label>
      ))}
    </fieldset>
  ),
  number: (props) => {
    const prefix: Partial<Record<NumberFormat, string>> = { currency: '$' }
    const suffix: Partial<Record<NumberFormat, string>> = { percentage: '%' }
    return (
      <label>
        {props.label}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          {props.format && prefix[props.format]}
          <input
            type="number"
            name={props.name}
            value={props.value ?? ''}
            step={props.step}
            min={props.min}
            max={props.max}
            disabled={props.disabled}
            onChange={(e) => {
              const raw = e.target.value
              props.onChange(raw === '' ? null : Number(raw))
            }}
          />
          {props.format && suffix[props.format]}
        </span>
      </label>
    )
  },
};
