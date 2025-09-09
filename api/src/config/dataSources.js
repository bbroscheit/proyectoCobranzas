// agregamos las bases de datos donde se guardaran los datos de las bases de CRM y GP

const {
    Client, Document,
    Clientrosario, Documentrosario,
    Clienturuguay, Documenturuguay,
    Clientchile, Documentchile,
    
    sequelize
} = require("../bd.js")


module.exports = {
    buenosAires: {
        name: "buenosaires", 
        clientModel: Client, 
        documentModel: Document, 
        getAllClients: require('../routes/controllers/getAllClients.js'),
        getAllDocuments: require('../routes/controllers/getAllDocuments.js')
    },
    // rosario: {
    //     name: "rosario", 
    //     clientModel: Clientrosario, 
    //     documentModel: Documentrosario, 
    //     getAllClients: require('../routes/controllers/getAllClientsRosario.js'),
    //     getAllDocuments: require('../routes/controllers/getAllDocumentsRosario.js')
    // },
    // uruguay: {
    //     name: "uruguay", 
    //     clientModel: Clienturuguay, 
    //     documentModel: Documenturuguay, 
    //     getAllClients: require('../routes/controllers/getAllClientsUruguay.js'),
    //     getAllDocuments: require('../routes/controllers/getAllDocumentsUruguay.js')
    // },
    // chile: {
    //     name: "chile", 
    //     clientModel: Clientchile, 
    //     documentModel: Documentchile, 
    //     getAllClients: require('../routes/controllers/getAllClientsChile.js'),
    //     getAllDocuments: require('../routes/controllers/getAllDocumentsChile.js')
    // },
    _sequelize: sequelize
}