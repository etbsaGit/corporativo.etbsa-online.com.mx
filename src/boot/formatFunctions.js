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

export function formatDateplusone(currentDay) {
  const nextDay = date.addToDate(currentDay, { days: 1 });
  return date.formatDate(nextDay, "dddd D [de] MMMM [del] YYYY");
}

export function formatDateSlim(currentDay) {
  if (!currentDay) return "Pendiente";
  // const nextDay = date.addToDate(currentDay, { days: 1 });
  return date.formatDate(currentDay, "D/MMM/YYYY");
}

export function formatDateplusoneSlim(currentDay) {
  if (!currentDay) return "Pendiente";
  const nextDay = date.addToDate(currentDay, { days: 1 });
  return date.formatDate(nextDay, "D/MMM/YYYY");
}

export function calcularDiasRestantes(fechaLimite) {
  if (!fechaLimite) {
    return "No definido";
  }

  const ahora = new Date();
  const fechaLimiteDate = new Date(fechaLimite);
  const diferencia = fechaLimiteDate.getTime() - ahora.getTime();
  return Math.ceil(diferencia / (1000 * 3600 * 24));
}
