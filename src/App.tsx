import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Tab } from '@/types'
import HeroPage from '@/pages/HeroPage'
import CausesPage from '@/pages/CausesPage'
import FrameworkPage from '@/pages/FrameworkPage'
import DemoPage from '@/pages/DemoPage'
import TabNav from '@/components/ui/TabNav'

const tabContent: Record<Tab, React.ReactNode> = {
  causes: <CausesPage />,
  framework: <FrameworkPage />,
  demo: <DemoPage />,
}

export default function App() {
  const [appEntered, setAppEntered] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('causes')

  return (
    <div className="min-h-screen bg-[#f4f4f6] dark:bg-[#08080a] text-foreground relative overflow-hidden">

      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      >
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-purple opacity-0 dark:opacity-20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-brand-pink opacity-0 dark:opacity-15 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-brand-purple opacity-0 dark:opacity-10 blur-[100px]" />
      </div>

      {/* App content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <AnimatePresence mode="wait">
          {!appEntered ? (
            <motion.div
              key="hero"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="fixed inset-0"
            >
              <HeroPage onEnter={() => setAppEntered(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="shell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="flex flex-col min-h-screen"
            >
              <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
              <AnimatePresence mode="wait">
                <motion.main
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="flex flex-col flex-1"
                >
                  {tabContent[activeTab]}
                </motion.main>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
