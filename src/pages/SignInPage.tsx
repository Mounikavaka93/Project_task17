import { type FormEvent, type FocusEvent, useEffect, useState } from 'react'
import { Eye, EyeOff, ShoppingBag } from 'lucide-react'
import {
  DEMO_EMAIL,
  DEMO_NAME,
  DEMO_PASSWORD,
  authenticate,
  demoAccount,
  findAccount,
  register,
  shouldAutoDemoLogin,
  skipAutoDemoLogin,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  type AuthErrors,
  type AuthUser,
} from '../lib/auth'

type SignInPageProps = {
  onSuccess: (user: AuthUser) => void
}

type Mode = 'signin' | 'signup'

function inputClass(hasError: boolean): string {
  return [
    'mt-1.5 w-full rounded-xl border bg-paper px-3 py-2.5 text-sm outline-none transition',
    hasError
      ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
      : 'border-line focus:border-coral/50 focus:bg-white focus:ring-2 focus:ring-coral/15',
  ].join(' ')
}

export function SignInPage({ onSuccess }: SignInPageProps) {
  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<AuthErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [autoLoggingIn, setAutoLoggingIn] = useState(() => shouldAutoDemoLogin())

  useEffect(() => {
    if (!shouldAutoDemoLogin()) {
      setAutoLoggingIn(false)
      return
    }
    setLoading(true)
    const timer = window.setTimeout(() => {
      if (shouldAutoDemoLogin()) onSuccess(demoAccount())
    }, 800)
    return () => window.clearTimeout(timer)
  }, [onSuccess])

  function resetForm(nextMode: Mode) {
    setMode(nextMode)
    setErrors({})
    setSubmitted(false)
    setShowPassword(false)
    setAutoLoggingIn(false)
    setLoading(false)
    if (nextMode === 'signup') {
      skipAutoDemoLogin()
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setName('')
    } else {
      setEmail(DEMO_EMAIL)
      setPassword(DEMO_PASSWORD)
    }
  }

  function loginAsDemo() {
    setErrors({})
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    finish(demoAccount())
  }

  function setFieldError(field: keyof AuthErrors, message: string | undefined) {
    setErrors((current) => {
      const next = { ...current, [field]: message }
      delete next.form
      return next
    })
  }

  function finish(user: AuthUser) {
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      onSuccess(user)
    }, 450)
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    if (mode === 'signin') {
      const nextErrors = authenticate({ email, password })
      setErrors(nextErrors)
      if (nextErrors.email || nextErrors.password || nextErrors.form) return
      const user = findAccount(email)
      if (!user) {
        setErrors({ form: 'Invalid email or password. Check your details and try again.' })
        return
      }
      finish(user)
      return
    }

    const nextErrors = register({ name, email, password, confirmPassword })
    setErrors(nextErrors)
    if (
      nextErrors.name ||
      nextErrors.email ||
      nextErrors.password ||
      nextErrors.confirmPassword ||
      nextErrors.form
    ) {
      return
    }
    finish({
      name: name.trim().replace(/\s+/g, ' '),
      email: email.trim().toLowerCase(),
    })
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-10 text-white">
          <p className="text-sm font-semibold text-coral">VividCart</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
            Goods people actually want to keep.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Managed by {DEMO_NAME}. 12,486 orders this month across fashion, home, and electronics.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-paper px-5 py-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral text-white shadow-[0_10px_20px_-12px_#F25C2A]">
              <ShoppingBag size={22} />
            </span>
            <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
              {mode === 'signin' ? 'Sign in to VividCart' : 'Create your account'}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {autoLoggingIn
                ? `Signing in as ${DEMO_NAME}…`
                : mode === 'signin'
                  ? 'Demo details are filled in for you'
                  : 'Set up access to the VividCart dashboard'}
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl border border-line bg-white p-6 shadow-sm"
          >
            {errors.form ? (
              <p
                role="alert"
                className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
              >
                {errors.form}
              </p>
            ) : null}

            {mode === 'signup' ? (
              <>
                <label className="block text-sm font-semibold" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    if (submitted || errors.name) {
                      setFieldError('name', validateName(event.target.value))
                    }
                  }}
                  onBlur={(event: FocusEvent<HTMLInputElement>) =>
                    setFieldError('name', validateName(event.target.value))
                  }
                  aria-invalid={Boolean(errors.name)}
                  className={inputClass(Boolean(errors.name))}
                  placeholder="Mounika Vaka"
                />
                {errors.name ? (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                    {errors.name}
                  </p>
                ) : null}
              </>
            ) : null}

            <label className={`block text-sm font-semibold ${mode === 'signup' ? 'mt-4' : ''}`} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (submitted || errors.email) {
                  setFieldError('email', validateEmail(event.target.value))
                }
              }}
              onBlur={(event: FocusEvent<HTMLInputElement>) =>
                setFieldError('email', validateEmail(event.target.value))
              }
              aria-invalid={Boolean(errors.email)}
              className={inputClass(Boolean(errors.email))}
              placeholder="you@store.com"
            />
            {errors.email ? (
              <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.email}
              </p>
            ) : null}

            <label className="mt-4 block text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (submitted || errors.password) {
                    setFieldError('password', validatePassword(event.target.value))
                  }
                  if (mode === 'signup' && (submitted || errors.confirmPassword)) {
                    setFieldError(
                      'confirmPassword',
                      validateConfirmPassword(event.target.value, confirmPassword),
                    )
                  }
                }}
                onBlur={(event: FocusEvent<HTMLInputElement>) =>
                  setFieldError('password', validatePassword(event.target.value))
                }
                aria-invalid={Boolean(errors.password)}
                className={`${inputClass(Boolean(errors.password))} mt-0 pr-11`}
                placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((open) => !open)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition hover:bg-white hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password ? (
              <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.password}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-muted">
                8+ characters with upper, lower, number, and symbol.
              </p>
            )}

            {mode === 'signup' ? (
              <>
                <label className="mt-4 block text-sm font-semibold" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value)
                    if (submitted || errors.confirmPassword) {
                      setFieldError(
                        'confirmPassword',
                        validateConfirmPassword(password, event.target.value),
                      )
                    }
                  }}
                  onBlur={(event: FocusEvent<HTMLInputElement>) =>
                    setFieldError(
                      'confirmPassword',
                      validateConfirmPassword(password, event.target.value),
                    )
                  }
                  aria-invalid={Boolean(errors.confirmPassword)}
                  className={inputClass(Boolean(errors.confirmPassword))}
                  placeholder="Re-enter your password"
                />
                {errors.confirmPassword ? (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                    {errors.confirmPassword}
                  </p>
                ) : null}
              </>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-coral py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_#F25C2A] transition hover:bg-coral-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? mode === 'signin'
                  ? 'Signing in…'
                  : 'Creating account…'
                : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </button>

            {mode === 'signin' ? (
              <button
                type="button"
                disabled={loading}
                onClick={loginAsDemo}
                className="mt-2 w-full rounded-xl border border-line bg-paper py-2.5 text-sm font-semibold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                Demo login as {DEMO_NAME}
              </button>
            ) : null}

            <p className="mt-4 text-center text-sm text-muted">
              {mode === 'signin' ? 'New to VividCart?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => resetForm(mode === 'signin' ? 'signup' : 'signin')}
                className="font-semibold text-coral hover:text-coral-dark"
              >
                {mode === 'signin' ? 'Create account' : 'Sign in'}
              </button>
            </p>
          </form>

          <p className="mt-4 rounded-xl border border-line bg-white px-4 py-3 text-center text-xs text-muted">
            Demo account: <span className="font-semibold text-ink">{DEMO_NAME}</span>
            {' · '}
            <span className="font-semibold text-ink">{DEMO_EMAIL}</span>
            {' · '}
            <span className="font-semibold text-ink">{DEMO_PASSWORD}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
