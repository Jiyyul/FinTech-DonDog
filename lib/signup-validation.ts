export function isNameValid(name: string): boolean {
  return name.trim().length > 0;
}

export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isPasswordValid(password: string): boolean {
  return password.length >= 8;
}

export function isSignupFormValid(
  name: string,
  email: string,
  password: string,
  agreed: boolean
): boolean {
  return isNameValid(name) && isEmailValid(email) && isPasswordValid(password) && agreed;
}
