require('dotenv').config();
const sql = require('mssql');

const { CRM_USER , 
    CRM_PASSWORD , 
    CRM_SERVER , 
    CRM_DATABASE
} = process.env;


const config = {
    user: CRM_USER,
    password: CRM_PASSWORD,
    server: CRM_SERVER,
    database: CRM_DATABASE,
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    
    },
};


const getClientByPromoter = async () => {
    let promoter = "Belen Soria"
    try {
        // conectamos
        await sql.connect(config);

        const request = new sql.Request();

        request.input('promoter', sql.VarChar, promoter);

        // Ejecutamos la consulta
        const result = await request.query(
            `SELECT new_codigodecliente as cliente 
                FROM Account 
                    WHERE new_gestordecobranzasidName = @promoter`);
      
        return result.recordset;

    } catch (err) {
        
        console.error('Error al ejecutar la consulta:', err);
        return err

    } finally {

        // Cerramos
        await sql.close();
    }
}

module.exports = getClientByPromoter;