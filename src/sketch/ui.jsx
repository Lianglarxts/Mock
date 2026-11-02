import { RoughBox } from './rough.jsx';

// Hand-drawn button. variant: main (pencil-shaded) | ghost (light outline)
export function Btn({ children, onClick, disabled, variant = 'main', className = '', seedKey, ...rest }) {
  const main = variant === 'main';
  const key = seedKey || (typeof children === 'string' ? children : 'btn');
  return (
    <RoughBox
      as="button"
      type="button"
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      seedKey={key}
      stroke={disabled ? 'faint' : main ? 'graphite' : 'soft'}
      strokeWidth={main ? 1.8 : 1.3}
      fill={main && !disabled ? 'faint' : undefined}
      opts={{ hachureGap: 4.5 }}
      {...rest}
    >
      <span className="btn-label">{children}</span>
    </RoughBox>
  );
}

// A group of choice chips that behaves like radio buttons.
export function Chips({ label, options, value, onChange }) {
  return (
    <div className="chips" role="radiogroup" aria-label={label}>
      {options.map((o) => {
        const on = value === o.value;
        return (
          <RoughBox
            as="button"
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            className={`chip ${on ? 'is-on' : ''}`}
            onClick={() => onChange(o.value)}
            seedKey={label + o.label}
            stroke={on ? 'graphite' : 'faint'}
            strokeWidth={on ? 1.8 : 1.2}
            fill={on ? 'faint' : undefined}
            opts={{ hachureGap: 5.5 }}
          >
            <span className="chip-label">{o.label}</span>
            {o.note && <span className="chip-note">{o.note}</span>}
          </RoughBox>
        );
      })}
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      {children}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}
