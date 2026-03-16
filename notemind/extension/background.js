// NoteMind — background service worker
// Handles tab capture, offscreen document lifecycle, and message routing

let offscreenCreated = false;
let captureStream = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'START_CAPTURE') {
    handleStartCapture(msg.tabId, sendResponse);
    return true; // keep channel open for async response
  }
  if (msg.type === 'STOP_CAPTURE') {
    handleStopCapture(sendResponse);
    return true;
  }
  if (msg.type === 'OFFSCREEN_READY') {
    sendResponse({ status: 'ok' });
    return true;
  }
  // Relay transcript/speaker chunks from offscreen → popup
  if (msg.type === 'TRANSCRIPT_CHUNK' || msg.type === 'SERVER_STATUS') {
    chrome.runtime.sendMessage(msg).catch(() => {});
    return false;
  }
});

async function handleStartCapture(tabId, sendResponse) {
  try {
    // Get stream ID for the tab
    const streamId = await new Promise((resolve, reject) => {
      chrome.tabCapture.getMediaStreamId({ targetTabId: tabId }, (id) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else resolve(id);
      });
    });

    // Create offscreen document if it doesn't exist
    if (!offscreenCreated) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['USER_MEDIA'],
        justification: 'Capture tab audio for real-time transcription'
      });
      offscreenCreated = true;
    }

    // Tell offscreen to start capturing with the stream ID
    chrome.runtime.sendMessage({
      type: 'START_OFFSCREEN_CAPTURE',
      streamId,
      tabId
    });

    sendResponse({ success: true, streamId });
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}

async function handleStopCapture(sendResponse) {
  try {
    chrome.runtime.sendMessage({ type: 'STOP_OFFSCREEN_CAPTURE' });
    if (offscreenCreated) {
      await chrome.offscreen.closeDocument();
      offscreenCreated = false;
    }
    sendResponse({ success: true });
  } catch (err) {
    sendResponse({ success: false, error: err.message });
  }
}
