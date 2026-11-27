import { useState } from 'react'
import {
  PASSWORD_RULES,
  validatePassword,
  type PasswordStrength,
} from '@/shared/utils'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  showRequirements: boolean
  disabled?: boolean
}

const STRENGTH_STYLES: Record<
  PasswordStrength,
  { label: string; color: string; width: string; level: number }
> = {
  weak: { label: 'Weak', color: 'bg-red-500', width: 'w-1/3', level: 1 },
  medium: { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3', level: 2 },
  strong: { label: 'Strong', color: 'bg-green-500', width: 'w-full', level: 3 },
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      {crossed && <path d="M3 3l18 18" />}
    </svg>
  )
}

export function PasswordInput({
  value,
  onChange,
  showRequirements,
  disabled = false,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const { strength } = validatePassword(value)
  const { label, color, width, level } = STRENGTH_STYLES[strength]

  return (
    <div className="space-y-3 text-left">
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          aria-label="Password"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded border border-gray-300 bg-white py-2 pr-10 pl-3 text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <button
          type="button"
          aria-label={isVisible ? 'Hide text' : 'Show text'}
          onClick={() => setIsVisible((visible) => !visible)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <EyeIcon crossed={isVisible} />
        </button>
      </div>

      <div className="space-y-1">
        <div className="h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
          <div
            role="meter"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={level}
            aria-valuetext={label}
            className={`h-full rounded transition-all ${color} ${width}`}
          />
        </div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </p>
      </div>

      {showRequirements && (
        <ul aria-label="Password requirements" className="space-y-1 text-sm">
          {PASSWORD_RULES.map((rule) => {
            const isMet = rule.passes(value)

            return (
              <li
                key={rule.label}
                data-met={isMet}
                className={`flex items-center gap-2 ${
                  isMet
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                <span aria-hidden="true">{isMet ? '✓' : '✗'}</span>
                <span>{rule.label}</span>
                <span className="sr-only">{isMet ? 'Met' : 'Not met'}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
