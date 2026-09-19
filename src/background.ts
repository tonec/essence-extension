import { FETCH_X_DATA } from "./config";
import { initSync } from "./sync";
import { isMessage } from "./utils/isMessage";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

browser.runtime.onMessage.addListener(
  (message: unknown, sender: unknown, sendResponse) => {
    if (
      isMessage(message) &&
      message.target === "background" &&
      message.action === FETCH_X_DATA
    ) {
      initSync();
    }

    return true;
  },
);
