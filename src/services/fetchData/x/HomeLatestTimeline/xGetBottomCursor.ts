import {
  XTimelineEntry,
  XTimelineCursor,
  XHomeLatestTimelineResponse,
} from "./schema";

const isCursorEntry = (entry: XTimelineEntry): entry is XTimelineCursor => {
  return entry?.content?.__typename === "TimelineTimelineCursor";
};

export const getBottomCursor = (result: XHomeLatestTimelineResponse) => {
  const instructions = result.data.home.home_timeline_urt.instructions;
  const addEntries = instructions.find(
    (inst) => inst.type === "TimelineAddEntries",
  );

  if (addEntries && "entries" in addEntries) {
    const cursorEntry = addEntries.entries.find(
      (entry) =>
        isCursorEntry(entry) && entry?.entryId.startsWith("cursor-bottom-"),
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
