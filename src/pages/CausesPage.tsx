import { motion } from 'framer-motion'
import DiagnosisCard from '@/components/ui/diagnosis-card'
import { causes } from '@/data/causes'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

export default function CausesPage() {
  return (
    <div className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
          Why You're Not Landing Clients
        </h2>
        <p className="text-base text-black/45 dark:text-white/50">
          Eight specific reasons a strong business still can't close. Click any card to go deeper.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {causes.map((cause, index) => (
          <DiagnosisCard
            key={cause.id}
            cause={cause}
            animationDelay={index * 0.04}
          />
        ))}
      </motion.div>
    </div>
  )
}
