interface HeroPageProps {
  onEnter: () => void
}

export default function HeroPage({ onEnter }: HeroPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white max-w-4xl leading-tight mb-4 tracking-tight">
        You have a strong business.{' '}
        <span className="text-gradient-accent">
          You just can't get clients.
        </span>
      </h1>
      <p className="text-xl font-normal text-black/45 dark:text-white/50 max-w-xl mb-12 leading-relaxed">
        Learn the system. Practice the pitch. Close the gap between the business you have and the clients you want.
      </p>
      <button
        onClick={onEnter}
        className="bg-gradient-accent text-white text-xl font-semibold px-10 py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all duration-150 shadow-lg"
      >
        Start Training
      </button>
    </div>
  )
}
