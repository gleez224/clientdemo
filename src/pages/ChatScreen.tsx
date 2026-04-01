import { ArrowLeft } from 'lucide-react'
import type { Persona } from '@/data/personas'

interface ChatScreenProps {
  persona: Persona
  onBack: () => void
}

export default function ChatScreen({ persona, onBack }: ChatScreenProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Persona identity bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-black/8 dark:border-white/8 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-black/45 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-150"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Switch client
        </button>

        <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10" />

        <div>
          <span className="text-base font-bold text-black dark:text-white">
            {persona.name}
          </span>
          <span className="ml-2 text-sm text-black/45 dark:text-white/50">
            {persona.archetype}
          </span>
        </div>
      </div>

      {/* Chat area placeholder */}
      <div className="flex flex-col flex-1 items-center justify-center gap-3 p-8">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black/10 dark:border-white/10">
          <img
            src={persona.image}
            alt={persona.name}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-base font-semibold text-black dark:text-white">
          {persona.name}
        </p>
        <p className="text-sm text-black/45 dark:text-white/50">
          {persona.archetype}
        </p>
        <p className="text-xs text-black/30 dark:text-white/30 mt-4">
          Chat interface coming in Step 6.
        </p>
      </div>
    </div>
  )
}
