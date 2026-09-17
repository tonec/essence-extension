export async function runLocalSync() {
  console.log("running local sync");

  let xCookie = await chrome.cookies.get({
    url: "https://x.com",
    name: "ct0",
  });

  console.log("xCookie", xCookie);

  if (!xCookie || !xCookie.value) {
    console.warn("User is not logged into X. Skipping synchronization cycle.");
    return;
  }

  const csrfToken = xCookie.value;

  console.log("csrfToken", csrfToken);

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

  // Send a message to the offscreen document to start fetching
  chrome.runtime.sendMessage({
    target: "offscreen",
    action: "FETCH_X_DATA",
    securityContext: {
      csrfToken: csrfToken,
    },
  });

  chrome.runtime.onMessage.addListener(async (message) => {
    if (message.target === "background" && message.action === "X_DATA_PARSED") {
      const { payload } = message;

      console.log("fresh postsssss", payload);
    }
  });
}
