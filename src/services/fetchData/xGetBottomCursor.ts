import {
  TimelineEntry,
  TimelineCursor,
  HomeLatestTimelineResponse,
} from "./xSchema";

const isCursorEntry = (entry: TimelineEntry): entry is TimelineCursor => {
  return entry?.content?.__typename === "TimelineTimelineCursor";
};

export const getBottomCursor = (result: HomeLatestTimelineResponse) => {
  const instructions = result.data.home.home_timeline_urt.instructions;
  const addEntries = instructions.find(
    (inst) => inst.type === "TimelineAddEntries",
  );

  if (addEntries && "entries" in addEntries) {
    const cursorEntry = addEntries.entries.find(
      (entry) =>
        isCursorEntry(entry) && entry.entryId.startsWith("cursor-bottom-"),
    );

    if (
      cursorEntry &&
      cursorEntry.content.__typename === "TimelineTimelineCursor"
    ) {
      return cursorEntry.content.value;
    }
  }

  return undefined;
};
