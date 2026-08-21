export function textMatches(value: string, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return value.toLowerCase().includes(needle)
}
