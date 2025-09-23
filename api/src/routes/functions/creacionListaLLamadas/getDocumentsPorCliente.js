const { Document, Documenturuguay, Documentchile } = require("../../../bd");
const pMap = require("p-map");
const { Sequelize } = require("sequelize");

// Busca documentos para todos los clientes de un gestor en su sucursal
const getDocumentosPorClientes = async (gestorData) => {
  try {
    let documentosModel;

    switch (gestorData.sucursal) {
      case 1:
        documentosModel = Document;
        break;
      case 2:
        documentosModel = Documenturuguay;
        break;
      case 3:
        documentosModel = Documentchile;
        break;
      default:
        console.error(` Sucursal inválida: ${gestorData.sucursal}`);
        return {
          gestor: gestorData.gestor,
          clientes: [],
          sucursal: gestorData.sucursal,
        };
    }

    if (!documentosModel) {
      console.error(
        `❌ No se encontró modelo de documentos para la sucursal ${gestorData.sucursal}`
      );
      return { ...gestorData, clientes: [] };
    }

    // Recorremos todos los clientes y buscamos sus documentos
    const clientesConDocs = await pMap(
      gestorData.clientes,
      async (cliente) => {
        const documentos = await documentosModel.findAll({
          where: { numerocliente: cliente.id },
        });

        return {
          ...cliente,
          documents: documentos.map((doc) => doc.toJSON()),
        };
      },
      { concurrency: 5 } // Limita a 5 consultas simultáneas (ajustable)
    );

    return {
      gestor: gestorData.gestor,
      clientes: clientesConDocs,
      sucursal: gestorData.sucursal,
    };
  } catch (error) {
    console.error(
      `❌ Error obteniendo documentos para gestor ${gestorData.gestor}:`,
      error
    );
    return {
      gestor: gestorData.gestor,
      clientes: [],
      sucursal: gestorData.sucursal,
    };
  }
};

module.exports = getDocumentosPorClientes;
