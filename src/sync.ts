async function executeAutomation(
  tabId: number | undefined,
  windowId: number | undefined,
) {
  if (!tabId) return;

  try {
    // Inject the script file into the tab
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      files: ["inject.js"],
    });

    console.log("Scraped data received from tab:", result.result);

    if (typeof windowId === "number") {
      // chrome.windows.remove(windowId);
    }
  } catch (error) {
    console.error("Script injection failed:", error);
  }
}

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
  });

  //   // Option A: Create a minimized window to keep it out of sight
  // const window = await chrome.windows.create({
  //     url: targetUrl,
  //     focused: false,
  //     state: "minimized",
  //   });
  //   let tabId: number | undefined = window?.tabs?.[0]?.id;
  //   // Listen for the tab to finish loading
  //   chrome.tabs.onCreated.addListener(function listener(tab) {
  //     console.log("tab", tab);
  //     if (tab.id === tabId) {
  //       // Remove listener so it doesn't fire again
  //       chrome.tabs.onCreated.removeListener(listener);
  //       // Inject your automation/scraping script
  //       executeAutomation(tabId, window.id);
  //     }
  //   });
}

export const initSync = async () => {
  console.info("Essense: Initialising sync");

  openHiddenTab("https://x.com");
};
