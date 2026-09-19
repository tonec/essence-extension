import { X_TOKENS_CAPTURED } from "@/config";
import { defaultFeatures, defaultHeaders } from "./xFetchRequest";

export default function initial() {
  window.addEventListener("message", async (event) => {
    // Security Check: Only accept messages originating from the current webpage frame
    if (event.source !== window) return;

    // X_TOKENS_CAPTURED sent the inject script
    if (event.data && event.data.type === X_TOKENS_CAPTURED) {
      const { csrf, auth, queryId } = event.data.payload;

      const baseUrl = `https://x.com/i/api/graphql/${queryId}/HomeLatestTimeline`;

      try {
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            Authorization: auth,
            "X-Csrf-Token": csrf,
            ...defaultHeaders,
          },
          body: JSON.stringify({
            queryId,
            variables: {
              count: 20,
              cursor: null,
              enableRanking: true,
              includePromotedContent: true,
              requestContext: "launch",
              seenTweetIds: [],
            },
            fieldToggles: {
              withPayments: false,
            },
            features: defaultFeatures,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Failed to fetch timeline:", error);
        return null;
      }
    }
  });
}
