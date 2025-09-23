require("dotenv").config();
const { Usuario } = require('../../bd');
const getClientesPorUsuario = require("./creacionListaLLamadas/getClientesPorUsuario");
const getDocumentosPorClientes = require("./creacionListaLLamadas/getDocumentsPorCliente");
const crearListaDeLlamadas = require("./creacionListaLLamadas/creaListaDeLlamadas");
const prellenarClientesHoy = require("./creacionListaLLamadas/prellenarlista");
const agregarClientesNuevosConDeuda = require("./creacionListaLLamadas/agregarClientesNuevosConDeuda");
const agregarClientesConDeuda = require("./creacionListaLLamadas/agregarClientesConDeuda");
const limpiarClientesSinDeuda = require("./creacionListaLLamadas/limpiarClientesSinDeuda");
const crearGestionDelDia = require ("../functions/crearGestionDelDia")


const creacionLista = async () => {

    let usuarios = []
    try {
        usuarios = await Usuario.findAll();
    } catch (error) {
        console.error("❌ Error al cargar usuarios:", error);
    }

    let resultado = [];
    for (const usuario of usuarios) {
        const datosClientes = await getClientesPorUsuario(usuario);

        const datosConDocumentos = await getDocumentosPorClientes(datosClientes);
        resultado.push(datosConDocumentos);

        //creamos la lista de llamadas
        const listadoHoy = await crearListaDeLlamadas(usuario, datosConDocumentos.clientes);

        //llenamos la lista con los clientes que no fueron llamados ayer
        await prellenarClientesHoy(usuario, listadoHoy);

        //cargamos los clientes nuevos, que tengan deuda y tengan el mismo gestor
        await agregarClientesNuevosConDeuda(usuario, listadoHoy); //probe distintos clientes pero ninguno cumple con la condicion de "nuevo"

        //buscamos si hay clientes con deuda que no esten en la lista, ni en listas posteriores y los agregamos
        await agregarClientesConDeuda(usuario, listadoHoy, datosConDocumentos);

        //repasamos la lista y limpiamos los clientes que ya no tienen deuda
        await limpiarClientesSinDeuda(listadoHoy, datosConDocumentos);

        //creamos la gestion del dia
        await crearGestionDelDia(usuario, listadoHoy);
    }
   
}

module.exports = creacionLista;