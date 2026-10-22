export interface VideoFormat {
  itag: number
  url: string
  mimeType: string
  qualityLabel: string
  hasAudio: boolean
}

export interface VideoInfo {
  title: string
  formats: VideoFormat[]
}

/** Keep only progressive (audio + video) formats that expose a direct URL. */
export function pickProgressive(formats: VideoFormat[]): VideoFormat[] {
  return formats.filter((f) => f.hasAudio && f.url && f.mimeType.startsWith('video/'))
}

export function safeFilename(title: string, ext: string): string {
  const base = title.replace(/[\\/:*?"<>|]+/g, '_').trim().slice(0, 120) || 'video'
  return `${base}.${ext}`
}

/** Pick the format matching the preferred quality, else the best one at or below it, else the lowest available. */
export function pickPreferred(formats: VideoFormat[], preferred: string): VideoFormat | undefined {
  const height = (f: VideoFormat) => parseInt(f.qualityLabel, 10) || 0
  const want = parseInt(preferred, 10) || 0
  const sorted = [...formats].sort((a, b) => height(b) - height(a))
  return sorted.find((f) => height(f) <= want) ?? sorted[sorted.length - 1]
}

export function progressPercent(bytesReceived: number, totalBytes: number): number | null {
  if (totalBytes <= 0) return null
  return Math.min(100, Math.round((bytesReceived / totalBytes) * 100))
}
