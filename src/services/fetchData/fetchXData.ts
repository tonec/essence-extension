import { Message } from "@/utils/isMessage";
import { defaultFeatures, defaultHeaders } from "./xFetchRequest";

export const fetchXData = async (message: Message) => {
  const { csrf, auth, queryId } = message.payload;

  if (typeof auth !== "string" || typeof csrf !== "string") {
    console.warn("Either 'auth' or 'csrf' not found.");
    return;
  }

  const baseUrl = `https://x.com/i/api/graphql/${queryId}/HomeLatestTimeline`;

  try {
    console.log("fetching");
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

    console.log("response", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch timeline:", error);
    return null;
  }
};
