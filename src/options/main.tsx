import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

function Options() {
  const [quality, setQuality] = useState('720p')

  useEffect(() => {
    chrome.storage.sync.get({ quality: '720p' }).then((v) => setQuality(String(v.quality)))
  }, [])

  return (
    <label>
      Preferred quality{' '}
      <select
        value={quality}
        onChange={(e) => {
          setQuality(e.target.value)
          chrome.storage.sync.set({ quality: e.target.value })
        }}
      >
        <option>144p</option>
        <option>240p</option>
        <option>360p</option>
        <option>480p</option>
        <option>720p</option>
        <option>1080p</option>
      </select>
    </label>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><Options /></StrictMode>)
