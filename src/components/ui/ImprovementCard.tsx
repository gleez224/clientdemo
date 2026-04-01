import { motion } from 'framer-motion'
import type { Improvement } from '@/types'

interface ImprovementCardProps extends Improvement {
  delay?: number
}

export default function ImprovementCard({
  messageIndex,
  whatYouSaid,
  whyItFailed,
  whatToSayInstead,
  delay = 0,
}: ImprovementCardProps) {
  return (
    <motion.div
      className="rounded-xl overflow-hidden border border-black/8 dark:border-white/8 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 380, damping: 30 }}
    >
      {/* Card header */}
      <div className="px-4 pt-3 pb-2">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-black/30 dark:text-white/30">
          Message {messageIndex}
        </span>
      </div>

      {/* What you said — red left border */}
      <div className="mx-3 mb-2 pl-3 border-l-2 border-red-400/70 bg-red-400/5 rounded-r-lg py-2 pr-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400/80 mb-1">
          What you said
        </p>
        <p className="text-sm text-black/50 dark:text-white/40 italic leading-snug">
          "{whatYouSaid}"
        </p>
      </div>

      {/* What to say instead — green left border */}
      <div className="mx-3 mb-2 pl-3 border-l-2 border-emerald-400/70 bg-emerald-400/5 rounded-r-lg py-2 pr-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/80 mb-1">
          What to say instead
        </p>
        <p className="text-sm text-black/80 dark:text-white/80 leading-snug">
          "{whatToSayInstead}"
        </p>
      </div>

      {/* Why it failed — muted */}
      <div className="px-4 pb-3">
        <p className="text-[11px] text-black/40 dark:text-white/35 leading-snug">
          {whyItFailed}
        </p>
      </div>
    </motion.div>
  )
}
