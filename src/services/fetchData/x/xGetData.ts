import { Message } from "@/utils/isMessage";
import testXfeed from "@/test/data/x-feed-all.json";
import { HomeLatestTimelineResponseSchema } from "./xSchema";
import { getBottomCursor } from "./xGetBottomCursor";

export const xGetData = async (message: Message) => {
  const { auth, csrf, queryId } = message.payload;

  if (
    typeof auth !== "string" ||
    typeof csrf !== "string" ||
    typeof queryId !== "string"
  ) {
    console.warn("Either 'auth', 'csrf' or 'queryId' not found.");
    return;
  }

  const result = HomeLatestTimelineResponseSchema.parse(testXfeed); // await xFetch({ auth, csrf, queryId, cursor });

  const cursor: string | undefined = getBottomCursor(result);

  console.log("cursor", cursor);
};
