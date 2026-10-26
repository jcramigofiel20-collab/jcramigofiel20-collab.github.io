import type { ReactNode } from 'react'

/**
 * Muestra las notas de versión de GitHub (Markdown sencillo) sin insertar HTML: títulos, listas, párrafos,
 * **negritas**, `código` y [enlaces](https://…).
 */

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const key = `${keyBase}-${i++}`
    if (m[2]) out.push(<strong key={key} className="font-semibold text-white">{m[2]}</strong>)
    else if (m[3]) out.push(<code key={key} className="rounded bg-white/10 px-1.5 py-0.5 text-[0.85em] text-cyan-200">{m[3]}</code>)
    else if (m[4] && m[5])
      out.push(
        <a key={key} href={m[5]} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline-offset-4 hover:underline">
          {m[4]}
        </a>,
      )
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({ source }: { source: string }) {
  const blocks: ReactNode[] = []
  let list: string[] = []
  let para: string[] = []
  const flushList = () => {
    if (list.length) {
      const k = blocks.length
      blocks.push(
        <ul key={`ul-${k}`} className="my-3 list-disc space-y-1.5 pl-5 marker:text-cyan-400">
          {list.map((item, i) => <li key={i}>{inline(item, `li-${k}-${i}`)}</li>)}
        </ul>,
      )
      list = []
    }
  }
  const flushPara = () => {
    if (para.length) {
      const k = blocks.length
      blocks.push(<p key={`p-${k}`} className="my-3">{inline(para.join(' '), `p-${k}`)}</p>)
      para = []
    }
  }
  for (const raw of source.replace(/\r/g, '').split('\n')) {
    const line = raw.trim()
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    const item = /^[-*]\s+(.*)$/.exec(line)
    if (!line) {
      flushList()
      flushPara()
    } else if (heading) {
      flushList()
      flushPara()
      const k = blocks.length
      blocks.push(<h4 key={`h-${k}`} className="mt-5 mb-2 font-display text-base font-semibold text-white">{inline(heading[2], `h-${k}`)}</h4>)
    } else if (item) {
      flushPara()
      list.push(item[1])
    } else {
      flushList()
      para.push(line)
    }
  }
  flushList()
  flushPara()
  return <div className="text-sm leading-relaxed text-slate-300">{blocks}</div>
}
