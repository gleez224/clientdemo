import { AnimatePresence, motion } from 'framer-motion'
import BusinessOnboarding from '@/components/ui/BusinessOnboarding'
import { VoicePoweredOrb } from '@/components/ui/voice-powered-orb'
import { useGeneratePersonas } from '@/hooks/useGeneratePersonas'
import type { BusinessContext, Persona } from '@/types'

interface BusinessContextPageProps {
  onComplete: (ctx: BusinessContext, personas: Persona[]) => void
}

export default function BusinessContextPage({ onComplete }: BusinessContextPageProps) {
  const { generate, isGenerating, error } = useGeneratePersonas()

  const handleSubmit = async (ctx: BusinessContext) => {
    const personas = await generate(ctx)
    if (personas) {
      onComplete(ctx, personas)
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      <AnimatePresence mode="wait">
        {!isGenerating ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col flex-1 min-h-0"
          >
            <BusinessOnboarding onSubmit={handleSubmit} />
            {error && (
              <p className="text-center text-sm text-red-500 dark:text-red-400 pb-6 px-6">
                {error}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1 items-center justify-center gap-6"
          >
            <div className="w-20 h-20 animate-pulse">
              <VoicePoweredOrb enableVoiceControl={false} />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-base font-semibold text-black dark:text-white">
                Building your practice clients…
              </p>
              <p className="text-sm text-black/45 dark:text-white/50">
                Generating personas specific to your offer
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
