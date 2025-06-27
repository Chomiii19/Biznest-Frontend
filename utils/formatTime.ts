import { formatDistanceToNowStrict, parseISO, isValid } from "date-fns";

export function getRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;

  if (!isValid(date)) return "Invalid date";

  return formatDistanceToNowStrict(date, { addSuffix: true });
}
