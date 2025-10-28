interface ToggleProps {
  isActive: boolean
  onClick: () => void
}

export default function Toggle({ isActive, onClick }: ToggleProps) {
  return (
    <div
      className={`relative w-10 h-[22px] rounded-full cursor-pointer transition-colors duration-300 ${
        isActive ? "bg-[rgba(221,78,82,0.3)]" : "bg-[rgba(255,255,255,0.1)]"
      }`}
      onClick={onClick}>
      <div
        className={`absolute w-[18px] h-[18px] rounded-full top-[2px] transition-all duration-300 ${
          isActive
            ? "bg-[#dd4e52] left-[20px]"
            : "bg-[#666666] left-[2px]"
        }`}
      />
    </div>
  )
}
