import type { VideoFormat, VideoInfo } from '../lib/formats'

interface RawFormat {
  itag: number
  url?: string
  mimeType: string
  qualityLabel?: string
  audioQuality?: string
}

// The content script runs in an isolated world, so read the player response from the page's inline scripts.
function readPlayerResponse(): { title: string; formats: VideoFormat[] } | null {
  for (const s of document.scripts) {
    const m = s.textContent?.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/s)
    if (!m) continue
    try {
      const data = JSON.parse(m[1])
      const raw: RawFormat[] = data.streamingData?.formats ?? []
      return {
        title: data.videoDetails?.title ?? document.title,
        formats: raw.map((f) => ({
          itag: f.itag,
          url: f.url ?? '',
          mimeType: f.mimeType.split(';')[0],
          qualityLabel: f.qualityLabel ?? '',
          hasAudio: Boolean(f.audioQuality),
        })),
      }
    } catch {
      return null
    }
  }
  return null
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'get-video-info') {
    sendResponse((readPlayerResponse() as VideoInfo | null) ?? null)
  }
})
