import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { SparklesCore } from './Sparkles'

interface ClosingSuggestionCardProps {
  suggestion: string
  delay?: number
}

export default function ClosingSuggestionCard({
  suggestion,
  delay = 0,
}: ClosingSuggestionCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(suggestion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 dark:bg-black/60 backdrop-blur-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 24 }}
    >
      {/* Sparkles background */}
      <div className="absolute inset-0 pointer-events-none">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#de3582"
          speed={1.2}
        />
      </div>

      <div className="relative z-10 p-5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex flex-col gap-0.5">
          <p
            className="text-sm font-bold tracking-wide"
            style={{
              background: 'linear-gradient(90deg, #de3582, #5e2e88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ✦ AI Closing Suggestion
          </p>
          <p className="text-[11px] text-white/40">
            Here's how you could have turned this around:
          </p>
        </div>

        {/* Suggestion text */}
        <div className="rounded-xl bg-white/[0.06] border border-white/8 px-4 py-3">
          <p className="text-sm text-white/85 leading-relaxed italic">
            "{suggestion}"
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-white/10 bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy this message
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
