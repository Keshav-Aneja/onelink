interface SessionControlProps {
  isActive: boolean
  statusText: string
  statusTime: string
  onToggle: () => void
}

export default function SessionControl({
  isActive,
  statusText,
  statusTime,
  onToggle
}: SessionControlProps) {
  return (
    <div className="mb-5">
      {/* Session Status */}
      <div className="flex items-center gap-2 mb-3 p-3 bg-[rgba(255,255,255,0.03)] rounded-lg border border-[rgba(255,255,255,0.05)]">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isActive
              ? "bg-[#dd4e52] shadow-[0_0_8px_rgba(221,78,82,0.6)] animate-pulse"
              : "bg-[#666666]"
          }`}
        />
        <span className="flex-1 text-[13px] text-[#cccccc]">{statusText}</span>
        {statusTime && (
          <span className="text-[11px] text-[#666666] font-medium">
            {statusTime}
          </span>
        )}
      </div>

      {/* Session Button */}
      <button
        className={`w-full px-5 py-3.5 rounded-lg text-[14px] font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 ${
          isActive
            ? "bg-[rgba(221,78,82,0.15)] text-[#dd4e52] border border-[rgba(221,78,82,0.3)] hover:bg-[rgba(221,78,82,0.25)] hover:border-[rgba(221,78,82,0.5)]"
            : "bg-[#dd4e52] text-white hover:bg-[#c4454a] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(221,78,82,0.3)]"
        } active:translate-y-0`}
        onClick={onToggle}>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          {isActive ? (
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </>
          ) : (
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </>
          )}
        </svg>
        <span>{isActive ? "Stop Session" : "Start Session"}</span>
      </button>
    </div>
  )
}
