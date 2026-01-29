const PREFIX = 'aiModelOps_';

function keyOf(key: string) {
  return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
}

export function storageGetJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(keyOf(key));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function storageSetJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(keyOf(key), JSON.stringify(value));
  } catch {}
}

export function storageRemove(key: string) {
  try {
    window.localStorage.removeItem(keyOf(key));
  } catch {}
}

