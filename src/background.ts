import { ALARM_SYNC, INTERCEPTED_X_DATA } from "./config";
import { SYNC_INTERVAL } from "./config";
import { initSync } from "./sync";
import { isMessage } from "./utils/isMessage";

browser.runtime.onMessage.addListener((message: unknown) => {
  console.info("Essence: background-js onMessage", message);

  if (
    isMessage(message) &&
    message.target === "background" &&
    message.action === INTERCEPTED_X_DATA
  ) {
    console.log("message background", message);
  }
});

browser.runtime.onInstalled.addListener(async () => {
  chrome.alarms.create(ALARM_SYNC, { periodInMinutes: SYNC_INTERVAL });
  await initSync();
});

// browser.alarms.onAlarm.addListener(async (alarm) => {
//   if (alarm.name === ALARM_SYNC) {
//     await initSync();
//   }
// });
