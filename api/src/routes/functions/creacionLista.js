require("dotenv").config();
const { Usuario, Listadellamada } = require('../../bd');
const { Op } = require('sequelize');
const getClientesPorUsuario = require("./creacionListaLLamadas/getClientesPorUsuario");
const getDocumentosPorClientes = require("./creacionListaLLamadas/getDocumentsPorCliente");
const crearListaDeLlamadas = require("./creacionListaLLamadas/creaListaDeLlamadas");
const limpiarClientesSinDeuda = require("./creacionListaLLamadas/limpiarClientesSinDeuda");
const crearGestionDelDia = require("../functions/crearGestionDelDia");

// Tipos que suman deuda y los que restan (créditos/pagos)
const TIPOS_DEUDA   = [1, 3];
const TIPOS_CREDITO = [7, 8, 9];

function calcularDeudaNeta(documents) {
  return documents.reduce((acc, doc) => {
    const monto = parseFloat(doc.montopendiente || 0);
    if (monto <= 0) return acc;
    if (TIPOS_DEUDA.includes(doc.tipodocumento))   return acc + monto;
    if (TIPOS_CREDITO.includes(doc.tipodocumento)) return acc - monto;
    return acc;
  }, 0);
}

const creacionLista = async () => {

  let usuarios = [];
  try {
    usuarios = await Usuario.findAll({ where: { isdelete: false } });
    console.log("Usuarios cargados para creación de listas:", usuarios.length);
  } catch (error) {
    console.error("❌ Error al cargar usuarios:", error);
    return;
  }

  for (const usuario of usuarios) {
    try {
      // 1. Traer todos los clientes del gestor con sus documentos
      const datosClientes = await getClientesPorUsuario(usuario);
      const datosConDocumentos = await getDocumentosPorClientes(datosClientes);

      // 2. Armar un Set con los IDs que ya tienen agenda futura (fecha > hoy)
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const listasPosteriores = await Listadellamada.findAll({
        where: {
          usuarioId: usuario.id,
          fecha: { [Op.gt]: hoy },
        },
      });

      const enListaFutura = new Set();
      for (const lista of listasPosteriores) {
        (lista.clientes || []).forEach(c => enListaFutura.add(Number(c.id)));
      }

      // 3. Filtrar: deuda neta != 0 y sin agenda futura
      const clientesParaHoy = datosConDocumentos.clientes
        .filter(cliente => {
          if (enListaFutura.has(Number(cliente.id))) return false;
          const deudaNeta = parseFloat(calcularDeudaNeta(cliente.documents).toFixed(2));
          return deudaNeta !== 0;
        })
        .map(cliente => ({ id: cliente.id, llamado: false }));

      // 4. Crear o encontrar la lista de hoy y poblarla
      const listadoHoy = await crearListaDeLlamadas(usuario);
      if (!listadoHoy) continue;

      await listadoHoy.update({ clientes: clientesParaHoy });

      // 5. Enriquecer con datos completos, deduplicar y ordenar
      await limpiarClientesSinDeuda(listadoHoy, datosConDocumentos);

      // 6. Crear gestión del día
      await crearGestionDelDia(usuario, listadoHoy);

    } catch (error) {
      console.error(`❌ Error procesando usuario ${usuario.firstname} ${usuario.lastname}:`, error);
    }
  }
};

module.exports = creacionLista;
