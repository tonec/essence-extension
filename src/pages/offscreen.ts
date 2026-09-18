import { FETCH_X_DATA } from "../config";
import { isMessage } from "../utils/isMessage";

console.info("Essence: Offscreen js running");

browser.runtime.onMessage.addListener((message: unknown) => {
  console.info("Essence: Offscreen listener message: ", message);

  if (
    isMessage(message) &&
    message.target === "offscreen" &&
    message.action === FETCH_X_DATA
  ) {
    console.log("message received FETCH_X_DATA");
  }
});
