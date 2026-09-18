let creating: Promise<void> | null = null;

async function ensureOffscreen() {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT" as chrome.runtime.ContextType],
  });

  if (contexts.length > 0) return;

  if (!creating) {
    creating = chrome.offscreen.createDocument({
      url: "pages/offscreen.html",
      reasons: [chrome.offscreen.Reason.DOM_PARSER],
      justification: "Parse HTML strings that the service worker cannot",
    });
  }

  await creating;
  creating = null;
}

export const initSync = async () => {
  console.info("Essense: Initialising sync");

  await ensureOffscreen();
};
