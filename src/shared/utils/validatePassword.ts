import { BUSINESS_RULES } from '@/shared/constants/businessRules'

const { MIN_LENGTH, STRONG_LENGTH } = BUSINESS_RULES.PASSWORD

export type PasswordStrength = 'weak' | 'medium' | 'strong'

export interface PasswordValidation {
  isValid: boolean
  errors: string[]
  strength: PasswordStrength
}

export const PASSWORD_RULES = [
  {
    label: `At least ${MIN_LENGTH} characters`,
    error: `Password must be at least ${MIN_LENGTH} characters`,
    passes: (password: string) => password.length >= MIN_LENGTH,
  },
  {
    label: 'An uppercase letter',
    error: 'Password must contain an uppercase letter',
    passes: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: 'A lowercase letter',
    error: 'Password must contain a lowercase letter',
    passes: (password: string) => /[a-z]/.test(password),
  },
  {
    label: 'A number',
    error: 'Password must contain a number',
    passes: (password: string) => /\d/.test(password),
  },
  {
    label: 'A special character',
    error: 'Password must contain a special character',
    passes: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
]

function getStrength(isValid: boolean, length: number): PasswordStrength {
  if (!isValid) return 'weak'
  return length >= STRONG_LENGTH ? 'strong' : 'medium'
}

export function validatePassword(password: string): PasswordValidation {
  const errors = PASSWORD_RULES.filter(({ passes }) => !passes(password)).map(
    ({ error }) => error,
  )
  const isValid = errors.length === 0

  return {
    isValid,
    errors,
    strength: getStrength(isValid, password.length),
  }
}
