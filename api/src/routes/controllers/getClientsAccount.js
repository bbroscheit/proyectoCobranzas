const sql = require("mssql");

const config = {
  user: "sa",
  password: "Barriletec0smic",
  server: "SQL2-BA",
  database: "BASANICRM_MSCRM",
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

const getClientsAccount = async () => {
  let promoter = "Belen Soria";
  try {
    // conectamos
    await sql.connect(config);

    const request = new sql.Request();

    request.input("promoter", sql.VarChar, promoter);

    // Ejecutamos la consulta
    const result = await request.query(
      `SELECT 
        new_codigodecliente as cliente, 
        new_apellidonombrerazonsocial as name, 
        SIC as cuit, 
        new_1contactocobridName as contacto 
            FROM Account 
                WHERE new_gestordecobranzasidName = @promoter`
    );

    return result.recordset;
  } catch (err) {
    console.error("Error al ejecutar la consulta getClientsAccount:", err);
    return err;
  } finally {
    // Cerramos
    await sql.close();
  }
};

module.exports = getClientsAccount;
