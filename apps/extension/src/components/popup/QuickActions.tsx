export default function QuickActions() {
  return (
    <div className="mb-5 pb-5 border-b border-[rgba(255,255,255,0.05)]">
      <div className="text-[11px] uppercase tracking-wider text-[#666666] mb-3 font-semibold">
        Quick Actions
      </div>

      <button className="w-full px-5 py-3.5 mb-2 rounded-lg text-[14px] font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 bg-[rgba(255,255,255,0.05)] text-white border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 7h16M4 12h16M4 17h16"
          />
        </svg>
        <span>Capture All Open Tabs</span>
      </button>

      <button className="w-full px-5 py-3.5 mb-2 rounded-lg text-[14px] font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 bg-[rgba(255,255,255,0.05)] text-white border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <span>Save Current Tab</span>
      </button>
    </div>
  )
}
