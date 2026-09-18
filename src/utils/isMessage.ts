import { hasProperty } from "./hasProperty";

type Message = {
  target: string;
  action: string;
};

export const isMessage = (message: unknown): message is Message => {
  if (message && typeof message === "object") {
    if (hasProperty(message, "target") && hasProperty(message, "action")) {
      return true;
    }
  }

  return false;
};
