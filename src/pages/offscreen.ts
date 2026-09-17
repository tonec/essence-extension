console.log("offscreen js running");

chrome.runtime.onMessage.addListener(async (message) => {
  console.log("offscreen listener", message);
  if (message.target === "offscreen" && message.action === "FETCH_X_DATA") {
    const { csrfToken } = message.securityContext;
    let nextCursor = null;

    console.log("fetching with ", csrfToken);

    // try {
    const variables = {
      count: 40,
      cursor: nextCursor,
      includePromotedContent: false,
    };

    const targetUrl = `https://x.com?${encodeURIComponent(JSON.stringify(variables))}`;

    console.log("targetUrl", targetUrl);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "x-csrf-token": csrfToken, // INJECTED HEADER SECURITY KEY
        "Content-Type": "application/json",
        "x-twitter-active-user": "yes",
        "x-twitter-client-language": "en",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Could not authenticate with active session cookies.");
    }

    console.log("response", JSON.stringify(response));

    // const json = await response.json();

    // console.log("response json", json);

    chrome.runtime.sendMessage({
      target: "background",
      action: "X_DATA_PARSED",
      // payload: json,
    });
    // } catch (error) {
    //   console.error("Offscreen X compilation failed:", error);
    //   chrome.runtime.sendMessage({
    //     target: "background",
    //     action: "X_DATA_PARSED",
    //     payload: [],
    //   });
    // }
  }
});
