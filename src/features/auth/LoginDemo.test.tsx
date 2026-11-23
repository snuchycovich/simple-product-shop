import { render, screen } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LoginDemo } from './LoginDemo'

const DEMO_EMAIL = 'demo@example.com'
const OTHER_EMAIL = 'other@example.com'
const VALID_PASSWORD = 'MyS3cure!Passw0rd'
const MAX_ATTEMPTS = 3

const getEmailInput = () => screen.getByLabelText('Email')
const getPasswordInput = () => screen.getByLabelText('Password')
const getSubmitButton = () => screen.getByRole('button', { name: /sign in/i })

const fillForm = async (user: UserEvent, email: string, password: string) => {
  await user.type(getEmailInput(), email)
  await user.type(getPasswordInput(), password)
}

const clearForm = async (user: UserEvent) => {
  await user.clear(getEmailInput())
  await user.clear(getPasswordInput())
}

const submitFailedAttempt = async (user: UserEvent) => {
  await fillForm(user, OTHER_EMAIL, VALID_PASSWORD)
  await user.click(getSubmitButton())
}

describe('LoginDemo', () => {
  it('renders the email and password inputs', () => {
    render(<LoginDemo />)

    expect(getEmailInput()).toBeInTheDocument()
    expect(getPasswordInput()).toBeInTheDocument()
    expect(getSubmitButton()).toBeInTheDocument()
  })

  describe('form validation', () => {
    it('disables the submit button when the form is empty', () => {
      render(<LoginDemo />)

      expect(getSubmitButton()).toBeDisabled()
    })

    it('disables the submit button when the email format is invalid', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await fillForm(user, 'not-an-email', VALID_PASSWORD)

      expect(getSubmitButton()).toBeDisabled()
    })

    it('disables the submit button when the password is not valid', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await fillForm(user, DEMO_EMAIL, 'weak')

      expect(getSubmitButton()).toBeDisabled()
    })

    it('enables the submit button when the email and password are valid', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await fillForm(user, DEMO_EMAIL, VALID_PASSWORD)

      expect(getSubmitButton()).toBeEnabled()
    })
  })

  describe('email validation on blur', () => {
    it('does not mark the email as invalid before the user leaves the input', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      expect(getEmailInput()).not.toHaveAttribute('aria-invalid', 'true')
      expect(getEmailInput()).not.toHaveClass('border-red-500')

      await user.type(getEmailInput(), 'not-an-email')

      expect(getEmailInput()).not.toHaveAttribute('aria-invalid', 'true')
      expect(getEmailInput()).not.toHaveClass('border-red-500')
    })

    it('shows a red outline and a message when the email is empty on blur', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await user.click(getEmailInput())
      await user.tab()

      expect(getEmailInput()).toHaveAttribute('aria-invalid', 'true')
      expect(getEmailInput()).toHaveClass('border-red-500')
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })

    it('shows a red outline and a message when the email format is invalid on blur', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await user.type(getEmailInput(), 'not-an-email')
      await user.tab()

      expect(getEmailInput()).toHaveAttribute('aria-invalid', 'true')
      expect(getEmailInput()).toHaveClass('border-red-500')
      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    })

    it('does not show the red outline when the email is valid on blur', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await user.type(getEmailInput(), DEMO_EMAIL)
      await user.tab()

      expect(getEmailInput()).not.toHaveAttribute('aria-invalid', 'true')
      expect(getEmailInput()).not.toHaveClass('border-red-500')
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
      expect(
        screen.queryByText('Enter a valid email address'),
      ).not.toBeInTheDocument()
    })

    it('removes the red outline once the user fixes the email', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)
      await user.type(getEmailInput(), 'not-an-email')
      await user.tab()
      expect(getEmailInput()).toHaveClass('border-red-500')

      await user.clear(getEmailInput())
      await user.type(getEmailInput(), DEMO_EMAIL)

      expect(getEmailInput()).not.toHaveAttribute('aria-invalid', 'true')
      expect(getEmailInput()).not.toHaveClass('border-red-500')
    })

    it('links the error message to the input for assistive technologies', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await user.click(getEmailInput())
      await user.tab()

      expect(getEmailInput()).toHaveAccessibleDescription('Email is required')
    })
  })

  describe('login', () => {
    it('shows a success message with the demo email', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await fillForm(user, DEMO_EMAIL, VALID_PASSWORD)
      await user.click(getSubmitButton())

      const message = screen.getByRole('status')
      expect(message).toHaveTextContent(/login successful/i)
      expect(message).toHaveTextContent(DEMO_EMAIL)
    })

    it('shows an invalid credentials error for any other email', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await submitFailedAttempt(user)

      expect(screen.getByRole('alert')).toHaveTextContent(/invalid credentials/i)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('rate limiting', () => {
    it('does not lock the form after fewer than 3 failed attempts', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      await submitFailedAttempt(user)
      await clearForm(user)
      await submitFailedAttempt(user)

      expect(getEmailInput()).toBeEnabled()
      expect(getPasswordInput()).toBeEnabled()
      expect(screen.queryByText(/too many failed attempts/i)).not.toBeInTheDocument()
    })

    it('locks the form after 3 failed attempts', async () => {
      const user = userEvent.setup()
      render(<LoginDemo />)

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        await submitFailedAttempt(user)

        // Clear only between attempts: the fields get disabled after the last one
        if (attempt < MAX_ATTEMPTS) {
          await clearForm(user)
        }
      }

      expect(screen.getByText(/too many failed attempts/i)).toBeInTheDocument()
      expect(getEmailInput()).toBeDisabled()
      expect(getPasswordInput()).toBeDisabled()
      expect(getSubmitButton()).toBeDisabled()
    })
  })
})
