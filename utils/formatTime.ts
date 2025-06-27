import { formatDistanceToNowStrict, isValid } from "date-fns";

export function getRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (!isValid(date)) return "Invalid date";

  return formatDistanceToNowStrict(date, { addSuffix: true });
}
