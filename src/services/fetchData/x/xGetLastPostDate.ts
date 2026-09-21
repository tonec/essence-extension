import {
  TimelineEntry,
  TimelineItem,
  HomeLatestTimelineResponse,
} from "./xSchema";

const isTimelineItem = (entry: TimelineEntry): entry is TimelineItem => {
  return entry?.content?.__typename === "TimelineTimelineItem";
};

export const getPosts = (result: HomeLatestTimelineResponse) => {
  const instructions = result.data.home.home_timeline_urt.instructions;
  const addEntries = instructions.find(
    (inst) => inst.type === "TimelineAddEntries",
  );
  let posts: TimelineItem[] = [];

  if (addEntries) {
    posts = addEntries.entries.filter(
      (entry): entry is TimelineItem =>
        isTimelineItem(entry) && entry.entryId.startsWith("tweet-"),
    );
  }

  return posts;
};

export const getEarliestPostDate = (result: HomeLatestTimelineResponse) => {
  const posts = getPosts(result);
  const postDates = posts
    .map((post) => {
      const date =
        post.content.itemContent.tweet_results.result.legacy?.created_at ||
        post.content.itemContent.tweet_results.result.tweet?.legacy?.created_at;

      return date ? new Date(date) : undefined;
    })
    .filter((date) => date !== undefined)
    .sort((a, b) => a.getTime() - b.getTime());

  console.log("postDate", JSON.stringify(postDates, null, 2));

  return postDates[0];
};
