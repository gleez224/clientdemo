import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { AnimatedCircularProgressBar } from '@/components/ui/AnimatedCircularProgressBar'
import type { ScoreResult } from '@/types'

interface ScoreScreenProps {
  scoreResult: ScoreResult
  outcome: 'closed' | 'walked' | 'ghosted'
  personaName: string
  onTryAgain: () => void
  onSwitchClient: () => void
}

const outcomeLabel: Record<string, string> = {
  closed: 'CLOSED',
  walked: 'WALKED',
  ghosted: 'GHOSTED',
}


const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 28 } },
}

export default function ScoreScreen({
  scoreResult,
  outcome,
  personaName,
  onTryAgain,
  onSwitchClient,
}: ScoreScreenProps) {
  const { score, pass, strengths, improvements, summary } = scoreResult

  // Ring CSS transition: start at 0, set to score after paint so transition fires
  const [displayValue, setDisplayValue] = useState(0)

  // Framer Motion counter for the number inside the ring
  const countMV = useMotionValue(0)
  const roundedCount = useTransform(countMV, (v) => String(Math.round(v)))

  useEffect(() => {
    // Small delay so component is mounted before CSS transition fires
    const t = setTimeout(() => setDisplayValue(score), 80)
    animate(countMV, score, { duration: 1.5, ease: 'easeOut' })
    return () => clearTimeout(t)
  }, [score]) // eslint-disable-line react-hooks/exhaustive-deps

  const strengthsDelay = 2.0
  const improvementsDelay = strengthsDelay + strengths.length * 0.04 + 0.12
  const buttonsDelay = improvementsDelay + improvements.length * 0.04 + 0.12

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col overflow-y-auto bg-[#f4f4f6] dark:bg-[#08080a]"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="flex flex-col items-center gap-6 px-6 py-10 max-w-2xl mx-auto w-full">

        {/* Header */}
        <motion.div
          className="flex flex-col items-center gap-1 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-black/40 dark:text-white/40">
            Session with {personaName}
          </p>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            How'd you do?
          </h2>
        </motion.div>

        {/* Ring + counter */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 24 }}
        >
          <AnimatedCircularProgressBar
            max={100}
            min={0}
            value={displayValue}
            gaugePrimaryColor="#de3582"
            gaugeSecondaryColor="rgba(94,46,136,0.15)"
            className="size-36 [--transition-length:1.5s]"
          />
          {/* Overlay our own Framer Motion counter, hiding the component's built-in number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span className="text-3xl font-bold text-black dark:text-white tabular-nums">
              {roundedCount}
            </motion.span>
          </div>
        </motion.div>

        {/* PASS / FAIL badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className={`px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase ${
            pass
              ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
              : 'text-red-400 bg-red-400/10 border-red-400/20'
          }`}
        >
          {pass ? 'Pass' : 'Fail'} · {outcomeLabel[outcome]}
        </motion.div>

        {/* Summary */}
        <motion.p
          className="text-sm text-center text-black/60 dark:text-white/60 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          {summary}
        </motion.p>

        {/* Strengths */}
        {strengths.length > 0 && (
          <motion.div
            className="w-full glass rounded-2xl p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: strengthsDelay - 0.1 }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-black/40 dark:text-white/40 mb-3">
              Strengths
            </p>
            <motion.ul
              className="flex flex-col gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.04, delayChildren: strengthsDelay },
                },
              }}
            >
              {strengths.map((s, i) => (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-2 text-sm text-black/80 dark:text-white/80"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {s}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}

        {/* Improvements */}
        {improvements.length > 0 && (
          <motion.div
            className="w-full glass rounded-2xl p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: improvementsDelay - 0.1 }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-black/40 dark:text-white/40 mb-3">
              Improvements
            </p>
            <motion.ul
              className="flex flex-col gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.04, delayChildren: improvementsDelay },
                },
              }}
            >
              {improvements.map((item, i) => (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-2 text-sm text-black/80 dark:text-white/80"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>
                    <span className="font-semibold text-black/50 dark:text-white/40 mr-1">
                      msg {item.message}
                    </span>
                    {item.issue}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}

        {/* Buttons */}
        <motion.div
          className="flex gap-3 w-full pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: buttonsDelay }}
        >
          <button
            onClick={onTryAgain}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-gradient-accent text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <button
            onClick={onSwitchClient}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Switch client
          </button>
        </motion.div>

      </div>
    </motion.div>
  )
}
