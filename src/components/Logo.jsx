export default function Logo({ className = '', mono = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill={mono ? 'currentColor' : '#1C2419'} />
        <path d="M5 25c5-2 10-2 15 0s10 2 15 0v10H5z" fill="#6B4329" />
        <path d="M5 30c5-2 10-2 15 0s10 2 15 0v5H5z" fill="#4A2E1C" />
        <path d="M20 24.5V14" stroke="#D8A23E" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 18c-4 0-6.5-2.5-6.5-6.5 4 0 6.5 2.5 6.5 6.5zM20 15.5c0-4 2.5-6.5 6.5-6.5 0 4-2.5 6.5-6.5 6.5z" fill="#8FB46A" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[1.08rem] font-medium tracking-tight">Agro Soil Advisor</span>
        <span className="eyebrow mt-1 block !text-[0.6rem] text-muted">Punjab · crop advisory</span>
      </span>
    </span>
  )
}
