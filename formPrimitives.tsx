import type { ReactNode } from 'react';

// ─── Field wrapper ────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>
        {label}
        {required && <span style={requiredStyle}> *</span>}
      </label>
      {children}
      {hint && <span style={hintStyle}>{hint}</span>}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps {
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email';
}

export function Input({ value, onChange, placeholder, type = 'text' }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      spellCheck={false}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.15)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#1e2d45';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectOption { value: string; label: string }

interface SelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ value, onChange, options, placeholder }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...inputStyle, cursor: 'pointer' }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.15)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#1e2d45';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {placeholder && (
        <option value="" disabled>{placeholder}</option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export function Textarea({ value, onChange, placeholder, rows = 3 }: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
      spellCheck={false}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.15)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = '#1e2d45';
        e.currentTarget.style.boxShadow = 'none';
      }}
    />
  );
}

// ─── Section divider ─────────────────────────────────────────────────────────

export function SectionDivider({ label }: { label: string }) {
  return (
    <div style={dividerWrapStyle}>
      <span style={dividerLabelStyle}>{label}</span>
      <div style={dividerLineStyle} />
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'DM Mono', 'Fira Code', monospace",
  fontSize: '9px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#475569',
};

const requiredStyle: React.CSSProperties = {
  color: '#ef4444',
};

const hintStyle: React.CSSProperties = {
  fontFamily: "'DM Mono', 'Fira Code', monospace",
  fontSize: '9px',
  color: '#334155',
  letterSpacing: '0.02em',
  lineHeight: 1.4,
};

export const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0f121e',
  border: '1px solid #1e2d45',
  borderRadius: '5px',
  padding: '8px 10px',
  fontFamily: "'DM Mono', 'Fira Code', monospace",
  fontSize: '11px',
  color: '#cbd5e1',
  outline: 'none',
  transition: 'border-color 0.12s, box-shadow 0.12s',
  boxSizing: 'border-box',
};

const dividerWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '4px',
};

const dividerLabelStyle: React.CSSProperties = {
  fontFamily: "'DM Mono', 'Fira Code', monospace",
  fontSize: '8.5px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#1e2d45',
  whiteSpace: 'nowrap',
};

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: '1px',
  background: '#1a2236',
};
