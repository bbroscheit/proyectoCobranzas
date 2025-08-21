require('dotenv').config();

const server = require('./src/app.js');
//const server = require('./src/appsHttps.js')
const { conn } = require ('./src/bd.js');
const { PORT } = process.env;

conn.sync({force:false, alter: true}) //cambiar a true para que altere la base de datos
    .then(() => {
        server.listen( PORT, () => {
            console.log(`Listening on port ${PORT}, server connected`)
        })
    })
