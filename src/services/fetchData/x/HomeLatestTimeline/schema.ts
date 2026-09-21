import { z } from "zod";

// Helper Schema for Url structures inside entities
const XUrlEntity = z.object({
  display_url: z.string(),
  expanded_url: z.string().url(),
  url: z.string().url(),
  indices: z.array(z.number()).length(2),
});

// Entities Block Schema (Handles urls inside bios and link fields)
const LegacyEntities = z.object({
  description: z.object({
    urls: z.array(XUrlEntity),
  }),
  url: z
    .object({
      urls: z.array(XUrlEntity),
    })
    .optional(),
});

// The historical Legacy Data Schema
const XUserLegacy = z
  .object({
    created_at: z.string(), // e.g., "Thu Jan 31 22:59:59 +0000 2008"
    default_profile: z.boolean(),
    default_profile_image: z.boolean(),
    description: z.string(),
    entities: LegacyEntities,
    favourites_count: z.number().int().nonnegative(),
    followers_count: z.number().int().nonnegative(),
    friends_count: z.number().int().nonnegative(), // "Following" count
    location: z.string().catch(""), // Fallback to empty string if missing
    media_count: z.number().int().nonnegative(),
    name: z.string(),
    profile_banner_url: z.string().url().optional(), // Highly active accounts can occasionally lack a banner
    profile_image_url_https: z.string().url(),
    protected: z.boolean(),
    screen_name: z.string(), // The text handle (without the '@')
    statuses_count: z.number().int().nonnegative(), // Post count
    verified: z.boolean(),
    verified_type: z
      .enum(["Blue", "Business", "Government", "None"])
      .optional()
      .catch("None"),
  })
  .optional();

// The Core Root User Schema (core.user_results.result)
export const XUser = z.object({
  __typename: z.literal("User"),
  id: z.string(), // Base64 internal GraphQL string
  rest_id: z.string().regex(/^\d+$/), // Numeric string representation of ID
  affiliates_highlighted_label: z.unknown().optional(),
  has_graduated_to_coauthor: z.boolean().optional().catch(false),
  is_blue_verified: z.boolean(),
  profile_image_shape: z.enum(["Circle", "Square"]).catch("Circle"),
  legacy: XUserLegacy,
  smart_blocked_by: z.boolean().optional().catch(false),
  smart_blocking: z.boolean().optional().catch(false),
  legacy_extended_profile: z.unknown().optional(),
  is_profile_translatable: z.boolean().optional().catch(false),
  verification_info: z
    .object({
      reason: z
        .object({
          description: z.object({
            text: z.string(),
          }),
        })
        .optional(),
    })
    .optional(),
  business_account: z.unknown().optional(),
  creator_subscriptions_count: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .catch(0),
});

// Helper for core entity arrays (hashtags, symbols, user_mentions)
const XLegacyEntityItem = z.object({
  indices: z.array(z.number()).length(2),
  text: z.string().optional(), // For hashtags/symbols
  screen_name: z.string().optional(), // For user_mentions
  name: z.string().optional(),
  id_str: z.string().optional(),
});

// Helper for media entities (images, videos, animated gifs)
const XLegacyMediaEntity = z.object({
  display_url: z.string(),
  expanded_url: z.string().url(),
  id_str: z.string().regex(/^\d+$/),
  indices: z.array(z.number()).length(2),
  media_url_https: z.string().url(),
  type: z.enum(["photo", "video", "animated_gif"]),
  url: z.string().url(),
  sizes: z
    .object({
      w: z.number().int().optional(),
      h: z.number().int().optional(),
      resize: z.enum(["crop", "fit"]).optional(),
    })
    .optional(),
});

// Main Legacy Schema
export const XTweetLegacySchema = z
  .object({
    created_at: z.string(), // e.g., "Mon Sep 21 11:00:00 +0000 2026"
    id_str: z.string().regex(/^\d+$/), // Numeric string representation of Tweet ID
    full_text: z.string(), // The complete text content of the post

    // Public Engagement Metrics
    favorite_count: z.number().int().nonnegative(),
    retweet_count: z.number().int().nonnegative(),
    reply_count: z.number().int().nonnegative(),
    quote_count: z.number().int().nonnegative(),

    // Interaction State Flags for Requesting User
    favorited: z.boolean(),
    retweeted: z.boolean(),

    // Explicit Context Strings
    lang: z.string().length(2).catch("en"), // Language code tag (e.g., "en", "es")
    possibly_sensitive: z.boolean().optional().catch(false),
    bookmark_count: z.number().int().nonnegative().optional().catch(0),

    // Reply/Conversation Context (populated only if the post is a reply)
    in_reply_to_screen_name: z.string().optional(),
    in_reply_to_status_id_str: z.string().regex(/^\d+$/).optional(),
    in_reply_to_user_id_str: z.string().regex(/^\d+$/).optional(),
    conversation_id_str: z.string().regex(/^\d+$/).optional(),

    // Quote Post Linkages
    is_quote_status: z.boolean(),
    quoted_status_id_str: z.string().regex(/^\d+$/).optional(),
    quoted_status_permalink: z
      .object({
        url: z.string().url(),
        expanded: z.string().url(),
        display: z.string(),
      })
      .optional(),

    // Rich Content Media & Link Parsers
    entities: z
      .object({
        hashtags: z.array(XLegacyEntityItem).catch([]),
        symbols: z.array(XLegacyEntityItem).catch([]),
        user_mentions: z.array(XLegacyEntityItem).catch([]),
        urls: z
          .array(
            z.object({
              display_url: z.string(),
              expanded_url: z.string().url(),
              url: z.string().url(),
              indices: z.array(z.number()).length(2),
            }),
          )
          .catch([]),
        media: z.array(XLegacyMediaEntity).optional(),
      })
      .passthrough(),

    // Retweets & Extended Media Containers
    extended_entities: z
      .object({
        media: z.array(XLegacyMediaEntity),
      })
      .optional(),
  })
  .optional();

// Tweet Data
// (Extend this with user data, media, text, etc., as needed)
export const TimelineTweetSchema = z.object({
  __typename: z.literal("TimelineTweet"),
  tweet_results: z.object({
    result: z.looseObject({
      rest_id: z.string().optional(),
      core: z
        .object({
          user_results: z
            .object({
              result: XUser,
            })
            .optional(),
        })
        .optional(),
      legacy: XTweetLegacySchema, // Contains full tweet text, likes, etc.
      tweet: z
        .object({
          legacy: XTweetLegacySchema, // Contains full tweet text, likes, etc.
        })
        .optional(),
    }),
  }),
});

// Pagination Cursors (Top/Bottom)
export const TimelineCursorSchema = z
  .object({
    entryId: z.string(), // e.g., "cursor-bottom-1867041249938"
    sortIndex: z.string(),
    content: z.object({
      __typename: z.literal("TimelineTimelineCursor"),
      value: z.string(),
      cursorType: z.enum(["Top", "Bottom"]),
    }),
  })
  .optional();

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

export type XUser = z.infer<typeof XUser>;
export type XTweetLegacy = z.infer<typeof XTweetLegacySchema>;
export type XTimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type XTimelineCursor = z.infer<typeof TimelineCursorSchema>;
export type XTimelineItem = z.infer<typeof TimelineItemSchema>;
export type XHomeLatestTimelineResponse = z.infer<
  typeof HomeLatestTimelineResponseSchema
>;
