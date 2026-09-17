console.log('Running content script')

const script = document.createElement('script');

script.src = chrome.runtime.getURL('./inject.js');
(document.head || document.documentElement).appendChild(script);
script.onload = () => script.remove();

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data && event.data.type === "CHRONOS_INTERCEPTED_X_DATA") {
    chrome.runtime.sendMessage({
      target: 'background',
      action: 'PROCESS_RAW_X_FEED',
      payload: event.data.payload
    });
  }
});
