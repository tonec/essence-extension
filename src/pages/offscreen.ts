console.log("offscreen js running");

chrome.runtime.onMessage.addListener(async (message) => {
  console.log("offscreen listener", message);
  if (message.target === "offscreen" && message.action === "FETCH_X_DATA") {
    console.log("fetching...");
  }
});
