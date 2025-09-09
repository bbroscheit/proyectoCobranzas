require('dotenv').config();

const { Sequelize, Op } = require ( 'sequelize');
const fs = require ( 'fs' );
const path = require ( 'path' );
const { DB_HOST, DB_PASSWORD, DB_USER, DB_PORT} = process.env

console.log(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/cobranzas`)
const sequelize = new Sequelize(`postgres://${DB_HOST}:${DB_PASSWORD}@${DB_USER}:${DB_PORT}/cobranzas` , {
    logging : false,
    native: false,
    timezone: '-03:00'
});

const basename = path.basename ( __filename);
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners

fs.readdirSync( path.join(__dirname, '/models'))
    .filter((file) => (file.indexOf('.') !== 0 ) && ( file !== basename ) && (file.slice(-3) === '.js'))
    .forEach((file) => {modelDefiners.push(require(path.join(__dirname, '/models', file)))
    })

// Injectamos la conexion (sequelize) a todos los modelos

modelDefiners.forEach( model => model(sequelize));

// Capitalizamos los nombres de los modelos ie: user => User

let entries = Object.entries(sequelize.models);
let capEntries = entries.map((entry) => [entry [0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capEntries);

// En sequelize.models están todos los modelos importados como propiedades para relacionarlos hacemos un destructuring

const { 
        Client, 
        Clientrosario,
        Clienturuguay,
        Clientchile,
        Clientecopatagonico,
        Clientecobahia,
        Clientcordoba,
        Note,
        Alarma,
        Tarea,
        Document,
        Documentrosario,
        Documenturuguay,
        Documentchile,
        Documentecopatagonico,
        Documentecobahia,
        Documentcordoba,
        Listadellamada,
        Gestion,
        Usuario
         } = sequelize.models;

// Relacionamos las tablas

Client.hasMany(Note, { foreignKey: 'clientId', as: 'notes' });
Note.belongsTo(Client, { foreignKey: 'clientId', as: 'clientnote' });

Client.hasMany(Alarma, { foreignKey: 'clientId', as: 'alarma' });
Alarma.belongsTo(Client, { foreignKey: 'clientId', as: 'clientalarma' });

Client.hasMany(Document, { foreignKey: 'clientId', as: 'documento' });
Document.belongsTo(Client, { foreignKey: 'clientId', as: 'clientdocumento' });

Clientrosario.hasMany(Documentrosario, { foreignKey: 'clientId', as: 'documentorosario' });
Documentrosario.belongsTo(Clientrosario, { foreignKey: 'clientId', as: 'clientdocumentorosario' });

Clienturuguay.hasMany(Documenturuguay, { foreignKey: 'clientId', as: 'documentouruguay' });
Documenturuguay.belongsTo(Clienturuguay, { foreignKey: 'clientId', as: 'clientdocumentouruguay' });

Clientchile.hasMany(Documentchile, { foreignKey: 'clientId', as: 'documentochile' });
Documentchile.belongsTo(Clientchile, { foreignKey: 'clientId', as: 'clientdocumentochile' });

// Clientecopatagonico.hasMany(Documentecopatagonico, { foreignKey: 'clientId', as: 'documento' });
// Documentecopatagonico.belongsTo(Clientecopatagonico, { foreignKey: 'clientId', as: 'clientdocumento' });

// Clientecobahia.hasMany(Documentecobahia, { foreignKey: 'clientId', as: 'documento' });
// Documentecobahia.belongsTo(Clientecobahia, { foreignKey: 'clientId', as: 'clientdocumento' });

// Clientcordoba.hasMany(Documentcordoba, { foreignKey: 'clientId', as: 'documento' });
// Documentcordoba.belongsTo(Clientcordoba, { foreignKey: 'clientId', as: 'clientdocumento' });

Usuario.hasMany(Listadellamada, { foreignKey: "usuarioId", as: "agendas" });
Listadellamada.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuarioagenda" });

Usuario.hasMany(Gestion, { foreignKey: "usuarioId", as: "gestion" });
Gestion.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuariogestion" });
  
// Autenticamos y conectamos

sequelize.authenticate()
    .then(() => console.log('Database Connected'))
    .catch( err => console.log(err))

// exportamos los modelos y la conexion de Sequelize

module.exports = {
    ...sequelize.models,
    sequelize,
    conn: sequelize,
    Op
}