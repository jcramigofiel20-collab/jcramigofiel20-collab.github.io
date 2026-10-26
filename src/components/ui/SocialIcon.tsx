import { siFacebook, siGithub, siInstagram, siTiktok, siWhatsapp, siYoutube } from 'simple-icons'
import { site, type SocialId } from '../../config/site'

const brands: Record<SocialId, { label: string; path: string; hover: string }> = {
  facebook: { label: 'Facebook', path: siFacebook.path, hover: 'hover:text-[#1877F2] hover:bg-[#1877F2]/10' },
  instagram: { label: 'Instagram', path: siInstagram.path, hover: 'hover:text-[#E4405F] hover:bg-[#E4405F]/10' },
  tiktok: { label: 'TikTok', path: siTiktok.path, hover: 'hover:text-white hover:bg-white/10' },
  youtube: { label: 'YouTube', path: siYoutube.path, hover: 'hover:text-[#FF0000] hover:bg-[#FF0000]/10' },
  whatsapp: { label: 'WhatsApp', path: siWhatsapp.path, hover: 'hover:text-[#25D366] hover:bg-[#25D366]/10' },
  github: { label: 'GitHub', path: siGithub.path, hover: 'hover:text-white hover:bg-white/10' },
}

export function BrandSvg({ id, className = 'size-[18px]' }: { id: SocialId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={brands[id].path} />
    </svg>
  )
}

/** Redes con enlace configurado en src/config/site.ts (las vacías no se muestran). */
export const activeSocials = () =>
  (Object.keys(site.socials) as SocialId[]).filter((id) => site.socials[id].trim() !== '')

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={compact ? 'flex flex-col items-center gap-1.5' : 'flex flex-wrap gap-1.5'}>
      {activeSocials().map((id) => (
        <li key={id}>
          <a
            href={site.socials[id]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${brands[id].label} de ${site.brand}`}
            title={brands[id].label}
            className={`grid size-9 place-items-center rounded-xl border border-white/8 text-slate-400 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 ${brands[id].hover}`}
          >
            <BrandSvg id={id} />
          </a>
        </li>
      ))}
    </ul>
  )
}
