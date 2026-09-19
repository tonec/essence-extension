// Function to create a hidden background window and load X
async function openHiddenTab(targetUrl: string) {
  await chrome.scripting.registerContentScripts([
    {
      id: "inject-script",
      js: ["inject.js"],
      matches: ["https://x.com/*"],
      runAt: "document_start",
      world: "MAIN",
    },
  ]);

  chrome.windows.create({
    url: targetUrl,
    type: "normal",
    // focused: false,
    // state: "minimized",
  });
}

export const initSync = async () => {
  console.info("Essense: Initialising sync");

  openHiddenTab("https://x.com");
};
