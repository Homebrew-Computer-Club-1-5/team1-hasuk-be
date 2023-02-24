export function stringToDateObject(dateString) {
  const [date, weekday] = dateString.split(' ');
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj;
}
