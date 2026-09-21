import { Message } from "@/utils/isMessage";
import testXfeed from "@/test/data/x-feed-all.json";
import { HomeLatestTimelineResponseSchema } from "./xSchema";
import { getBottomCursor } from "./xGetBottomCursor";
import { getEarliestPostDate } from "./xGetLastPostDate";
import { getRandomRange } from "@/utils/getRandomRange";
import { xFetch } from "./xFetch";
import { withTimeout } from "@/utils/withTimeout";
import { sleep } from "@/utils/sleep";

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

  let lastSyncDate: Date = new Date();
  lastSyncDate.setHours(lastSyncDate.getHours() - 12);

  let cursor: undefined | string = undefined;
  let earliestPostDate: string | undefined = undefined;

  do {
    // fetch data while earliest post date is after last sync date
    // const result = HomeLatestTimelineResponseSchema.safeParse(testXfeed);
    const result = await xFetch({ auth, csrf, queryId, cursor });

    console.log("result", result);

    // if (!result.success) {
    //   console.log(
    //     "Parse error: ",
    //     JSON.stringify(result.error.issues, null, 2),
    //   );
    // } else {
    //   console.log("Parse success: ", result.data);
    // }

    // if (!result.data) return;

    earliestPostDate = getEarliestPostDate(result.data);
    cursor = getBottomCursor(result.data);

    await sleep(getRandomRange(3000, 5000));

    // Test block
    console.log("earliestPostDate", new Date(earliestPostDate!));
    console.log("lastSyncDate", lastSyncDate);
    console.log("test", new Date(earliestPostDate!) > lastSyncDate);
  } while (new Date(earliestPostDate!) > lastSyncDate);
};
