import { useState } from "react"

import "./style.css"

function IndexNewtab() {
  const [data, setData] = useState("")

  return (
    <div
      className="new-tab"
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column"
      }}>
      <h1>Onelink</h1>
    </div>
  )
}

export default IndexNewtab
