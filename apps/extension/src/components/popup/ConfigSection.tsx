import { useState } from "react"

import ConfigItem from "./ConfigItem"
import Toggle from "./Toggle"

interface ConfigSectionProps {
  timingValue: string
  captureContent: boolean
  followBlacklist: boolean
  createLog: boolean
  onTimingClick: () => void
  onCaptureContentToggle: () => void
  onFollowBlacklistToggle: () => void
  onCreateLogToggle: () => void
}

export default function ConfigSection({
  timingValue,
  captureContent,
  followBlacklist,
  createLog,
  onTimingClick,
  onCaptureContentToggle,
  onFollowBlacklistToggle,
  onCreateLogToggle
}: ConfigSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#666666] mb-3 font-semibold cursor-pointer hover:text-[#888888] transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}>
        <span>Configuration</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}>
        <ConfigItem
          title="Session Timing"
          description="Duration of monitoring session"
          onClick={onTimingClick}
          rightElement={
            <span className="text-[12px] text-[#dd4e52] font-medium px-2 py-1 bg-[rgba(221,78,82,0.1)] rounded">
              {timingValue}
            </span>
          }
        />

        <ConfigItem
          title="Capture Tab Content"
          description="Save page content with bookmarks"
          onClick={onCaptureContentToggle}
          rightElement={
            <Toggle
              isActive={captureContent}
              onClick={onCaptureContentToggle}
            />
          }
        />

        <ConfigItem
          title="Follow Blacklist"
          description="Exclude blacklisted sites from monitoring"
          onClick={onFollowBlacklistToggle}
          rightElement={
            <Toggle
              isActive={followBlacklist}
              onClick={onFollowBlacklistToggle}
            />
          }
        />

        <ConfigItem
          title="Create Usage Log"
          description="Track and log browsing activity"
          onClick={onCreateLogToggle}
          rightElement={
            <Toggle isActive={createLog} onClick={onCreateLogToggle} />
          }
        />
      </div>
    </div>
  )
}
