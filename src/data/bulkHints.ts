// Nombres "bonitos" y categorías sugeridas para la carga masiva.
// La clave es el nombre del archivo en minúsculas y sin símbolos ni extensión.
// Si un archivo no está aquí, se usa su nombre tal cual y sin categorías.
export interface BulkHint {
  name: string
  categories: string[]
}

const MULTI = 'Multijugador / Dos jugadores'

export const BULK_HINTS: Record<string, BulkHint> = {
  animalcrossing: { name: 'Animal Crossing', categories: ['Simulación', MULTI] },
  arksurvivalevolved: { name: 'ARK Survival Evolved', categories: ['Aventura', 'Mundo abierto', MULTI] },
  crashbandicoot4: { name: 'Crash Bandicoot 4', categories: ['Plataformas', 'Aventura'] },
  crashctr: { name: 'Crash CTR', categories: ['Carreras', MULTI] },
  darksouls: { name: 'Dark Souls', categories: ['RPG', 'Acción'] },
  diablo3: { name: 'Diablo 3', categories: ['RPG', 'Acción', MULTI] },
  dragonballzkakarot: { name: 'Dragon Ball Z Kakarot', categories: ['RPG', 'Acción', 'Mundo abierto'] },
  dragonballfghterz: { name: 'Dragon Ball FighterZ', categories: ['Lucha', MULTI] },
  inmortalsfenixrising: { name: 'Immortals Fenyx Rising', categories: ['Aventura', 'Acción', 'Mundo abierto'] },
  kirbyforgottenland: { name: 'Kirby Forgotten Land', categories: ['Plataformas', 'Aventura', MULTI] },
  metroiddread: { name: 'Metroid Dread', categories: ['Acción', 'Aventura', 'Plataformas'] },
  metroidprime: { name: 'Metroid Prime', categories: ['Disparos (Shooter)', 'Aventura'] },
  minecraft: { name: 'Minecraft', categories: ['Aventura', 'Mundo abierto', 'Simulación', MULTI] },
  mortalkombat11: { name: 'Mortal Kombat 11', categories: ['Lucha', MULTI] },
  narutoshippudenultimateninjastorm4roadtoboruto: {
    name: 'Naruto Shippuden Ultimate Ninja Storm 4 Road To Boruto',
    categories: ['Lucha', 'Acción', MULTI],
  },
  nintendosports: { name: 'Nintendo Sports', categories: ['Deportes', MULTI] },
  overcooked2gourmetedition: { name: 'Overcooked 2 Gourmet Edition', categories: ['Simulación', MULTI] },
  pikmin3deluxe: { name: 'Pikmin 3 Deluxe', categories: ['Estrategia', 'Aventura', MULTI] },
  pikmin4: { name: 'Pikmin 4', categories: ['Estrategia', 'Aventura'] },
  pokemonevee: { name: 'Pokemon Eevee', categories: ['RPG', 'Aventura'] },
  pokemonperla: { name: 'Pokemon Perla', categories: ['RPG', 'Aventura'] },
  pokemonpikachu: { name: 'Pokemon Pikachu', categories: ['RPG', 'Aventura'] },
  skyrimtheelderscrollsv: { name: 'Skyrim The Elder Scrolls V', categories: ['RPG', 'Mundo abierto', 'Aventura'] },
  splatoon2: { name: 'Splatoon 2', categories: ['Disparos (Shooter)', MULTI] },
  splatoon3: { name: 'Splatoon 3', categories: ['Disparos (Shooter)', MULTI] },
  thewitcherwildhuntcompleteedition: {
    name: 'The Witcher Wild Hunt Complete Edition',
    categories: ['RPG', 'Mundo abierto', 'Aventura'],
  },
  tomodachilife: { name: 'Tomodachi Life', categories: ['Simulación'] },
  xenoblade3: { name: 'Xenoblade 3', categories: ['RPG', 'Aventura', 'Mundo abierto'] },
  yoshicraftedworld: { name: 'Yoshi Crafted World', categories: ['Plataformas', 'Aventura', MULTI] },
}

export function normalizeFileKey(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function hintForFile(filename: string): BulkHint {
  const hint = BULK_HINTS[normalizeFileKey(filename)]
  if (hint) return hint
  return { name: filename.replace(/\.[^.]+$/, '').trim(), categories: [] }
}
