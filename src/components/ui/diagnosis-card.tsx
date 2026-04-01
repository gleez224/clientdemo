import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import AnimatedText from '@/components/ui/animated-text'
import type { Cause } from '@/data/causes'

interface DiagnosisCardProps {
  cause: Cause
  animationDelay?: number
}

export default function DiagnosisCard({ cause, animationDelay = 0 }: DiagnosisCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    })
  }

  const handleMouseLeave = () => {
    setSpotlight((prev) => ({ ...prev, visible: false }))
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: animationDelay }}
    >
      {/* Outer wrapper carries the rounded border for GlowingEffect */}
      <div className="relative rounded-[1.25rem] border border-black/8 dark:border-white/8 p-[1px]">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />

        {/* Inner card */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setExpanded((prev) => !prev)}
          className={cn(
            'relative rounded-[1.2rem] overflow-hidden cursor-pointer',
            'bg-white/70 dark:bg-white/[0.04]',
            'backdrop-blur-xl',
            'border border-black/6 dark:border-white/6',
            'transition-transform duration-200 ease-out',
            'hover:-translate-y-[2px]',
            'select-none'
          )}
        >
          {/* Spotlight overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
            style={{
              opacity: spotlight.visible ? 1 : 0,
              background: `radial-gradient(200px circle at ${spotlight.x}px ${spotlight.y}px, rgba(94,46,136,0.10), transparent 70%)`,
            }}
          />

          {/* Card content */}
          <div className="relative z-20 p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Card number */}
                <span className="text-xs font-semibold tracking-widest text-gradient-accent uppercase mb-2 block">
                  {String(cause.id).padStart(2, '0')}
                </span>

                {/* Title with AnimatedText */}
                <AnimatedText
                  text={cause.title}
                  animationType="words"
                  className="text-lg font-bold text-black dark:text-white leading-snug"
                  duration={0.4}
                  staggerDelay={0.04}
                />

                {/* Body */}
                <p className="mt-2 text-sm font-normal text-black/45 dark:text-white/50 leading-relaxed">
                  {cause.body}
                </p>
              </div>

              {/* Chevron */}
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="mt-1 shrink-0 text-black/30 dark:text-white/30"
              >
                <ChevronDown size={18} strokeWidth={1.75} />
              </motion.div>
            </div>

            {/* Accordion detail */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="detail"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-black/8 dark:border-white/8">
                    <p className="text-sm font-normal text-black/60 dark:text-white/60 leading-relaxed">
                      {cause.detail}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
