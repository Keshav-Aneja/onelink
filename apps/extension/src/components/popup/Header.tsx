import logoUrl from "url:~/assets/logo.webp"

export default function Header() {
  return (
    <div className="mb-6 pb-4 border-b border-[rgba(221,78,82,0.2)]">
      <div className="flex items-center gap-2 mb-1">
        <img src={logoUrl} alt="OneLink" className="w-8 h-auto hue-rotate-90" />
        <h1 className="text-lg font-semibold text-white">Onelink</h1>
      </div>
      <p className="text-xs text-[#888888]">Manage your browsing sessions</p>
    </div>
  )
}
