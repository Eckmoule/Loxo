export const validateEmail = (email) => {
    if (!email) return 'Veuillez entrer votre adresse e-mail.';
    if (!email.includes('@')) return 'Adresse e-mail invalide.';
    return null;
  };
  
  export const validatePassword = (password) => {
    if (!password) return 'Veuillez entrer un mot de passe.';
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.';
    return null;
  };
  
  export const validatePasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas.';
    return null;
  };
  
  export const validateForm = (fields) => {
    const errors = {};
    
    if (fields.email !== undefined) {
      const emailError = validateEmail(fields.email);
      if (emailError) errors.email = emailError;
    }
    
    if (fields.password !== undefined) {
      const passwordError = validatePassword(fields.password);
      if (passwordError) errors.password = passwordError;
    }
    
    if (fields.confirmPassword !== undefined && fields.password !== undefined) {
      const matchError = validatePasswordMatch(fields.password, fields.confirmPassword);
      if (matchError) errors.confirmPassword = matchError;
    }
    
    return errors;
  };