/**
 * Datos generales de la marca. Todo lo que aparece en la página (nombre, contacto, redes) se cambia aquí.
 *
 * Redes sociales: pegue el enlace completo de su perfil entre las comillas. Las que queden vacías ("") no se
 * muestran en la página, así nunca aparece un enlace roto ni un perfil que no es suyo.
 */

export type SocialId = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'whatsapp' | 'github'

// En el navegador las variables llegan por import.meta.env; al generar las páginas (Node), por process.env.
const env: Record<string, string | undefined> =
  (import.meta as { env?: Record<string, string | undefined> }).env ??
  (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ??
  {}

export const site = {
  brand: 'JoabSystems',
  slogan: 'Tecnología para hacer crecer tu negocio',
  owner: 'Joab Chavez Romero',
  country: 'Perú',
  /** Dirección pública de la página, sin barra al final (para las vistas previas al compartir). */
  url: (env.VITE_SITE_URL ?? 'https://jcramigofiel20-collab.github.io').replace(/\/$/, ''),
  /** Versión de esta página web (se muestra en la barra superior). */
  webVersion: '1.0',

  contact: {
    phoneDisplay: '+51 929 509 865',
    /** Solo números, con código de país (para WhatsApp y llamadas). */
    phoneDigits: '51929509865',
    email: '',
    hours: 'Lunes a sábado',
  },

  socials: {
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    whatsapp: 'https://wa.me/51929509865',
    github: 'https://github.com/jcramigofiel20-collab',
  } satisfies Record<SocialId, string>,
}

