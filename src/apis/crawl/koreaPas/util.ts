export function toTimestamp(dateString: string): number {
  const date = new Date(dateString);
  return date.getTime();
}
