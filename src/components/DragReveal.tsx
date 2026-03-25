import {
  useMotionValue,
  useTransform,
  motion,
  animate,
  useMotionValueEvent,
} from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'

// Italic cursive "N" as a single continuous stroke path
const N_PATH =
  'M 9 58 C 7 52 7 16 9 8 C 11 2 14 2 17 9 L 31 55 C 33 61 35 57 35 51 L 35 7'

export default function DragReveal({ modal = false }: { modal?: boolean }) {
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLen, setPathLen] = useState(220)
  const [pct, setPct] = useState(0)

  const y = useMotionValue(0)
  const MAX = 68

  const progress = useTransform(y, [0, MAX], [0, 100], { clamp: true })
  useMotionValueEvent(progress, 'change', v => setPct(Math.round(v)))

  const dashOffset = useTransform(progress, [0, 100], [pathLen, 0])
  const strokeColor = useTransform(
    progress,
    [0, 80, 100],
    ['#3a3a3a', '#ffffff', '#10b981'],
  )

  useLayoutEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength())
  }, [])

  const svgW = modal ? 98 : 58
  const svgH = modal ? 115 : 75

  return (
    <div
      className="flex flex-col items-center w-full h-full select-none pb-0 gap-1"
      style={{ paddingTop: modal ? 66 : 46 }}
    >
      {/* Italic N */}
      <svg viewBox="0 0 44 66" width={svgW} height={svgH} overflow="visible">
        {/* Dim track */}
        <path
          ref={pathRef}
          d={N_PATH}
          stroke="#1e1e1e"
          strokeWidth="4.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Animated reveal */}
        <motion.path
          d={N_PATH}
          fill="none"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            stroke: strokeColor,
            strokeDasharray: pathLen,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>

      {/* Percentage */}
      <span className="text-[11px] font-mono text-white/30 tabular-nums leading-none">
        {pct}%
      </span>

      {/* Separator */}
      <div className="w-full border-t border-white/[0.06] mt-2" />

      {/* Label */}
      <p className="text-[9px] tracking-[0.18em] uppercase text-white/20 mt-2">
        Drag here
      </p>

      {/* Drag handle — travels down and exits the card */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: MAX }}
        dragElastic={0.06}
        dragMomentum={false}
        style={{ y }}
        onDragEnd={() => {
          if (y.get() < MAX * 0.88) {
            animate(y, 0, { type: 'spring', stiffness: 380, damping: 28 })
          }
        }}
        className="mt-1 w-9 h-1 rounded-full bg-white/20 cursor-grab active:cursor-grabbing hover:bg-white/35 transition-colors"
      />
    </div>
  )
}
