import { useEffect, useState } from "react"

import ConfigSection from "~/components/popup/ConfigSection"
import Footer from "~/components/popup/Footer"
import Header from "~/components/popup/Header"
import QuickActions from "~/components/popup/QuickActions"
import SessionControl from "~/components/popup/SessionControl"

import "./style.css"

type TimingValue = "Indefinite" | "30 min" | "1 hour" | "2 hours" | "Custom"

function IndexPopup() {
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [statusTime, setStatusTime] = useState("")

  // Configuration state
  const [timingValue, setTimingValue] = useState<TimingValue>("Indefinite")
  const [captureContent, setCaptureContent] = useState(false)
  const [followBlacklist, setFollowBlacklist] = useState(true)
  const [createLog, setCreateLog] = useState(false)

  // Timer effect
  useEffect(() => {
    if (!isSessionActive || !sessionStartTime) {
      setStatusTime("")
      return
    }

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      setStatusTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [isSessionActive, sessionStartTime])

  // Session toggle handler
  const handleSessionToggle = () => {
    if (!isSessionActive) {
      setSessionStartTime(Date.now())
      setIsSessionActive(true)
    } else {
      setIsSessionActive(false)
      setSessionStartTime(null)
    }
  }

  // Timing value cycle handler
  const handleTimingClick = () => {
    const options: TimingValue[] = [
      "Indefinite",
      "30 min",
      "1 hour",
      "2 hours",
      "Custom"
    ]
    const currentIndex = options.indexOf(timingValue)
    const nextIndex = (currentIndex + 1) % options.length
    setTimingValue(options[nextIndex])
  }

  return (
    <div className="w-[360px] max-h-[600px] overflow-y-auto p-5 bg-[#111111] text-white">
      <Header />

      <SessionControl
        isActive={isSessionActive}
        statusText={isSessionActive ? "Session active" : "Session inactive"}
        statusTime={statusTime}
        onToggle={handleSessionToggle}
      />

      <QuickActions />

      <ConfigSection
        timingValue={timingValue}
        captureContent={captureContent}
        followBlacklist={followBlacklist}
        createLog={createLog}
        onTimingClick={handleTimingClick}
        onCaptureContentToggle={() => setCaptureContent(!captureContent)}
        onFollowBlacklistToggle={() => setFollowBlacklist(!followBlacklist)}
        onCreateLogToggle={() => setCreateLog(!createLog)}
      />

      <Footer />
    </div>
  )
}

export default IndexPopup
