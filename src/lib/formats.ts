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
