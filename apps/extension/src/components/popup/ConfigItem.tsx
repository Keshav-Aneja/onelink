import { ReactNode } from "react"

interface ConfigItemProps {
  title: string
  description: string
  onClick: () => void
  rightElement: ReactNode
}

export default function ConfigItem({
  title,
  description,
  onClick,
  rightElement
}: ConfigItemProps) {
  return (
    <div
      className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.03)] rounded-md mb-2 cursor-pointer transition-all duration-200 border border-transparent hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(221,78,82,0.2)]"
      onClick={onClick}>
      <div className="flex-1">
        <div className="text-[13px] text-white font-medium mb-0.5">
          {title}
        </div>
        <div className="text-[11px] text-[#888888]">{description}</div>
      </div>
      {rightElement}
    </div>
  )
}
