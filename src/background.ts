import { INTERCEPTED_X_DATA } from "./actions";
import { SYNC_INTERVAL } from "./config";
import { runLocalSync } from "./runLocalSync";
import { isMessage } from "./utils/isMessage";

browser.runtime.onMessage.addListener((message: unknown) => {
  console.log("background-js onMessage", message);

  if (
    isMessage(message) &&
    message.target === "background" &&
    message.action === INTERCEPTED_X_DATA
  ) {
    console.log("message background", message);
  }
});

// browser.runtime.onInstalled.addListener(async () => {
//   chrome.alarms.create("syncXTimeline", { periodInMinutes: SYNC_INTERVAL });
//   await runLocalSync();
// });

// browser.alarms.onAlarm.addListener(async (alarm) => {
//   if (alarm.name === "syncXTimeline") {
//     await runLocalSync();
//   }
// });
