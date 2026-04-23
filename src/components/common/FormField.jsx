import './FormField.css';

function FormField({ label, error, children }) {
  return (
    <div className="form-field">
      <label className="form-field__label">{label}</label>
      {children}
      {error && <div className="form-field__error">{error}</div>}
    </div>
  );
}

export default FormField;