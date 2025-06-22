// Background script for Elacity extension
console.log('Elacity background script loaded');

// Listen for tab updates to handle auth redirects - COMMENTED OUT FOR REFACTOR
/*
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if this is an arXiv page with auth parameters
    if (tab.url.includes('arxiv.org') && tab.url.includes('elacity_auth=success')) {
      console.log('Auth success detected on arXiv page');
      
      // Send message to content script to handle auth
      chrome.tabs.sendMessage(tabId, {
        action: 'authReturn',
        url: tab.url
      }).catch(err => {
        console.log('Could not send message to content script:', err);
      });
    }
  }
});

// Handle messages from content script and popup - COMMENTED OUT FOR REFACTOR
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'authSuccess') {
    // Broadcast auth success to all tabs and popup
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && tab.url.includes('arxiv.org')) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'authSuccess',
            userData: request.userData
          }).catch(err => {
            console.log('Could not send auth success to tab:', err);
          });
        }
      });
    });
    
    // Also send to popup if it's open
    chrome.runtime.sendMessage({
      action: 'authSuccess',
      userData: request.userData
    }).catch(err => {
      console.log('Could not send auth success to popup:', err);
    });
  }
  
  return true;
});
*/

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Elacity extension installed');
}); 