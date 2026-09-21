import { TimeoutManager } from "@base-ui/react/internals/TimeoutManager";

export const withTimeout = (promise: Promise<unknown>, ms: number) => {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`Iteration timed out after ${ms}ms`)),
      ms,
    );
  });

  // Clean up the timer when the primary task completes to avoid memory leaks
  return Promise.race([promise, timeoutPromise]).finally(() =>
    clearTimeout(timeoutId),
  );
};
