export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

const avatarPalette = [
  '#f25c2a',
  '#1aa6a6',
  '#7b61ff',
  '#d4a017',
  '#3a86ff',
  '#e63946',
  '#2a9d8f',
  '#9b5de5',
]

export function avatarColor(seed: string): string {
  const total = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return avatarPalette[total % avatarPalette.length]
}
