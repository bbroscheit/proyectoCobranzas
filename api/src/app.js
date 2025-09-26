const express = require ('express');
const cookieParser = require('cookie-parser');
const bodyParser = require ('body-parser');
const morgan = require('morgan');
let cors = require('cors');
const cron = require('node-cron');
const fetchClientsFromCRM = require('./routes/functions/fetchClientsFromCRM.js');
const fetchDocumentFromGP = require('./routes/functions/fetchDocumentGP.js');
const seedUsuarios = require('./routes/functions/seedUsuarios.js');
const syncAllSources = require('./services/syncAllSources.js');
const creacionLista = require('./routes/functions/creacionLista.js');
require('./bd.js')
// require("./jobs/syncJob.js")

// se cargan las rutas
const promoterRouter = require ('../src/routes/promoterRouter.js');


// Incrementar límite de listeners para evitar warning
require('events').EventEmitter.defaultMaxListeners = 20;

// fetchClientsFromCRM().then(() => {
//     console.log('Clientes iniciales cargados desde CRM');
// }).catch((err) => {
//     console.error('Error al cargar clientes iniciales desde CRM:', err);
// });

// fetchDocumentFromGP().then(() => {
//     console.log('Documentos iniciales cargados desde GP');
// }).catch((err) => {
//     console.error('Error al cargar documentos iniciales desde GP:', err);
// });

// Carga inicial de usuarios
//seedUsuarios();

// syncAllSources().then(() => {
//     console.log('Documentos iniciales cargados desde GP');
// }).catch((err) => {
//     console.error('Error al cargar documentos iniciales desde GP:', err);
// });

const server = express();
server.name = 'API';


server.use(bodyParser.urlencoded({ extended:true, limit: '50mb'}));
server.use(bodyParser.json({limit: '50mb'}));
server.use(cookieParser());
server.use(morgan('dev'))
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Cache-Control', 'no-store');
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);

    if (req.method === 'OPTIONS') {
        console.log('Respondiendo a solicitud OPTIONS');
        res.sendStatus(200);
    } else {
        next();
    }
});

server.use(express.json());
server.use(cors());

// llamamos a los diferentes Routers
server.use('/' , promoterRouter);


server.use((err,req,res) => {
    const status = err.status || 500;
    const message = err.message || err;
    console.log(err);
    res.status (status).send(message)
})

// --------------------
// Cron jobs en async
// --------------------

// Todos los días a las 3 AM trae clientes de CRM
cron.schedule('0 3 * * *', async () => {
    try {
        await fetchClientsFromCRM();
        console.log('Clientes CRM actualizados');
    } catch (err) {
        console.error('Error actualizando clientes CRM:', err);
    }
});

// Todos los días a las 5 AM trae documentos de Dynamics
cron.schedule('0 5 * * *', async () => {
    try {
        await fetchDocumentFromGP();
        console.log('Documentos GP actualizados');
    } catch (err) {
        console.error('Error actualizando documentos GP:', err);
    }
});

// Todos los días a las 7 AM crea las listas de llamadas
cron.schedule('0 7 * * *', async () => {
    try {
        await creacionLista();
        console.log('Lista de llamadas creada correctamente');
    } catch (err) {
        console.error('Error creando lista de llamadas:', err);
    }
});

// Ejecutar creacionLista manualmente al iniciar el server (opcional)
// (async () => {
//     try {
//         await creacionLista();
//         console.log('Lista de llamadas inicial creada al iniciar server');
//     } catch (err) {
//         console.error('Error creando lista de llamadas inicial:', err);
//     }
// })();  

module.exports = server;