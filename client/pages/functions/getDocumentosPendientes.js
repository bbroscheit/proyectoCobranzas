// Tipos que suman deuda: facturas (1), notas de débito (3)
export const TIPOS_DEUDA = [1, 3];
// Tipos que restan deuda: notas de crédito (7, 8), recibos (9)
export const TIPOS_CREDITO = [7, 8, 9];

// "YYYY-MM-DD" con new Date() se toma como UTC y en Argentina se muestra un día antes
const parseFechaLocal = (fecha) => {
  if (!fecha) return null;
  const [y, m, d] = String(fecha).slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};

// Documentos con saldo pendiente del cliente, tomados de la base de la sucursal del usuario
// (los mismos que usa la agenda para calcular vencido / a vencer)
export async function getDocumentosPendientes(userId, clienteId) {
  const res = await fetch(
    `http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/getAllDocumentsByClient?userId=${encodeURIComponent(
      userId
    )}&clienteId=${encodeURIComponent(clienteId)}`
  );
  if (!res.ok) throw new Error("Error al traer documentos del cliente");
  const timeline = await res.json();

  return (Array.isArray(timeline) ? timeline : [])
    .filter((item) => item.tipo === "documento")
    .map(({ payload: doc }) => ({
      NumeroDocumento: doc.numerodocumento,
      FechaDocumento: parseFechaLocal(doc.fechadocumento),
      FechaVencimiento: parseFechaLocal(doc.fechavencimiento),
      MontoOriginal: parseFloat(doc.montooriginal || 0),
      MontoPendiente: parseFloat(doc.montopendiente || 0),
      TipoDocumento: doc.tipodocumento,
    }))
    .filter((doc) => doc.MontoPendiente > 0)
    .sort((a, b) => new Date(a.FechaVencimiento) - new Date(b.FechaVencimiento));
}
