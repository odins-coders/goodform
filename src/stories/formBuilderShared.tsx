import { FieldRegistry } from '../types';

export const fieldRegistry: FieldRegistry = {
  text: (props) => (
    <label>
      {props.label}
      <input
        type="text"
        name={props.name}
        value={props.value}
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
    <fieldset>
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
  checkbox: (props) => (
    <fieldset>
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
};
