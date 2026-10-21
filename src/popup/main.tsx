import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { pickProgressive, type VideoInfo } from '../lib/formats'

function Popup() {
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [status, setStatus] = useState('Loading…')

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (!tab?.id) return setStatus('No active tab')
      chrome.tabs.sendMessage(tab.id, { type: 'get-video-info' }).then(
        (res: VideoInfo | null) => (res ? setInfo(res) : setStatus('Open a YouTube watch page')),
        () => setStatus('Open a YouTube watch page'),
      )
    })
  }, [])

  if (!info) return <p style={{ width: 240 }}>{status}</p>
  const formats = pickProgressive(info.formats)
  return (
    <div style={{ width: 280 }}>
      <strong>{info.title}</strong>
      {formats.length === 0 && <p>No direct downloads available for this video.</p>}
      {formats.map((f) => (
        <button
          key={f.itag}
          style={{ display: 'block', margin: '4px 0' }}
          onClick={() => chrome.runtime.sendMessage({ type: 'download', url: f.url, title: info.title })}
        >
          {f.qualityLabel} ({f.mimeType})
        </button>
      ))}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><Popup /></StrictMode>)
