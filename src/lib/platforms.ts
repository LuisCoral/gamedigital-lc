import { Gamepad2, Joystick, MonitorSmartphone, type LucideIcon } from 'lucide-react'
import type { Platform } from './types'

export interface PlatformMeta {
  label: string // nombre completo, ej: "PlayStation 5"
  shortLabel: string // nombre corto para tarjetas y badges, ej: "PS5"
  accent: string // color inspirado en la marca de la consola
  icon: LucideIcon
}

export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  PS4: {
    label: 'PlayStation 4',
    shortLabel: 'PS4',
    accent: '#0070D1', // azul PlayStation clásico
    icon: Gamepad2,
  },
  PS5: {
    label: 'PlayStation 5',
    shortLabel: 'PS5',
    accent: '#2D9CFF', // azul PlayStation más claro, distingue la nueva generación
    icon: Gamepad2,
  },
  Nintendo: {
    label: 'Nintendo Switch',
    shortLabel: 'Nintendo',
    accent: '#E4000F', // rojo Nintendo
    icon: Joystick,
  },
  Switch2: {
    label: 'Nintendo Switch 2',
    shortLabel: 'Switch 2',
    accent: '#00C3E3', // azul Joy-Con, distingue la nueva consola dentro de la familia Nintendo
    icon: MonitorSmartphone,
  },
}

export const PLATFORMS: Platform[] = ['PS4', 'PS5', 'Nintendo', 'Switch2']
