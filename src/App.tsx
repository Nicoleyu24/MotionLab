import './index.css'
import { useState, useRef } from 'react'

import DarkVeil        from '@/components/DarkVeil'
import Aurora          from '@/components/Aurora'
import CircularText    from '@/components/CircularText'
import CircularGallery from '@/components/CircularGallery'
import DecryptedText   from '@/components/DecryptedText'
import GradientText    from '@/components/GradientText'
import DragReveal      from '@/components/DragReveal'
import LetterGlitch    from '@/components/LetterGlitch'

import DarkVeilCode        from '@/components/DarkVeil.tsx?raw'
import AuroraCode          from '@/components/Aurora.tsx?raw'
import CircularGalleryCode from '@/components/CircularGallery.tsx?raw'
import DecryptedTextCode   from '@/components/DecryptedText.tsx?raw'
import GradientTextCode    from '@/components/GradientText.tsx?raw'
import DragRevealCode      from '@/components/DragReveal.tsx?raw'
import LetterGlitchCode    from '@/components/LetterGlitch.tsx?raw'

// ── Types ───────────────────────────────────────────────────────────
interface ComponentData {
  name: string
  description: string
  tags: string[]
  code: string
  displayStyle: 'fill' | 'center'
  preview: React.ReactNode
}

// ── Bottom Sheet ────────────────────────────────────────────────────
function BottomSheet({ data, onClose }: { data: ComponentData | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!data) return
    await navigator.clipboard.writeText(data.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const open = data !== null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 inset-x-0 z-50 bg-[#111111] rounded-t-[24px] border-t border-white/[0.07] transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ height: '84vh', transform: open ? 'translateY(0)' : 'translateY(100%)' }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between"
          style={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '20px', paddingBottom: '12px' }}
        >
          <div className="flex flex-col" style={{ gap: '10px' }}>
            <h2 className="text-white text-[17px] font-semibold tracking-tight leading-tight">
              {data?.name}
            </h2>
            <p className="text-white/35 text-[13px]">{data?.description}</p>
          </div>
          <button
            onClick={onClose}
            style={{ marginTop: '10px' }}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/[0.07] hover:bg-white/[0.13] transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M10 1L1 10M1 1l9 9" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Tags + Copy icon */}
        <div
          className="flex items-center"
          style={{ paddingLeft: '40px', paddingRight: '40px', paddingBottom: '20px', gap: '8px' }}
        >
          {data?.tags.map(t => (
            <span
              key={t}
              className="text-[11px] text-white/50 bg-white/[0.05] border border-white/[0.08] rounded-full tracking-wide"
              style={{ padding: '5px 12px' }}
            >
              {t}
            </span>
          ))}
          <button
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center justify-center rounded-full transition-colors"
            style={{
              marginLeft: 'auto',
              width: '28px',
              height: '28px',
              background: copied ? '#22c55e22' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {copied ? (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1.5 6.5l3.5 3.5 6.5-7" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="1" y="4" width="8" height="8" rx="1.5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
                <path d="M4 4V2.5A1.5 1.5 0 015.5 1H10.5A1.5 1.5 0 0112 2.5V7.5A1.5 1.5 0 0110.5 9H9" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Preview area */}
        {data?.displayStyle === 'fill' ? (
          <div
            className="overflow-hidden relative"
            style={{
              marginLeft: '40px',
              marginRight: '40px',
              borderRadius: '18px',
              height: 'calc(84vh - 210px)',
            }}
          >
            <div className="absolute inset-0">
              {data.preview}
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center"
            style={{
              marginLeft: '40px',
              marginRight: '40px',
              borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.06)',
              height: 'calc(84vh - 210px)',
            }}
          >
            {data?.preview}
          </div>
        )}

      </div>
    </>
  )
}

// ── Card shell ─────────────────────────────────────────────────────
interface CardProps {
  name: string
  tag?: string
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

function Card({ name, tag, className = '', onClick, children }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setSpotlight(s => ({ ...s, x: e.clientX - rect.left, y: e.clientY - rect.top }))
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setSpotlight(s => ({ ...s, opacity: 1 }))}
      onMouseLeave={() => setSpotlight(s => ({ ...s, opacity: 0 }))}
      className={`
        relative overflow-hidden rounded-[18px]
        bg-[#0f0f0f] border border-white/[0.07]
        transition-all duration-300 hover:border-white/[0.15] hover:-translate-y-px
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Magic spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(600px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.07), transparent 70%)`,
        }}
      />
      {/* Border glow */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[18px] transition-opacity duration-500"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(400px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.12), transparent 60%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {children}
      </div>
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-3 left-4 text-[11px] font-medium tracking-widest uppercase text-white/40 pointer-events-none z-20">
        {name}
      </div>
      {tag && (
        <div className="absolute bottom-3 right-4 text-[10px] tracking-wider uppercase text-white/20 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full pointer-events-none z-20">
          {tag}
        </div>
      )}
    </div>
  )
}

// ── Component registry ──────────────────────────────────────────────
const COMPONENTS: Record<string, ComponentData> = {
  darkveil: {
    name: 'Dark Veil',
    description: 'WebGL distortion with warp and scanline effects',
    tags: ['React', 'TailwindCSS', 'Shadcn'],
    code: DarkVeilCode,
    displayStyle: 'fill',
    preview: (
      <DarkVeil hueShift={10} noiseIntensity={0} scanlineIntensity={0} speed={0.8} scanlineFrequency={0} warpAmount={0.2} resolutionScale={1} />
    ),
  },
  aurora: {
    name: 'Circulated Text on Aurora',
    description: 'Fluid aurora borealis background animation',
    tags: ['React', 'TailwindCSS', 'Shadcn'],
    code: AuroraCode,
    displayStyle: 'fill',
    preview: (
      <div className="relative w-full h-full">
        <Aurora colorStops={['#6320ff', '#00c8ff', '#00ff96']} amplitude={1.2} blend={0.6} />
        <div className="absolute inset-0 flex items-center justify-center">
          <CircularText text="Hi, I am Nicole ·" spinDuration={12} onHover="speedUp" className="text-white/80" />
        </div>
      </div>
    ),
  },
  circulargallery: {
    name: 'Circular Gallery',
    description: 'Draggable 3D circular carousel of images',
    tags: ['React', 'TailwindCSS', 'OGL'],
    code: CircularGalleryCode,
    displayStyle: 'fill',
    preview: (
      <CircularGallery
        items={[
          { image: '/IMG_0478 1.png', text: 'Market' },
          { image: '/IMG_9076 1.png', text: 'Sunset' },
          { image: '/IMG_2106 1.png', text: 'Forest' },
          { image: '/IMG_2016 1.png', text: 'Autumn' },
        ]}
        bend={3}
        textColor="#ffffff"
        borderRadius={0.05}
      />
    ),
  },
  decryptedtext: {
    name: 'Decrypted Text',
    description: 'Scrambled character reveal animation',
    tags: ['React', 'TailwindCSS', 'Shadcn'],
    code: DecryptedTextCode,
    displayStyle: 'center',
    preview: (
      <DecryptedText text="Hacking the future" speed={80} maxIterations={12} sequential revealDirection="start" className="text-[28px] font-bold tracking-tight text-white" />
    ),
  },
  dragreveal: {
    name: 'Drag Reveal',
    description: 'Pull-to-reveal letter with stroke animation and progress',
    tags: ['React', 'Framer Motion', 'TailwindCSS'],
    code: DragRevealCode,
    displayStyle: 'fill',
    preview: <DragReveal modal />,
  },
}

// ── App ────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<ComponentData | null>(null)

  const open = (key: string) => setActive(COMPONENTS[key])
  const close = () => setActive(null)

  return (
    <div className="min-h-screen bg-[#080808] pb-20 antialiased" style={{ paddingLeft: '60px', paddingRight: '60px', paddingTop: '20px' }}>

      {/* ── Header ── */}
      <header className="mx-auto flex items-end justify-between" style={{ marginBottom: '40px' }}>
        <div>
          <h1 className="text-[13px] font-medium tracking-[0.12em] uppercase text-white/80">
            Motion Lab
          </h1>
          <p className="text-[11px] text-white/30 tracking-[0.06em]" style={{ marginTop: '10px' }}>
            My hearted react motions
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-[11px] text-white/30 tracking-[0.06em]">
            All work curated by <a href="https://nyfish.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@Nicole Yu</a>
          </p>
          <div className="flex items-center gap-2 text-[11px] text-white/30 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e88] animate-pulse" />
            5 components
          </div>
        </div>
      </header>

      {/* ── Bento Grid ── */}
      <div
        className="grid gap-[40px]"
        style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: '200px' }}
      >
        <Card name="Dark Veil" tag="Background" className="col-span-6 row-span-2" onClick={() => open('darkveil')}>
          <div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
            <DarkVeil hueShift={10} noiseIntensity={0} scanlineIntensity={0} speed={0.8} scanlineFrequency={0} warpAmount={0.2} resolutionScale={1} />
          </div>
        </Card>

        <Card name="Circulated Text on Aurora" tag="Background" className="col-span-6 row-span-2" onClick={() => open('aurora')}>
          <div className="relative w-full h-full">
            <Aurora colorStops={['#6320ff', '#00c8ff', '#00ff96']} amplitude={1.2} blend={0.6} />
            <div className="absolute inset-0 flex items-center justify-center">
              <CircularText text="Hi, I am Nicole ·" spinDuration={12} onHover="speedUp" className="text-white/80" />
            </div>
          </div>
        </Card>

        <Card name="Circular Gallery" tag="Carousel" className="col-span-4" onClick={() => open('circulargallery')}>
          <CircularGallery
            items={[
              { image: '/IMG_0478 1.png', text: 'Market' },
              { image: '/IMG_9076 1.png', text: 'Sunset' },
              { image: '/IMG_2106 1.png', text: 'Forest' },
              { image: '/IMG_2016 1.png', text: 'Autumn' },
            ]}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
          />
        </Card>

        <Card name="Decrypted Text" tag="Text" className="col-span-4" onClick={() => open('decryptedtext')}>
          <DecryptedText text="Hacking the future" speed={80} maxIterations={12} sequential revealDirection="start" className="text-[22px] font-bold tracking-tight text-white" />
        </Card>

        <Card name="Drag Reveal" tag="Interaction" className="col-span-4" onClick={() => open('dragreveal')}>
          <DragReveal />
        </Card>
      </div>

      {/* ── Bottom Sheet ── */}
      <BottomSheet data={active} onClose={close} />
    </div>
  )
}
