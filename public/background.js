// Leaderboard Pro Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Leaderboard Pro] Extensión instalada con éxito.');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LEADERBOARD_DOM_UPDATED') {
    chrome.action.setBadgeText({ text: 'LIVE' });
    chrome.action.setBadgeBackgroundColor({ color: '#22c55e' });
    sendResponse({ status: 'ok' });
  }
  return true;
});
