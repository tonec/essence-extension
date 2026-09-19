import {
  ALARM_SYNC,
  FETCH_X_DATA,
  INTERCEPTED_X_DATA,
  PROCESS_INTERCEPTED_X_DATA,
} from "./config";
import { SYNC_INTERVAL } from "./config";
import { initSync } from "./sync";
import { isMessage } from "./utils/isMessage";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

browser.runtime.onMessage.addListener(
  (message: unknown, sender: unknown, sendResponse) => {
    if (
      isMessage(message) &&
      message.target === "offscreen" &&
      message.action === FETCH_X_DATA
    ) {
      initSync();
    }

    if (
      isMessage(message) &&
      message.target === "background" &&
      message.action === PROCESS_INTERCEPTED_X_DATA
    ) {
      const { url, data, timestamp } = message.payload;
      console.log("PROCESS_INTERCEPTED_X_DATA", data);
    }

    return true;
  },
);
