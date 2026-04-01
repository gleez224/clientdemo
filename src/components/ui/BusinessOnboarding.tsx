import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { BusinessContext } from '@/types'

interface BusinessOnboardingProps {
  onSubmit: (context: BusinessContext) => void
}

const fields: {
  key: keyof BusinessContext
  label: string
  placeholder: string
}[] = [
  {
    key: 'whatYouSell',
    label: 'What do you sell?',
    placeholder: 'e.g. Social media management for local businesses',
  },
  {
    key: 'targetClient',
    label: "Who's your target client?",
    placeholder: 'e.g. Restaurant owners with under 5 staff',
  },
  {
    key: 'pitch',
    label: 'Your one-line pitch',
    placeholder: 'e.g. We handle your entire social presence for a flat monthly fee',
  },
  {
    key: 'pricing',
    label: 'Your pricing model',
    placeholder: 'e.g. $997/month, no contracts',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function BusinessOnboarding({ onSubmit }: BusinessOnboardingProps) {
  const [form, setForm] = useState<BusinessContext>({
    whatYouSell: '',
    targetClient: '',
    pitch: '',
    pricing: '',
  })

  const allFilled = Object.values(form).every((v) => v.trim().length > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!allFilled) return
    onSubmit({
      whatYouSell: form.whatYouSell.trim(),
      targetClient: form.targetClient.trim(),
      pitch: form.pitch.trim(),
      pricing: form.pricing.trim(),
    })
  }

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-6 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-xl">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-black/40 dark:text-white/40 mb-2">
            Before you practice
          </p>
          <h2 className="text-3xl font-bold text-black dark:text-white leading-tight">
            Tell us what you're pitching.
          </h2>
          <p className="mt-2 text-base text-black/50 dark:text-white/50">
            Your answers get injected into every persona so they react to your actual offer — not a generic pitch.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {fields.map((field) => (
            <motion.div key={field.key} variants={itemVariants} className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-black/70 dark:text-white/70">
                {field.label}
              </label>
              <input
                type="text"
                value={form[field.key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-xl text-sm
                  bg-white/70 dark:bg-white/[0.04]
                  border border-black/10 dark:border-white/[0.08]
                  text-black dark:text-white
                  placeholder:text-black/30 dark:placeholder:text-white/25
                  focus:outline-none focus:ring-2 focus:ring-[#de3582]/40
                  transition-all duration-150"
              />
            </motion.div>
          ))}

          <motion.div variants={itemVariants} className="pt-2">
            <button
              type="submit"
              disabled={!allFilled}
              className={`
                w-full py-3.5 rounded-2xl text-sm font-bold
                flex items-center justify-center gap-2
                transition-all duration-200
                ${allFilled
                  ? 'bg-gradient-accent text-white shadow-lg hover:opacity-90 active:scale-[0.98]'
                  : 'bg-black/5 dark:bg-white/5 text-black/30 dark:text-white/30 cursor-not-allowed'
                }
              `}
            >
              Start Training
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}
