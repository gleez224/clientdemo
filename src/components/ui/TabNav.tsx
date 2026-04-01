import { Tab } from '@/types'
import ThemeToggle from '@/components/ui/ThemeToggle'

interface TabNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'causes', label: 'Root Causes' },
  { id: 'framework', label: 'Framework' },
  { id: 'demo', label: 'Client Demo' },
]

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="flex items-center px-6 py-1 border-b border-black/8 dark:border-white/8 bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl">
      {/* Tabs */}
      <div className="flex items-center gap-1 flex-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative px-6 py-4 text-base font-semibold tracking-wide transition-colors duration-150 group"
          >
            <span
              className={
                activeTab === tab.id
                  ? 'text-gradient-accent'
                  : 'text-black/45 dark:text-white/50 group-hover:text-black dark:group-hover:text-white transition-colors duration-150'
              }
            >
              {tab.label}
            </span>

            {/* Gradient underline for active tab */}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Theme toggle — right side */}
      <ThemeToggle />
    </nav>
  )
}
