(function () {
  console.info("Essence: Injection script running on page")

  const TARGET_KEYWORDS = ['HomeTimeline', 'HomeLatestTimeline'];
  const MESSAGE_TYPE = "INTERCEPTED_X_DATA";

  // FETCH intercept
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const input = args[0];
    const urlString = (typeof input === 'string') ? input : (input && input.url) ? input.url : '';

    if (TARGET_KEYWORDS.some((keyword) => urlString.includes(keyword))) {
      try {
        const response = await originalFetch.apply(this, args);
        const clonedResponse = response.clone();

        clonedResponse.json().then(data => {
          sendToExtensionBridge({ url: urlString, data });
        }).catch(() => { });

        return response;
      } catch (err) {
        return originalFetch.apply(this, args);
      }
    }
    return originalFetch.apply(this, args);
  };

  //  XMLHTTPREQUEST (XHR) intercept
  const originalXHR = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    const urlString = (typeof url === 'string') ? url : (url && url.toString) ? url.toString() : '';
    this._url = urlString;

    // Attach a listener to capture data at the moment the request finishes loading
    this.addEventListener('load', function () {
      if (TARGET_KEYWORDS.some((keyword) => urlString.includes(keyword))) {
        try {
          const data = JSON.parse(this.responseText);
          sendToExtensionBridge({ url: this._url, data });
        } catch (e) {
          // Response wasn't clean JSON or stream not ready yet
        }
      }
    });

    return originalXHR.apply(this, [method, url, ...rest]);
  };

  // Common interaction bridge
  function sendToExtensionBridge({ url, data }) {
    console.log('send to bridge: ', url)
    window.postMessage({
      type: MESSAGE_TYPE,
      payload: { url, data }
    }, "*");
  }
})();
