import { hasProperty } from "./hasProperty";

type Message<T> = {
  target: "BACKGROUND" | "BRIDGE";
  action: string;
  payload: Record<string, T>;
};

export const isMessage = <T extends unknown>(
  message: unknown,
): message is Message<T> => {
  if (message && typeof message === "object") {
    if (hasProperty(message, "target") && hasProperty(message, "action")) {
      return true;
    }
  }

  return false;
};
