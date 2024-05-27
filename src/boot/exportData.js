import { exportFile } from "quasar";
import { Notify } from "quasar";

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== undefined ? formatFn(val, row) : val;

  formatted =
    formatted === undefined || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  if (typeof val === "object" && val !== null) {
    // Si val es un objeto, intentamos acceder a una propiedad específica
    const propertyName = "nombre"; // Cambia 'nombre' por la propiedad que deseas mostrar
    formatted = val[propertyName] || ""; // Utilizamos 'nombre' como ejemplo
  }
  return `"${formatted}"`;
}

export function exportTableCSV(columns, rows, fileName = "export.csv") {
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      rows.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === undefined ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");

  const status = exportFile(fileName, content, "text/csv");

  if (status !== true) {
    Notify.create({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
}
