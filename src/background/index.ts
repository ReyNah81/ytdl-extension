import { safeFilename } from '../lib/formats'

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'download') {
    chrome.downloads
      .download({ url: msg.url, filename: safeFilename(msg.title, 'mp4') })
      .then(async (id) => {
        await chrome.storage.local.set({ lastDownload: { id, title: msg.title } })
        sendResponse({ id })
      })
      .catch((e) => sendResponse({ error: String(e) }))
    return true
  }
})
