import {
  BadgeCheck,
  Building2,
  CalendarCheck,
  ClipboardList,
  Home,
  MessageCircle,
  Receipt,
  ShieldCheck,
  Sofa,
  Sparkles,
  SprayCan,
  Timer,
  Users,
} from 'lucide-react'

/**
 * Mapa nombre → componente de icono.
 * Permite que los archivos de /data guarden solo strings (serializables),
 * pensando en una futura API.
 */
const icons = {
  BadgeCheck,
  Building2,
  CalendarCheck,
  ClipboardList,
  Home,
  MessageCircle,
  Receipt,
  ShieldCheck,
  Sofa,
  Sparkles,
  SprayCan,
  Timer,
  Users,
}

export function getIcon(name) {
  return icons[name] ?? Sparkles
}
