(function () {
  console.info("Essence: Injection script running on page")

  const TARGET_KEYWORD = 'HomeTimeline';
  const MESSAGE_TYPE = "INTERCEPTED_X_DATA";

  // FETCH intercept
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const input = args[0];
    const urlString = (typeof input === 'string') ? input : (input && input.url) ? input.url : '';

    if (urlString.includes(TARGET_KEYWORD)) {
      try {
        const response = await originalFetch.apply(this, args);
        const clonedResponse = response.clone();

        clonedResponse.json().then(data => {
          sendToExtensionBridge({ url, data });
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
    this._url = typeof url === 'string' ? url : '';

    // Attach a listener to capture data at the moment the request finishes loading
    this.addEventListener('load', function () {
      if (this._url.includes(TARGET_KEYWORD)) {
        try {
          const data = JSON.parse(this.responseText);
          sendToExtensionBridge({ url, data });
        } catch (e) {
          // Response wasn't clean JSON or stream not ready yet
        }
      }
    });

    return originalXHR.apply(this, [method, url, ...rest]);
  };

  // Common interaction bridge
  function sendToExtensionBridge({ url, data }) {
    window.postMessage({
      type: MESSAGE_TYPE,
      payload: { url, data }
    }, "*");
  }
})();
