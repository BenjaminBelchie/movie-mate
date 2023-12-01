export function formatDateString(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return formattedDate;
}
