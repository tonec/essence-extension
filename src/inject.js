(function () {
  console.info("Essence: Injection script running on page")

  const TARGET_KEYWORDS = ['HomeLatestTimeline'];

  //  XMLHTTPREQUEST (XHR) intercept
  const originalOpen = window.XMLHttpRequest.prototype.open;
  const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  const originalSend = XMLHttpRequest.prototype.send;

  window.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    const urlString = (typeof url === 'string') ? url : (url && url.toString) ? url.toString() : '';
    this._url = urlString;
    this._headers = {};

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
})();
