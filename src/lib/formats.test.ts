import { describe, expect, it } from 'vitest'
import { pickProgressive, safeFilename } from './formats'

describe('pickProgressive', () => {
  it('keeps only muxed video formats with a url', () => {
    const f = (o: object) => ({ itag: 1, url: 'u', mimeType: 'video/mp4', qualityLabel: '360p', hasAudio: true, ...o })
    expect(pickProgressive([f({}), f({ hasAudio: false }), f({ url: '' }), f({ mimeType: 'audio/mp4' })])).toHaveLength(1)
  })
})

describe('safeFilename', () => {
  it('strips illegal characters', () => {
    expect(safeFilename('a/b:c?', 'mp4')).toBe('a_b_c_.mp4')
  })
})

import { pickPreferred, progressPercent, type VideoFormat } from './formats'

const fmt = (q: string): VideoFormat => ({ itag: parseInt(q, 10), url: 'u', mimeType: 'video/mp4', qualityLabel: q, hasAudio: true })

describe('pickPreferred', () => {
  it('prefers exact match, then best below, then lowest', () => {
    const all = [fmt('360p'), fmt('720p')]
    expect(pickPreferred(all, '720p')?.qualityLabel).toBe('720p')
    expect(pickPreferred(all, '480p')?.qualityLabel).toBe('360p')
    expect(pickPreferred(all, '144p')?.qualityLabel).toBe('360p')
    expect(pickPreferred([], '720p')).toBeUndefined()
  })
})

describe('progressPercent', () => {
  it('handles unknown totals and clamps', () => {
    expect(progressPercent(5, 0)).toBeNull()
    expect(progressPercent(50, 200)).toBe(25)
    expect(progressPercent(300, 200)).toBe(100)
  })
})
