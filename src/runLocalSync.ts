export async function runLocalSync() {
  console.log("running local sync");

  const OFFSCREEN_FILE = "pages/offscreen.html";

  let creating: Promise<void> | null = null;

  // // Check if an offscreen document is already running
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT" as chrome.runtime.ContextType],
  });

  if (existingContexts.length === 0) {
    await chrome.offscreen.createDocument({
      url: "pages/offscreen.html",
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: "Parse HTML strings that the service worker cannot",
    });
  }

  console.log("existingContexts", existingContexts);

  // Send a message to the offscreen document to start fetching
  chrome.runtime.sendMessage({ target: "offscreen", action: "FETCH_X_DATA" });
}
