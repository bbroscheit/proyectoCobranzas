require("dotenv").config();
const sql = require("mssql");
const { Clientecoportatiles } = require('../../bd');

const { CRM_USER, CRM_PASSWORD, CRM_SERVER, CRM_DATABASE_ECOPORTATILES } = process.env;

const crmConfig = {
  user: CRM_USER,
  password: CRM_PASSWORD,
  server: CRM_SERVER,
  database: CRM_DATABASE_ECOPORTATILES,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

const fetchClientsFromCRMEcoportatiles = async () => {
  try {
    const pool = await sql.connect(crmConfig);
    const result = await pool
      .request()
      .query(
        `SELECT
          new_gestordecobranzasidName AS gestor,
          new_1contactocobridName AS contacto1,
          new_apellidonombrerazonsocial AS razonsocial,
          new_codigodecliente AS codigocliente,
          new_facturacionelectronica AS email
        FROM Account WHERE statecode = 0`
      );

    const existingClients = await Clientecoportatiles.findAll({
      where: {
        id: result.recordset.map(client => client.codigocliente)
      }
    });

    const existingMap = new Map();
    existingClients.forEach(c => existingMap.set(c.id, c));

    let toCreate = [];
    let toUpdate = [];

    for (const client of result.recordset) {
      const clientId = parseInt(String(client.codigocliente).trim(), 10);
      const existing = existingMap.get(clientId);
      if (!existing) {
        toCreate.push({
          id: client.codigocliente,
          name: client.razonsocial || "Sin asignar",
          gestor: client.gestor || "Sin asignar",
          contacto1: client.contacto1 || "Sin asignar",
          email: client.email || "Sin asignar"
        });
      } else {
        if (
          existing.email !== (client.email || "Sin asignar") ||
          existing.gestor !== (client.gestor || "Sin asignar")
        ) {
          toUpdate.push({
            id: client.codigocliente,
            email: client.email || "Sin asignar",
            gestor: client.gestor || "Sin asignar",
          });
        }
      }
    }

    if (toCreate.length > 0) {
      await Clientecoportatiles.bulkCreate(toCreate, {
        updateOnDuplicate: ["name", "gestor", "contacto1", "email"]
      });
      console.log(`Ecoportatiles - Clientes creados/actualizados: ${toCreate.length}`);
    }

    for (const update of toUpdate) {
      await Clientecoportatiles.update(
        { email: update.email, gestor: update.gestor },
        { where: { id: update.id } }
      );
    }

    await pool.close();
  } catch (err) {
    console.error("Error al obtener clientes Ecoportatiles del CRM:", err);
  }
};

module.exports = fetchClientsFromCRMEcoportatiles;
