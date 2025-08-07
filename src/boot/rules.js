//esta es para los campos inputs
export const required = (val) => (val && val.length > 0) || "Obligatorio";

//esta para los selects
export const requiredSelect = (val) => val !== null || "Obligatorio";

//esta para los datos numericos que tiene que ser mayores a 0
export const requiredGreaterThan0 = (val) => (val && val > 0) || "Obligatorio";

//Valida que sea nua url y es opcional
export function validateURL(val) {
  if (!val) return true;
  const urlPattern =
    /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
  return urlPattern.test(val) || "Debe ser una URL válida (con http o https)";
}
