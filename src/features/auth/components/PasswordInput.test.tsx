import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState, type ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { PasswordInput } from './PasswordInput'

// Builds a password that satisfies every rule with the given length
const createValidPassword = (length: number) =>
  'Aa1!' + 'x'.repeat(length - 4)

const REQUIREMENTS = {
  length: /at least 12 characters/i,
  uppercase: /uppercase letter/i,
  lowercase: /lowercase letter/i,
  number: /number/i,
  special: /special character/i,
}

const getRequirement = (text: RegExp) => screen.getByText(text).closest('li')

const renderInput = (props: Partial<ComponentProps<typeof PasswordInput>> = {}) =>
  render(
    <PasswordInput
      value=""
      onChange={vi.fn()}
      showRequirements={false}
      {...props}
    />,
  )

function StatefulPasswordInput({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial)

  return (
    <PasswordInput value={value} onChange={setValue} showRequirements />
  )
}

describe('PasswordInput', () => {
  describe('input', () => {
    it('renders a password input labelled "Password"', () => {
      renderInput()

      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password',
      )
    })

    it('shows the value it receives', () => {
      renderInput({ value: 'secret' })

      expect(screen.getByLabelText('Password')).toHaveValue('secret')
    })

    it('calls onChange with the new value when the user types', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      renderInput({ onChange })

      await user.type(screen.getByLabelText('Password'), 'a')

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith('a')
    })
  })

  describe('disabled', () => {
    it('is enabled by default', () => {
      renderInput()

      expect(screen.getByLabelText('Password')).toBeEnabled()
      expect(screen.getByRole('button', { name: /show/i })).toBeEnabled()
    })

    it('disables the input and the toggle when disabled is true', () => {
      renderInput({ disabled: true })

      expect(screen.getByLabelText('Password')).toBeDisabled()
      expect(screen.getByRole('button', { name: /show/i })).toBeDisabled()
    })
  })

  describe('show/hide toggle', () => {
    it('has a toggle button whose label does not include "password"', () => {
      renderInput()

      const toggle = screen.getByRole('button', { name: /show/i })

      expect(toggle.getAttribute('aria-label')).not.toMatch(/password/i)
    })

    it('does not make the "Password" label ambiguous', () => {
      renderInput()

      expect(screen.getAllByLabelText('Password')).toHaveLength(1)
    })

    it('shows the text when the toggle is clicked', async () => {
      const user = userEvent.setup()
      renderInput({ value: 'secret' })

      await user.click(screen.getByRole('button', { name: /show/i }))

      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
      expect(screen.getByRole('button', { name: /hide/i })).toBeInTheDocument()
    })

    it('hides the text again when the toggle is clicked twice', async () => {
      const user = userEvent.setup()
      renderInput({ value: 'secret' })

      await user.click(screen.getByRole('button', { name: /show/i }))
      await user.click(screen.getByRole('button', { name: /hide/i }))

      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password',
      )
      expect(screen.getByRole('button', { name: /show/i })).toBeInTheDocument()
    })
  })

  describe('requirements', () => {
    it('does not show the requirements when showRequirements is false', () => {
      renderInput({ showRequirements: false })

      expect(screen.queryByText(REQUIREMENTS.length)).not.toBeInTheDocument()
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('shows every requirement when showRequirements is true', () => {
      renderInput({ showRequirements: true })

      expect(screen.getAllByRole('listitem')).toHaveLength(5)
      for (const requirement of Object.values(REQUIREMENTS)) {
        expect(screen.getByText(requirement)).toBeInTheDocument()
      }
    })

    it('marks every requirement as not met for an empty value', () => {
      renderInput({ showRequirements: true, value: '' })

      for (const requirement of Object.values(REQUIREMENTS)) {
        expect(getRequirement(requirement)).toHaveAttribute('data-met', 'false')
      }
    })

    it('marks only the requirements the value meets', () => {
      renderInput({ showRequirements: true, value: 'abc' })

      expect(getRequirement(REQUIREMENTS.lowercase)).toHaveAttribute(
        'data-met',
        'true',
      )
      expect(getRequirement(REQUIREMENTS.length)).toHaveAttribute(
        'data-met',
        'false',
      )
      expect(getRequirement(REQUIREMENTS.uppercase)).toHaveAttribute(
        'data-met',
        'false',
      )
      expect(getRequirement(REQUIREMENTS.number)).toHaveAttribute(
        'data-met',
        'false',
      )
      expect(getRequirement(REQUIREMENTS.special)).toHaveAttribute(
        'data-met',
        'false',
      )
    })

    it('marks every requirement as met for a valid password', () => {
      renderInput({ showRequirements: true, value: createValidPassword(12) })

      for (const requirement of Object.values(REQUIREMENTS)) {
        expect(getRequirement(requirement)).toHaveAttribute('data-met', 'true')
      }
    })

    it('updates the requirements in real time while typing', async () => {
      const user = userEvent.setup()
      render(<StatefulPasswordInput />)

      expect(getRequirement(REQUIREMENTS.uppercase)).toHaveAttribute(
        'data-met',
        'false',
      )

      await user.type(screen.getByLabelText('Password'), 'A')

      expect(getRequirement(REQUIREMENTS.uppercase)).toHaveAttribute(
        'data-met',
        'true',
      )
    })
  })

  describe('strength indicator', () => {
    const getBar = () => screen.getByRole('meter', { name: /strength/i })

    it('shows the indicator even when the requirements are hidden', () => {
      renderInput({ showRequirements: false })

      expect(getBar()).toBeInTheDocument()
    })

    it('shows "Weak" in red for an invalid password', () => {
      renderInput({ value: 'abc' })

      expect(screen.getByText('Weak')).toBeInTheDocument()
      expect(getBar()).toHaveClass('bg-red-500')
    })

    it('shows "Medium" in yellow for a valid password of 12 to 15 characters', () => {
      renderInput({ value: createValidPassword(12) })

      expect(screen.getByText('Medium')).toBeInTheDocument()
      expect(getBar()).toHaveClass('bg-yellow-500')
    })

    it('shows "Strong" in green for a valid password of 16 or more characters', () => {
      renderInput({ value: createValidPassword(16) })

      expect(screen.getByText('Strong')).toBeInTheDocument()
      expect(getBar()).toHaveClass('bg-green-500')
    })

    it('updates the strength while typing', async () => {
      const user = userEvent.setup()
      render(<StatefulPasswordInput />)

      expect(screen.getByText('Weak')).toBeInTheDocument()

      await user.type(screen.getByLabelText('Password'), createValidPassword(12))

      expect(screen.getByText('Medium')).toBeInTheDocument()
    })
  })
})
