export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length > 0 && name.length <= 50;
};

export const validateRegistrationData = ({ name, email, password, role = 'student' }) => {
  const errors = [];

  if (!validateName(name)) {
    errors.push('Name is required and must be less than 50 characters');
  }

  if (!validateEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!['student', 'admin'].includes(role)) {
    errors.push('Role must be either student or admin');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLoginData = ({ email, password }) => {
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  } else if (!validateEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};