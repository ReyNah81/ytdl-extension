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
