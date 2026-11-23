import { describe, expect, it } from 'vitest'
import { validatePassword } from './validatePassword'

const ERRORS = {
  length: 'Password must be at least 12 characters',
  uppercase: 'Password must contain an uppercase letter',
  lowercase: 'Password must contain a lowercase letter',
  number: 'Password must contain a number',
  special: 'Password must contain a special character',
}

// Builds a password that satisfies every rule with the given length
const createValidPassword = (length: number) =>
  'Aa1!' + 'x'.repeat(length - 4)

describe('validatePassword', () => {
  describe('minimum length', () => {
    it('fails with fewer than 12 characters', () => {
      const result = validatePassword(createValidPassword(11))

      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual([ERRORS.length])
    })

    it('passes with exactly 12 characters', () => {
      const result = validatePassword(createValidPassword(12))

      expect(result.errors).not.toContain(ERRORS.length)
    })
  })

  describe('character rules', () => {
    it('fails without an uppercase letter', () => {
      const result = validatePassword('abcdefghijk1!')

      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual([ERRORS.uppercase])
    })

    it('fails without a lowercase letter', () => {
      const result = validatePassword('ABCDEFGHIJK1!')

      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual([ERRORS.lowercase])
    })

    it('fails without a number', () => {
      const result = validatePassword('Abcdefghijkl!')

      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual([ERRORS.number])
    })

    it('fails without a special character', () => {
      const result = validatePassword('Abcdefghijkl1')

      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual([ERRORS.special])
    })

    it('accepts any of the common special characters', () => {
      for (const char of '!@#$%^&*') {
        const result = validatePassword(`Abcdefghijk1${char}`)

        expect(result.errors).not.toContain(ERRORS.special)
      }
    })
  })

  describe('multiple failures', () => {
    it('returns every failing rule for an empty password', () => {
      const result = validatePassword('')

      expect(result.isValid).toBe(false)
      expect(result.errors).toEqual([
        ERRORS.length,
        ERRORS.uppercase,
        ERRORS.lowercase,
        ERRORS.number,
        ERRORS.special,
      ])
    })
  })

  describe('strength', () => {
    it('is weak for a password that is too short', () => {
      expect(validatePassword(createValidPassword(11)).strength).toBe('weak')
    })

    it('is weak for a long password that breaks a rule', () => {
      expect(validatePassword('a'.repeat(30)).strength).toBe('weak')
    })

    it('is medium for a valid password of 12 characters', () => {
      expect(validatePassword(createValidPassword(12)).strength).toBe('medium')
    })

    it('is medium for a valid password of 15 characters', () => {
      expect(validatePassword(createValidPassword(15)).strength).toBe('medium')
    })

    it('is strong for a valid password of 16 characters', () => {
      expect(validatePassword(createValidPassword(16)).strength).toBe('strong')
    })

    it('is strong for a valid password longer than 16 characters', () => {
      expect(validatePassword(createValidPassword(30)).strength).toBe('strong')
    })
  })

  describe('valid password', () => {
    it('returns isValid true and no errors', () => {
      const result = validatePassword('MyS3cure!Passw0rd')

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })
  })
})
