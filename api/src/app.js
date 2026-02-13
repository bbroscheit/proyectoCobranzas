const express = require ('express');
const cookieParser = require('cookie-parser');
const bodyParser = require ('body-parser');
const morgan = require('morgan');
let cors = require('cors');
const seedUsuarios = require('./routes/functions/seedUsuarios.js');
require('./bd.js')

// se cargan las rutas
const promoterRouter = require ('../src/routes/promoterRouter.js');


// Incrementar límite de listeners para evitar warning
require('events').EventEmitter.defaultMaxListeners = 20;

// Carga inicial de usuarios
// seedUsuarios();

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

if (process.env.RUN_JOBS === "true") {
  require("./jobs/masterJob");
  //require("./jobs/mailWorker");
}

module.exports = server; 