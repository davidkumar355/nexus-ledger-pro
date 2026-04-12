type Props = {
  label: string
  value: string
  colorTheme: 'success' | 'danger' | 'warning' | 'net-zero'
}

export default function StatCard({ label, value, colorTheme }: Props) {
  let bgClass = 'bg-canvas'
  let textClass = 'text-ink'

  if (colorTheme === 'success') {
    bgClass = 'bg-[#4ade80]' // A brutalist green
    textClass = 'text-ink'
  } else if (colorTheme === 'danger') {
    bgClass = 'bg-[#f87171]' // Brutalist red
    textClass = 'text-ink'
  } else if (colorTheme === 'warning') {
    bgClass = 'bg-[#FFE81A]'
    textClass = 'text-ink'
  }

  return (
    <div className={`${bgClass} ${textClass} border-4 border-ink shadow-brutal p-6 flex flex-col justify-center min-h-[140px]`}>
      <div className="font-black tracking-widest text-sm uppercase mb-2 opacity-80 mix-blend-color-burn">
        {label}
      </div>
      <div className="text-4xl sm:text-5xl font-black tracking-tight" style={{ wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  )
}
