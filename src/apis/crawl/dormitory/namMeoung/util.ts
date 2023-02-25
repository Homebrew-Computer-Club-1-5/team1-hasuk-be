export function extractPostIdFromOnClick(str) {
  const match = str.match(/selectitem\("([^"]+)"\); return false;/);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}
