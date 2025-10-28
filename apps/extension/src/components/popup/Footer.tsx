export default function Footer() {
  const handleDashboardClick = () => {
    // Open dashboard website in a new tab
    chrome.tabs.create({ url: "https://onelink.kustom.cc/collections" })
  }

  return (
    <div className="pt-4 mt-4 border-t border-[rgba(255,255,255,0.05)]">
      <button
        onClick={handleDashboardClick}
        className="w-full px-4 py-3 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 bg-[rgba(221,78,82,0.08)] text-[#dd4e52] border border-[rgba(221,78,82,0.2)] hover:bg-[rgba(221,78,82,0.15)] hover:border-[rgba(221,78,82,0.35)] hover:-translate-y-px active:translate-y-0">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span>Open Dashboard</span>
        <svg
          className="w-3 h-3 opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </button>

      <div className="text-center mt-3">
        <span className="text-[10px] text-[#555555]">OneLink v1.0.0</span>
      </div>
    </div>
  )
}
