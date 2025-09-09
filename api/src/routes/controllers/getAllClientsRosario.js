require("dotenv").config();
const sql = require("mssql");
const { Clientrosario } = require('../../bd');

const { CRM_USER, CRM_PASSWORD, CRM_SERVER_ROSARIO, CRM_DATABASE_ROSARIO } = process.env;

// Configuración de la base de datos CRM
const crmConfig = {
  user: CRM_USER,
  password: CRM_PASSWORD,
  server: CRM_SERVER_ROSARIO,
  database: CRM_DATABASE_ROSARIO,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

// Función para obtener todos los clientes de la base de datos CRM
const getAllClientsRosario = async () => {
  try {
    const pool = await sql.connect(crmConfig);
    const result = await pool
      .request()
      .query(
        "SELECT new_gestordecobranzasidName AS gestor , new_1contactocobridName AS contacto1 , new_apellidonombrerazonsocial AS razonsocial, new_codigodecliente AS codigocliente, new_facturacionelectronica AS email FROM Account"
      ); 
    //console.log("Clientes obtenidos:", result.recordset);

    const existingClients = await Clientrosario.findAll({
      where: {
        id: result.recordset.map(client => client.codigocliente)
      }
    });

    const existingMap = new Map()
    existingClients.forEach(c => existingMap.set(c.id , c ))

    let toCreate = []
    let toUpdate = []

    for (const client of result.recordset) {
      const clientId = String(client.codigocliente).trim();
      const existing = existingMap.get(clientId);
      if(!existing){
        toCreate.push({
          id: client.codigocliente,
          name: client.razonsocial || "Sin asignar",
          gestor: client.gestor || "Sin asignar",
          contacto1: client.contacto1 || "Sin asignar",
          email: client.email || "Sin asignar"
        })
      } else {
        if(
          existing.mail !== (client.mail || "Sin asignar") ||
          existing.gestor !== (client.gestor || "Sin asignar") 
        ){
          toUpdate.push({
            id: client.codigocliente,
            name: client.mail || "Sin asignar",
            gestor: client.gestor || "Sin asignar",
          })
        }
      }
    }

    if(toCreate.length > 0){
      await Clientrosario.bulkCreate(toCreate)
      console.log(`Clientes creados: ${toCreate.length}`);
    }

    for(const update of toUpdate){
      await Clientrosario.update(
        { email: update.email, gestor: update.gestor },
        { where: { id: update.id } }
      );
      console.log(`Cliente actualizado: ${update.id}`);
    }
  
    await pool.close();
  } catch (err) {
    console.error("Error al obtener clientes del CRM Rosario:", err);
  }
};

module.exports = getAllClientsRosario;