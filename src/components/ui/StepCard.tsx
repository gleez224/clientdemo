import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Step } from '@/data/framework'

interface StepCardProps {
  step: Step
}

export default function StepCard({ step }: StepCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex gap-4 group"
    >
      {/* Left column — node only, line is handled by parent */}
      <div className="flex flex-col items-center shrink-0 w-12">
        {/* Pulse node */}
        <div className="relative flex items-center justify-center w-10 h-10 mt-1 shrink-0">
          {/* Ping ring on hover */}
          <span className="absolute inset-0 rounded-full bg-brand-purple opacity-0 group-hover:opacity-25 group-hover:animate-ping" />
          {/* Node circle */}
          <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/70 dark:bg-white/[0.06] border border-black/10 dark:border-white/10 backdrop-blur-sm">
            <span className="text-xs font-bold text-gradient-accent">
              {String(step.id).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Right column — content card */}
      <div
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          'flex-1 mb-4 rounded-xl cursor-pointer',
          'bg-white/70 dark:bg-white/[0.04]',
          'backdrop-blur-xl',
          'border border-black/8 dark:border-white/8',
          'transition-transform duration-200 ease-out hover:-translate-y-[2px]',
          'select-none'
        )}
      >
        <div className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-black dark:text-white leading-snug">
                {step.title}
              </h3>
              <p className="mt-1 text-sm font-normal text-black/45 dark:text-white/50 leading-relaxed">
                {step.body}
              </p>
            </div>

            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="mt-0.5 shrink-0 text-black/30 dark:text-white/30"
            >
              <ChevronDown size={16} strokeWidth={1.75} />
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
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
