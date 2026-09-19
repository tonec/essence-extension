import { INTERCEPTED_X_DATA, PROCESS_INTERCEPTED_X_DATA } from "../config";

export default function initial() {
  window.addEventListener("message", (event) => {
    // Security Check: Only accept messages originating from the current webpage frame
    if (event.source !== window) return;

    if (event.data && event.data.type === INTERCEPTED_X_DATA) {
      const { url, data } = event.data.payload;

      chrome.runtime.sendMessage(
        {
          target: "background",
          action: PROCESS_INTERCEPTED_X_DATA,
          payload: {
            url: url,
            data: data,
            timestamp: Date.now(),
          },
        },
        (response) => {
          // Optional: Handle confirmation from the background worker if needed
          if (chrome.runtime.lastError) {
            console.warn(
              "Background worker unavailable:",
              chrome.runtime.lastError.message,
            );
          } else {
            console.log("Data successfully logged in background:", response);
          }
        },
      );
    }
  });
}
