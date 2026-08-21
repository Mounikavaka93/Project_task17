export type AuthUser = {
  name: string
  email: string
}

type StoredAccount = AuthUser & {
  password: string
}

export type SignInValues = {
  email: string
  password: string
}

export type CreateAccountValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type AuthErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  form?: string
}

export const DEMO_USER: StoredAccount = {
  name: 'Mounika Vaka',
  email: 'mounika.vaka@vividcart.io',
  password: 'Mounika@2026',
}

export const DEMO_EMAIL = DEMO_USER.email
export const DEMO_PASSWORD = DEMO_USER.password
export const DEMO_NAME = DEMO_USER.name

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*[A-Za-z]$/
const AUTH_FLAG = 'vividcart-signed-in'
const USER_KEY = 'vividcart-user'
const ACCOUNTS_KEY = 'vividcart-accounts'
const SKIP_AUTO_KEY = 'vividcart-skip-auto-login'

export function validateName(name: string): string | undefined {
  const value = name.trim().replace(/\s+/g, ' ')
  if (!value) return 'Full name is required'
  if (value.length < 3) return 'Enter your full name'
  if (value.split(' ').length < 2) return 'Enter first and last name'
  if (!NAME_PATTERN.test(value)) return 'Name can only include letters and spaces'
  return undefined
}

export function validateEmail(email: string): string | undefined {
  const value = email.trim()
  if (!value) return 'Email is required'
  if (/\s/.test(email)) return 'Email cannot contain spaces'
  if (value.length > 254) return 'Email is too long'
  if (!value.includes('@')) return 'Email must include @'
  const [local, domain] = value.split('@')
  if (!local) return 'Enter a name before @'
  if (!domain) return 'Enter a domain after @'
  if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address'
  return undefined
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (password.length > 64) return 'Password must be at most 64 characters'
  if (/\s/.test(password)) return 'Password cannot contain spaces'
  if (!/[A-Z]/.test(password)) return 'Include at least one uppercase letter'
  if (!/[a-z]/.test(password)) return 'Include at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Include at least one number'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Include at least one special character'
  return undefined
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  if (!confirmPassword) return 'Confirm your password'
  if (confirmPassword !== password) return 'Passwords do not match'
  return undefined
}

function readExtraAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredAccount[]
    return parsed.filter((item) => item.email && item.password && item.name)
  } catch {
    return []
  }
}

function writeExtraAccounts(accounts: StoredAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch {
    // Ignore storage errors in private browsing.
  }
}

function allAccounts(): StoredAccount[] {
  const extra = readExtraAccounts().filter(
    (item) => item.email.toLowerCase() !== DEMO_USER.email,
  )
  return [DEMO_USER, ...extra]
}

export function authenticate(values: SignInValues): AuthErrors {
  const errors: AuthErrors = {}
  const emailError = validateEmail(values.email)
  const passwordError = validatePassword(values.password)
  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError
  if (errors.email || errors.password) return errors

  const email = values.email.trim().toLowerCase()
  const match = allAccounts().find((item) => item.email.toLowerCase() === email)
  if (!match || match.password !== values.password) {
    return { form: 'Invalid email or password. Check your details and try again.' }
  }
  return {}
}

export function register(values: CreateAccountValues): AuthErrors {
  const errors: AuthErrors = {}
  const nameError = validateName(values.name)
  const emailError = validateEmail(values.email)
  const passwordError = validatePassword(values.password)
  const confirmError = validateConfirmPassword(values.password, values.confirmPassword)
  if (nameError) errors.name = nameError
  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError
  if (confirmError) errors.confirmPassword = confirmError
  if (errors.name || errors.email || errors.password || errors.confirmPassword) return errors

  const email = values.email.trim().toLowerCase()
  const exists = allAccounts().some((item) => item.email.toLowerCase() === email)
  if (exists) {
    return { email: 'An account with this email already exists. Sign in instead.' }
  }

  const extra = readExtraAccounts().filter((item) => item.email.toLowerCase() !== email)
  extra.push({
    name: values.name.trim().replace(/\s+/g, ' '),
    email: email,
    password: values.password,
  })
  writeExtraAccounts(extra)
  return {}
}

export function findAccount(email: string): AuthUser | undefined {
  const match = allAccounts().find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
  )
  if (!match) return undefined
  return { name: match.name, email: match.email }
}

export function demoAccount(): AuthUser {
  return { name: DEMO_USER.name, email: DEMO_USER.email }
}

export function shouldAutoDemoLogin(): boolean {
  try {
    return sessionStorage.getItem(SKIP_AUTO_KEY) !== '1'
  } catch {
    return true
  }
}

export function skipAutoDemoLogin(): void {
  try {
    sessionStorage.setItem(SKIP_AUTO_KEY, '1')
  } catch {
    // Ignore storage errors in private browsing.
  }
}

export function allowAutoDemoLogin(): void {
  try {
    sessionStorage.removeItem(SKIP_AUTO_KEY)
  } catch {
    // Ignore storage errors in private browsing.
  }
}

export function readSignedIn(): boolean {
  try {
    return sessionStorage.getItem(AUTH_FLAG) === '1' && Boolean(readCurrentUser())
  } catch {
    return false
  }
}

export function readCurrentUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function writeSession(user: AuthUser): void {
  try {
    sessionStorage.setItem(AUTH_FLAG, '1')
    sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    // Ignore storage errors in private browsing.
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(AUTH_FLAG)
    sessionStorage.removeItem(USER_KEY)
  } catch {
    // Ignore storage errors in private browsing.
  }
}
