import { useState, type FormEvent } from 'react'
import { BUSINESS_RULES } from '@/shared/constants/businessRules'
import { validatePassword } from '@/shared/utils'
import { PasswordInput } from './components/PasswordInput'

const { MAX_FAILED_ATTEMPTS } = BUSINESS_RULES.LOGIN
const DEMO_EMAIL = 'demo@example.com'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/

type LoginStatus = 'idle' | 'success' | 'error' | 'locked'

function getEmailError(email: string): string | null {
  if (email === '') return 'Email is required'
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address'
  return null
}

export function LoginDemo() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<LoginStatus>('idle')
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isEmailTouched, setIsEmailTouched] = useState(false)

  const emailError = isEmailTouched ? getEmailError(email) : null
  const isLocked = status === 'locked'
  const isFormValid =
    EMAIL_PATTERN.test(email) && validatePassword(password).isValid
  const attemptsLeft = MAX_FAILED_ATTEMPTS - failedAttempts

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLocked || !isFormValid) return

    if (email === DEMO_EMAIL) {
      setStatus('success')
      return
    }

    const nextFailedAttempts = failedAttempts + 1
    setFailedAttempts(nextFailedAttempts)
    setStatus(nextFailedAttempts >= MAX_FAILED_ATTEMPTS ? 'locked' : 'error')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md space-y-4 rounded-lg bg-white p-6 text-left shadow-md dark:bg-gray-800"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Login Demo
      </h2>

      <div className="space-y-1">
        <label
          htmlFor="login-email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          disabled={isLocked}
          aria-invalid={emailError !== null}
          aria-describedby={emailError ? 'login-email-error' : undefined}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setIsEmailTouched(true)}
          className={`w-full rounded border bg-white px-3 py-2 text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 ${
            emailError
              ? 'border-red-500 focus:outline-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {emailError && (
          <p
            id="login-email-error"
            className="text-sm text-red-600 dark:text-red-400"
          >
            {emailError}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </span>
        <PasswordInput
          value={password}
          onChange={setPassword}
          showRequirements
          disabled={isLocked}
        />
      </div>

      {status === 'success' && (
        <p
          role="status"
          className="rounded bg-green-100 p-3 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          Login successful! Welcome, {email}.
        </p>
      )}

      {status === 'error' && (
        <p
          role="alert"
          className="rounded bg-red-100 p-3 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
        >
          Invalid credentials. {attemptsLeft}{' '}
          {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining.
        </p>
      )}

      {isLocked && (
        <p
          role="alert"
          className="rounded bg-red-100 p-3 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
        >
          Too many failed attempts. The form is locked.
        </p>
      )}

      <button
        type="submit"
        disabled={!isFormValid || isLocked}
        className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
      >
        Sign in
      </button>
    </form>
  )
}
