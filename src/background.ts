import { BACKGROUND, INITIATE_SYNC, X_TOKENS_CAPTURED } from "./config";
import { isMessage } from "./utils/isMessage";
import { initSync } from "./sync";
import { fetchXData } from "./services/fetchData/fetchXData";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

browser.runtime.onMessage.addListener(
  (message: unknown, sender: unknown, sendResponse) => {
    if (
      isMessage(message) &&
      message.target === BACKGROUND &&
      message.action === INITIATE_SYNC
    ) {
      initSync();
    }

    if (
      isMessage(message) &&
      message.target === BACKGROUND &&
      message.action === X_TOKENS_CAPTURED
    ) {
      fetchXData();
    }

    return true;
  },
);
