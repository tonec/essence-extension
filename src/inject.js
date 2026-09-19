(function () {
  console.info("Essence: Injection script running on page")

  const TARGET_KEYWORDS = ['HomeTimeline', 'HomeLatestTimeline'];
  const MESSAGE_TYPE = "INTERCEPTED_X_DATA";

  // FETCH intercept
  // const originalFetch = window.fetch;

  // window.fetch = async function (...args) {
  //   const input = args[0];
  //   const urlString = (typeof input === 'string') ? input : (input && input.url) ? input.url : '';

  //   if (TARGET_KEYWORDS.some((keyword) => urlString.includes(keyword))) {
  //     try {
  //       const response = await originalFetch.apply(this, args);
  //       const clonedResponse = response.clone();

  //       clonedResponse.json().then(data => {
  //         sendToExtensionBridge({ url: urlString, data });
  //       }).catch(() => { });

  //       return response;
  //     } catch (err) {
  //       return originalFetch.apply(this, args);
  //     }
  //   }
  //   return originalFetch.apply(this, args);
  // };

  //  XMLHTTPREQUEST (XHR) intercept
  const originalOpen = window.XMLHttpRequest.prototype.open;
  const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  const originalSend = XMLHttpRequest.prototype.send;

  window.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    const urlString = (typeof url === 'string') ? url : (url && url.toString) ? url.toString() : '';
    this._url = urlString;
    this._headers = {};

    // Attach a listener to capture data at the moment the request finishes loading
    // this.addEventListener('load', function () {
    //   if (TARGET_KEYWORDS.some((keyword) => urlString.includes(keyword))) {
    //     try {
    //       const data = JSON.parse(this.responseText);
    //       // sendToExtensionBridge({ url: this._url, data });
    //     } catch (e) {
    //       // Response wasn't clean JSON or stream not ready yet
    //     }
    //   }
    // });

    return originalOpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    if (this._headers) {
      this._headers[header.toLowerCase()] = value;
    }
    return originalSetRequestHeader.apply(this, [header, value]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (TARGET_KEYWORDS.some((keyword) => this._url.includes(keyword))) {
      const csrf = this._headers['x-csrf-token'];
      const auth = this._headers['authorization'];
      const queryIdMatch = this._url.match(/\/graphql\/([^\/]+)/);
      const queryId = queryIdMatch ? queryIdMatch[1] : null;

      if (csrf && auth && queryIdMatch) {
        // Pass the tokens securely to the main extension content script context
        window.postMessage({
          type: 'X_TOKENS_CAPTURED',
          payload: {
            url: this._url,
            csrf,
            auth,
            queryId
          }
        }, '*');
      }
    }
    return originalSend.apply(this, args);
  };

  // Common interaction bridge
  // function sendToExtensionBridge({ url, data }) {
  //   window.postMessage({
  //     type: MESSAGE_TYPE,
  //     payload: { url, data }
  //   }, "*");
  // }
})();
