import { INTERCEPTED_X_DATA } from "../config";

console.info("Essence: content script running");

/**
 * Extension.js content_script entrypoint. The framework calls this on
 * injection and calls the returned function on HMR/teardown to clean up.
 * Do not invoke it yourself.
 */
export default function initial() {
  console.info("Essence: content script initial function running");

  const script = document.createElement("script");
  const injectUrl = chrome.runtime.getURL("inject.js");
  script.src = injectUrl;
  (document.head || document.documentElement).appendChild(script);
  script.onload = () => script.remove();

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    if (event.data && event.data.type === INTERCEPTED_X_DATA) {
      console.log("content", event.data.payload);
      chrome.runtime.sendMessage({
        target: "background",
        action: INTERCEPTED_X_DATA,
        payload: event.data.payload,
      });
    }
  });
}
