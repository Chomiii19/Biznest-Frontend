import { formatDistanceToNowStrict, isValid } from "date-fns";

export function getRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (!isValid(date)) return "Invalid date";

  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const time = `${hours}:${paddedMinutes} ${ampm}`;

  if (isToday) {
    return time;
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateStr = `${monthNames[date.getMonth()]} ${date.getDate()}`;

  return `${dateStr}, ${time}`;
}
