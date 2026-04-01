import { motion } from 'framer-motion'
import StepCard from '@/components/ui/StepCard'
import { steps } from '@/data/framework'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

export default function FrameworkPage() {
  return (
    <div className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
          The 10-Step Warm Outreach System
        </h2>
        <p className="text-base text-black/45 dark:text-white/50">
          Hormozi's exact sequence for landing clients from your existing network. Click any step to go deeper.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Gradient vertical line — sits behind nodes, spans full list height */}
        <div
          aria-hidden="true"
          className="absolute left-[23px] top-5 bottom-8 w-[1px] bg-gradient-accent opacity-30 dark:opacity-40"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
