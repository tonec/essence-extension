import { INTERCEPTED_X_DATA, PROCESS_INTERCEPTED_X_DATA } from "../config";

export default function initial() {
  window.addEventListener("message", async (event) => {
    // Security Check: Only accept messages originating from the current webpage frame
    if (event.source !== window) return;

    if (event.data && event.data.type === "X_TOKENS_CAPTURED") {
      const { csrf, auth, queryId, url } = event.data.payload;
      console.log("data", event.data.payload);

      const variables = {
        count: 20,
        // cursor: cursor, // Dynamically passed for pagination
        seenTweetIds: [],
      };

      const features = {
        rweb_tipjar_consumption_enabled: true,
        responsive_web_graphql_exclude_directive_enabled: true,
        // Add other exact feature flags required by the endpoint...
      };

      const baseUrl = `https://x.com/i/api/graphql/${queryId}/HomeLatestTimeline`;
      // const URL = `${baseUrl}?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`;

      console.log("URL", URL);

      try {
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            Authorization: auth,
            "X-Csrf-Token": csrf,
            "X-Twitter-Active-User": "yes",
            "X-Twitter-Auth-Type": "OAuth2Session",
            "X-Twitter-Client-Language": "en",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queryId,
            variables: {
              count: 20,
              enableRanking: true,
              includePromotedContent: true,
              requestContext: "launch",
              seenTweetIds: ["2101055824739115137", "2101055824739115137"],
            },
            fieldToggles: {
              withPayments: false,
            },
            features: {
              rweb_video_screen_enabled: false,
              rweb_cashtags_enabled: true,
              profile_label_improvements_pcf_label_in_post_enabled: true,
              responsive_web_profile_redirect_enabled: true,
              rweb_tipjar_consumption_enabled: false,
              verified_phone_label_enabled: false,
              creator_subscriptions_tweet_preview_api_enabled: true,
              responsive_web_graphql_timeline_navigation_enabled: true,
              premium_content_api_read_enabled: false,
              communities_web_enable_tweet_community_results_fetch: true,
              c9s_tweet_anatomy_moderator_badge_enabled: true,
              responsive_web_grok_analyze_button_fetch_trends_enabled: false,
              responsive_web_grok_analyze_post_followups_enabled: true,
              rweb_cashtags_composer_attachment_enabled: true,
              responsive_web_jetfuel_frame: true,
              rweb_sports_post_context_enabled: true,
              responsive_web_grok_share_attachment_enabled: true,
              responsive_web_grok_annotations_enabled: true,
              articles_preview_enabled: true,
              responsive_web_edit_tweet_api_enabled: true,
              rweb_conversational_replies_downvote_enabled: false,
              graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
              view_counts_everywhere_api_enabled: true,
              longform_notetweets_consumption_enabled: true,
              responsive_web_twitter_article_tweet_consumption_enabled: true,
              content_disclosure_indicator_enabled: true,
              content_disclosure_ai_generated_indicator_enabled: true,
              responsive_web_grok_show_grok_translated_post: true,
              responsive_web_grok_analysis_button_from_backend: true,
              post_ctas_fetch_enabled: false,
              freedom_of_speech_not_reach_fetch_enabled: true,
              standardized_nudges_misinfo: true,
              tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
              longform_notetweets_rich_text_read_enabled: true,
              longform_notetweets_inline_media_enabled: false,
              responsive_web_nested_quote_preview_enabled: false,
              responsive_web_grok_image_annotation_enabled: true,
              responsive_web_grok_imagine_annotation_enabled: true,
              responsive_web_grok_community_note_auto_translation_is_enabled: true,
              responsive_web_enhance_cards_enabled: false,
            },
          }),
          credentials: "include",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("Failed to fetch timeline:", error);
        return null;
      }
    }

    // if (event.data && event.data.type === INTERCEPTED_X_DATA) {
    //   const { url, data } = event.data.payload;

    //   chrome.runtime.sendMessage(
    //     {
    //       target: "background",
    //       action: PROCESS_INTERCEPTED_X_DATA,
    //       payload: {
    //         url: url,
    //         data: data,
    //         timestamp: Date.now(),
    //       },
    //     },
    //     (response) => {
    //       // Optional: Handle confirmation from the background worker if needed
    //       if (chrome.runtime.lastError) {
    //         console.warn(
    //           "Background worker unavailable:",
    //           chrome.runtime.lastError.message,
    //         );
    //       } else {
    //         console.log("Data successfully logged in background:", response);
    //       }
    //     },
    //   );
    // }
  });
}
