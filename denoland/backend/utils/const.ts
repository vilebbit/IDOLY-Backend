export const CorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST",
} as const;

export const UpdateTimeKey = "_UpdateTime" as const;

export const OctoObservedKey = "_OctoObserved" as const;

export const CommuXKey = "CommuX";
export const CommuXSearchIndex = "s-commux";
export const MessageXKey = "MessageX";
export const MessageXSearchIndex = "s-messagex";

export const NonExpandedKeys = [
  "Notice",
  "Octo",
  "Skillx",
  UpdateTimeKey,
  OctoObservedKey,
] as const;

export const XXHashSeed = 0xe2d09373;

export const DefaultLimit = 30;
export const MaxLimit = 150;
