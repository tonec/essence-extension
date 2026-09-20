import { hasProperty } from "./hasProperty";

export type Message<T = unknown> = {
  target: "BACKGROUND" | "BRIDGE";
  action: string;
  payload: Record<string, T>;
};

export const isMessage = <T = unknown>(
  message: unknown,
): message is Message<T> => {
  if (message && typeof message === "object") {
    if (hasProperty(message, "target") && hasProperty(message, "action")) {
      return true;
    }
  }

  return false;
};
