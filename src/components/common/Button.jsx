import './Button.css';

function Button({ 
  children, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${loading ? 'btn--loading' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;