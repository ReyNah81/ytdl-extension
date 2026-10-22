import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { pickPreferred, pickProgressive, progressPercent, type VideoFormat, type VideoInfo } from '../lib/formats'

function Popup() {
  const [info, setInfo] = useState<VideoInfo | null>(null)
  const [status, setStatus] = useState('Loading…')
  const [preferred, setPreferred] = useState('720p')
  const [download, setDownload] = useState<{ id: number; state: string; percent: number | null } | null>(null)

  useEffect(() => {
    chrome.storage.sync.get({ quality: '720p' }).then((v) => setPreferred(String(v.quality)))
  }, [])

  useEffect(() => {
    chrome.storage.local.get('lastDownload').then(({ lastDownload }) => {
      if (lastDownload) setDownload({ id: lastDownload.id, state: 'in_progress', percent: null })
    })
  }, [])

  useEffect(() => {
    if (!download) return
    const refresh = () =>
      chrome.downloads.search({ id: download.id }).then(([d]) => {
        if (!d) return
        setDownload({ id: d.id, state: d.state, percent: progressPercent(d.bytesReceived, d.totalBytes) })
      })
    const timer = setInterval(refresh, 500)
    return () => clearInterval(timer)
  }, [download?.id])

  const start = async (f: VideoFormat, title: string) => {
    const res = await chrome.runtime.sendMessage({ type: 'download', url: f.url, title })
    if (res?.id !== undefined) setDownload({ id: res.id, state: 'in_progress', percent: 0 })
    else setStatus(res?.error ?? 'Download failed')
  }

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
  const best = pickPreferred(formats, preferred)
  return (
    <div style={{ width: 280 }}>
      <strong>{info.title}</strong>
      {formats.length === 0 && <p>No direct downloads available for this video.</p>}
      {best && (
        <button style={{ display: 'block', margin: '8px 0', fontWeight: 'bold' }} onClick={() => start(best, info.title)}>
          Download preferred ({best.qualityLabel})
        </button>
      )}
      {formats.map((f) => (
        <button key={f.itag} style={{ display: 'block', margin: '4px 0' }} onClick={() => start(f, info.title)}>
          {f.qualityLabel} ({f.mimeType})
        </button>
      ))}
      {download && (
        <div style={{ marginTop: 8 }}>
          {download.state === 'complete' ? (
            'Download complete'
          ) : download.state === 'interrupted' ? (
            'Download failed'
          ) : (
            <progress value={download.percent ?? undefined} max={100} style={{ width: '100%' }} />
          )}
        </div>
      )}
      {status !== 'Loading…' && <p>{status}</p>}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><Popup /></StrictMode>)
