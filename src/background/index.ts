import { safeFilename } from '../lib/formats'

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'download') {
    chrome.downloads
      .download({ url: msg.url, filename: safeFilename(msg.title, 'mp4') })
      .then((id) => sendResponse({ id }))
      .catch((e) => sendResponse({ error: String(e) }))
    return true
  }
})
