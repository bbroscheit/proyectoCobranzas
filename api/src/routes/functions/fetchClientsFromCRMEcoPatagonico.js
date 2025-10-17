require("dotenv").config();
const sql = require("mssql");
const { Clientecopatagonico } = require('../../bd');

const { CRM_USER, CRM_PASSWORD, CRM_SERVER, CRM_DATABASE_ECOPATAGONICOS } = process.env;

// Configuración de la base de datos CRM
const crmConfig = {
  user: CRM_USER,
  password: CRM_PASSWORD,
  server: CRM_SERVER,
  database: CRM_DATABASE_ECOPATAGONICOS,
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

// Función para obtener todos los clientes de la base de datos CRM
const fetchClientsFromCRMEcoPatagonico = async () => {
  try {
    const pool = await sql.connect(crmConfig);
    const result = await pool
      .request()
      .query(
        "SELECT new_gestordecobranzasidName AS gestor , new_1contactocobridName AS contacto1 , new_apellidonombrerazonsocial AS razonsocial, new_codigodecliente AS codigocliente, new_facturacionelectronica AS email FROM Account"
      ); 
    //console.log("Clientes obtenidos:", result.recordset);

    const existingClients = await Clientecopatagonico.findAll({
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
          existing.email !== (client.email || "Sin asignar") ||
          existing.gestor !== (client.gestor || "Sin asignar") 
        ){
          toUpdate.push({
            id: client.codigocliente,
            email: client.email || "Sin asignar",
            gestor: client.gestor || "Sin asignar",
          })
        }
      }
    }

    if(toCreate.length > 0){
  await Clientecopatagonico.bulkCreate(toCreate, {
    updateOnDuplicate: ["name", "gestor", "contacto1", "email"]
  });
  console.log(`Clientes creados/actualizados: ${toCreate.length}`);
}

    for(const update of toUpdate){
      await Clientecopatagonico.update(
        { email: update.email, gestor: update.gestor },
        { where: { id: update.id } }
      );
      console.log(`Cliente actualizado: ${update.id}`);
    }
  
    await pool.close();
  } catch (err) {
    console.error("Error al obtener clientes del CRM:", err);
  }
};

module.exports = fetchClientsFromCRMEcoPatagonico;