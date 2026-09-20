import { BRIDGE, X_TOKENS_CAPTURED } from "@/config";
import { isMessage } from "@/utils/isMessage";
import { xGetData } from "@/services/fetchData/x/xGetData";

export default function initial() {
  window.addEventListener("message", async ({ source, data: message }) => {
    // Security Check: Only accept messages originating from the current webpage frame
    if (source !== window) return;

    // X_TOKENS_CAPTURED sent the inject script
    if (
      isMessage<string>(message) &&
      message.target === BRIDGE &&
      message.action === X_TOKENS_CAPTURED
    ) {
      const response = await xGetData(message);
    }
  });
}
