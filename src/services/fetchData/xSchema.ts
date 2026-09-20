import { z } from "zod";

// Pagination Cursors (Top/Bottom)
export const TimelineCursorSchema = z.object({
  entryId: z.string(), // e.g., "cursor-bottom-1867041249938"
  sortIndex: z.string(),
  content: z.object({
    __typename: z.literal("TimelineTimelineCursor"),
    value: z.string(), // 👈 The string you use for the next request
    cursorType: z.enum(["Top", "Bottom"]),
  }),
});

// Tweet Data
// (Extend this with user data, media, text, etc., as needed)
export const TimelineTweetSchema = z.object({
  __typename: z.literal("TimelineTweet"),
  tweet_results: z.object({
    result: z.looseObject({
      rest_id: z.string().optional(),
      core: z.any().optional(),
      legacy: z.any().optional(), // Contains full tweet text, likes, etc.
    }),
  }),
});

// Tweet Entry in the timeline
export const TimelineItemSchema = z.object({
  entryId: z.string(), // e.g., "tweet-1867041249938530657"
  sortIndex: z.string(),
  content: z.looseObject({
    __typename: z.literal("TimelineTimelineItem"),
    itemContent: TimelineTweetSchema,
    feedbackInfo: z
      .object({
        feedbackKeys: z.array(z.string()),
      })
      .optional(),
  }),
});

// Ads, prompt modules, or clusters (TimelineModule)
export const TimelineModuleSchema = z.object({
  entryId: z.string(),
  sortIndex: z.string(),
  content: z.looseObject({
    __typename: z.literal("TimelineTimelineModule"),
    items: z.array(z.any()),
  }),
});

// Union of all possible objects inside the instruction entries
export const TimelineEntrySchema = z.union([
  TimelineItemSchema,
  TimelineCursorSchema,
  TimelineModuleSchema,
]);

// Array instructions ('TimelineAddEntries')
export const TimelineInstructionSchema = z.object({
  type: z.literal("TimelineAddEntries"),
  entries: z.array(TimelineEntrySchema),
});

// Core Parent Endpoint Schema
export const HomeLatestTimelineResponseSchema = z.object({
  data: z.object({
    home: z.object({
      home_timeline_urt: z.object({
        instructions: z.array(TimelineInstructionSchema),
        responseObjects: z
          .object({
            feedbackActions: z.array(z.any()).optional(),
          })
          .optional(),
      }),
    }),
  }),
});

export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type TimelineCursor = z.infer<typeof TimelineCursorSchema>;
export type HomeLatestTimelineResponse = z.infer<
  typeof HomeLatestTimelineResponseSchema
>;
