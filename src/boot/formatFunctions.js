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
  if (!currentDay) return "Sin fecha de caducidad";
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

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export function formatPhoneNumber(phoneNumber) {
  // Eliminar cualquier carácter que no sea un dígito
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Aplicar el formato (###)-###-####
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]})-${match[2]}-${match[3]}`;
  }

  // Si no coincide con el patrón esperado, devolver el número sin formato
  return cleaned;
}
