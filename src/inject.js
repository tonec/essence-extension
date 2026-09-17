
(function () {
  console.log('injected js')
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const url = args[0];

    // Detect if X is natively fetching the Chronological "Following" timeline
    if (typeof url === 'string' && url.includes('HomeLatestTimeline')) {
      try {
        const response = await originalFetch.apply(this, args);
        // Clone response so we do not block the page layout from rendering naturally
        const clonedResponse = response.clone();

        clonedResponse.json().then(data => {
          // Send raw backend data directly to our extension bridge
          window.postMessage({
            type: "CHRONOS_INTERCEPTED_X_DATA",
            payload: data
          }, "*");
        });

        return response;
      } catch (err) {
        return originalFetch.apply(this, args);
      }
    }

    return originalFetch.apply(this, args);
  };
})();
