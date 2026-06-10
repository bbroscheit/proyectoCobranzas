const {
  Client, Clienturuguay, Clientchile, Clientrosario, Clientecopatagonico, Clientecobahia, Clientecoportatiles,
  Document, Documenturuguay, Documentchile, Documentrosario, Documentecopatagonico, Documentecobahia, Documentecoportatiles,
} = require("../../bd");
const { getNombreSucursal } = require("../mailModels/sucursales");

// Tipos que representan deuda (suma) y crédito (resta) — consistente con limpiarClientesSinDeuda
const TIPOS_DEUDA   = [1, 3];
const TIPOS_CREDITO = [7, 8, 9];

const SUCURSAL_MODELS = [
  { id: 1, clientModel: Client,               docModel: Document               },
  { id: 2, clientModel: Clienturuguay,         docModel: Documenturuguay        },
  { id: 3, clientModel: Clientchile,           docModel: Documentchile          },
  { id: 4, clientModel: Clientrosario,         docModel: Documentrosario        },
  { id: 5, clientModel: Clientecopatagonico,   docModel: Documentecopatagonico  },
  { id: 6, clientModel: Clientecobahia,        docModel: Documentecobahia       },
  { id: 7, clientModel: Clientecoportatiles,   docModel: Documentecoportatiles  },
].map(s => ({ ...s, nombre: getNombreSucursal(s.id) }));

module.exports = { SUCURSAL_MODELS, TIPOS_DEUDA, TIPOS_CREDITO };
