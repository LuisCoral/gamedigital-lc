// Normaliza texto para buscar: sin acentos, en minúsculas y sin símbolos.
// Así "pokemon", "Pokémon" y "POKÉMON" se consideran lo mismo.
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Todas las palabras escritas deben aparecer en el nombre (en cualquier orden).
export function matchesSearch(name: string, query: string): boolean {
  const words = normalizeText(query).split(' ').filter(Boolean)
  if (words.length === 0) return true
  const target = normalizeText(name)
  return words.every((w) => target.includes(w))
}
