import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { ProfileCard } from '@/components/ui/ProfileCard'
import BusinessContextPage from '@/pages/BusinessContextPage'
import ChatScreen from '@/pages/ChatScreen'
import { formatCount } from '@/data/personas'
import type { Persona } from '@/data/personas'
import type { BusinessContext } from '@/types'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeInOut' } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function DemoPage() {
  const [businessContext, setBusinessContext] = useState<BusinessContext | null>(null)
  const [generatedPersonas, setGeneratedPersonas] = useState<Persona[] | null>(null)
  const [activePersona, setActivePersona] = useState<Persona | null>(null)

  const handleComplete = (ctx: BusinessContext, personas: Persona[]) => {
    setBusinessContext(ctx)
    setGeneratedPersonas(personas)
  }

  const handleChangePitch = () => {
    setBusinessContext(null)
    setGeneratedPersonas(null)
    setActivePersona(null)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <AnimatePresence mode="wait">

        {/* ── Onboarding + loading ── */}
        {!businessContext && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col flex-1 min-h-0"
          >
            <BusinessContextPage onComplete={handleComplete} />
          </motion.div>
        )}

        {/* ── Persona select ── */}
        {businessContext && generatedPersonas && !activePersona && (
          <motion.div
            key="select"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full"
          >
            <div className="mb-10">
              <button
                onClick={handleChangePitch}
                className="flex items-center gap-1.5 text-xs font-medium text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70 transition-colors mb-4"
              >
                <ArrowLeft size={12} strokeWidth={2} />
                Change your pitch
              </button>
              <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                Choose Your Client
              </h2>
              <p className="text-base text-black/45 dark:text-white/50">
                Pick a persona and practice your pitch against a real objection type. No softballs.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              {generatedPersonas.map((persona) => (
                <motion.div
                  key={persona.id}
                  variants={cardVariants}
                  onClick={() => setActivePersona(persona)}
                >
                  <ProfileCard
                    name={persona.name}
                    description={`${persona.archetype} — ${persona.description}`}
                    image={persona.image}
                    isVerified={false}
                    followers={formatCount(persona.followers) as unknown as number}
                    following={formatCount(persona.following) as unknown as number}
                    onFollow={() => setActivePersona(persona)}
                    isFollowing={false}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Chat ── */}
        {businessContext && generatedPersonas && activePersona && (
          <motion.div
            key={`chat-${activePersona.id}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col flex-1 min-h-0"
          >
            <ChatScreen
              persona={activePersona}
              businessContext={businessContext}
              onBack={() => setActivePersona(null)}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
