export function saveLocal(key: string, value: string) {
  return chrome.storage.local.set({ [key]: value });
}

export function getLocal(key: string) {
  return chrome.storage.local.get({ key });
}
