import { ALARM_SYNC, FETCH_X_DATA, INTERCEPTED_X_DATA } from "./config";
import { SYNC_INTERVAL } from "./config";
import { initSync } from "./sync";
import { isMessage } from "./utils/isMessage";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

browser.runtime.onMessage.addListener(
  (message: unknown, sender: unknown, sendResponse) => {
    console.info("Essence: background-js onMessage", message);

    if (
      isMessage(message) &&
      message.target === "offscreen" &&
      message.action === FETCH_X_DATA
    ) {
      console.log("message received FETCH_X_DATA");

      initSync();

      sendResponse({ status: "Loading started" });
    }

    if (
      isMessage(message) &&
      message.target === "background" &&
      message.action === INTERCEPTED_X_DATA
    ) {
      console.log("message background", message);
    }

    return true;
  },
);

// browser.runtime.onInstalled.addListener(async () => {
//   chrome.alarms.create(ALARM_SYNC, { periodInMinutes: SYNC_INTERVAL });
//   await initSync();
// });

// browser.alarms.onAlarm.addListener(async (alarm) => {
//   if (alarm.name === ALARM_SYNC) {
//     await initSync();
//   }
// });
