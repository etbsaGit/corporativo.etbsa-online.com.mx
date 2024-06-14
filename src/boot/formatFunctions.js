import { date } from "quasar";

export function formatTime(time) {
  if (!time) return "No definido";
  const timeArray = time.split(":");
  return `${timeArray[0]}:${timeArray[1]}`;
}

export function formatDate(currentDay) {
  // const nextDay = date.addToDate(currentDay, { days: 1 });
  return date.formatDate(currentDay, "dddd D [de] MMMM [del] YYYY");
}
