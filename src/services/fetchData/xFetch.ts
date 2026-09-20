import { HomeLatestTimelineResponseSchema } from "./xSchema";
import { defaultFeatures, defaultHeaders } from "./xRequestDefaults";

export const xFetch = async ({
  auth,
  csrf,
  queryId,
  cursor,
}: {
  auth: string;
  csrf: string;
  queryId: string;
  cursor: string | null;
}) => {
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
          cursor,
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

    const rawData = await response.json();

    const result = HomeLatestTimelineResponseSchema.safeParse(rawData);

    if (!result.success) {
      console.error("X API Response format updated:", result.error.format());
      return;
    }

    return result;
  } catch (error) {
    console.error("Failed to fetch timeline:", error);
    return null;
  }
};
