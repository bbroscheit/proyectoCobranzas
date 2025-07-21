const promoterRouter = require("express").Router()
const getAllDocuments = require('./controllers/getAllDocuments.js')
const getClientsByGestor = require('./controllers/getClientsByGestor.js')
const getAllDocumentsByPromoter = require('./controllers/getAllDocumentsByPromoter.js')
const getClientByPromoter = require("./controllers/getClientByPromoter.js")
const getFacturasByPromoter = require("./controllers/getFacturasByPromoter.js")
const getRecibosByPromoter = require("./controllers/getRecibosByPromoter.js")
const getClientsAccount = require("./controllers/getClientsAccount.js")
const sendMailResumenVencido = require("./helpers/sendMailResumenVencido.js")
const getClientName = require("./controllers/getClientName.js")
const getAllClients = require("./controllers/getAllClients.js")
const getAllAlarms = require("./controllers/getAllAlarms.js")
const getAllNotes = require("./controllers/getAllNotes.js")
const getAllNotesInMonth = require("./controllers/getAllNotesInMonth.js")
const getAllAlarmsInMonth = require("./controllers/getAllAlarmsInMonth.js")
const postAlarm = require("./controllers/postAlarm.js")
const postNote = require("./controllers/postNote.js")

promoterRouter.get("/clientByPromoter", async ( req, res ) => {
    try {
        let clientByPromoter = await getClientByPromoter()
        clientByPromoter ? res.status(200).json(clientByPromoter) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta getClientByPromoter", e.message )
    }
})

promoterRouter.get("/allDocuments", async ( req, res ) => {
    try {
        let results = await getAllDocuments()
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta allDocuments", e.message )
    }
})

promoterRouter.get("/allClients", async ( req, res ) => {
    try {
        let results = await getAllClients()
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta allDocuments", e.message )
    }
})

promoterRouter.get("/allAlarms", async ( req, res ) => {
    try {
        let results = await getAllAlarms()
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta allAlarms", e.message )
    }
})

promoterRouter.get("/allNotes", async ( req, res ) => {
    try {
        let results = await getAllNotes()
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta allNotes", e.message )
    }
})

promoterRouter.get("/allNotesInMonth", async ( req, res ) => {
    let gestor = "Belen Soria"

    try {
        let results = await getAllNotesInMonth(gestor)
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta allNotes", e.message )
    }
})

promoterRouter.get("/allAlarmsInMonth", async ( req, res ) => {
    let gestor = "Belen Soria"

    try {
        let results = await getAllAlarmsInMonth(gestor)
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta allNotes", e.message )
    }
})

promoterRouter.get("/clientsByGestor", async (req, res) => {
    const { gestor } = req.query;
    try {
      const clients = await getClientsByGestor(gestor)
      clients ? res.status(200).json(clients) : res.status(400).json({ state: "failure" });
    } catch (e) {
      res.status(500).json({ state: "error", message: e.message });
    }
  });

promoterRouter.get("/allDocumentsByPromoter", async ( req, res ) => {
    try {
        let clientByPromoter = await getClientByPromoter()
        let results = await getAllDocumentsByPromoter(clientByPromoter)
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta allDocuments", e.message )
    }
})

promoterRouter.get("/clientsAccount", async ( req, res ) => {
    try {
        let results = await getClientsAccount()
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta clientsAccount", e.message )
    }
})

promoterRouter.get("/recibosByPromoter", async ( req, res ) => {
    try {
        let recibos = await getClientByPromoter()
        let results = await getRecibosByPromoter(recibos)
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta recibosByPromoter", e.message )
    }
})

promoterRouter.get("/facturasByPromoter", async ( req, res ) => {
    try {
        let clientes = await getClientByPromoter()
        let results = await getFacturasByPromoter(clientes)
        results ? res.status(200).json(results) : res.status(400).json( { state:"failure" } )
    } catch (e) {
        console.log( "error en ruta facturasByPromoter", e.message )
    }
})

promoterRouter.get("/clientName", async (req, res) => {
    const { clienteId } = req.query
    //console.log(req)
    try {
      let results = await getClientName(clienteId)
      results ? res.status(200).json(results) : res.status(400).json({ state: "failure" })
    } catch (e) {
      console.log("error en ruta getClientName", e.message)
      res.status(500).json({ error: e.message })
    }
  })

promoterRouter.post("/newAlarm", async ( req, res ) => {
    const { texto, fecha, hora, numeroCliente, user } = req.body
    
    if (!texto || !fecha || !hora || !numeroCliente || !user) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    try {
        let results = await postAlarm(texto, fecha, hora, numeroCliente, user);
        
        results && results !== "Cliente no encontrado" ? 
            res.status(201).json({ state: "success" }) :
            results && results === "Cliente no encontrado" ? 
                res.status(400).json({ state: "Cliente no encontrado" }):
                res.status(400).json({ state: "failure" });
    } catch (error) {
        console.error("Error al crear la alarma:", error);
        res.status(500).json({ error: "Error al crear la alarma" });
    } 
})

promoterRouter.post("/newNote", async ( req, res ) => {
    const { nota, comunicacion , numeroCliente, user } = req.body
    
    if (!nota || !comunicacion || !numeroCliente || !user) {
        return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    try {
        let results = await postNote(nota, comunicacion , numeroCliente, user);
        
        results && results !== "Cliente no encontrado" ? 
            res.status(201).json({ state: "success" }) :
            results && results === "Cliente no encontrado" ? 
                res.status(400).json({ state: "Cliente no encontrado" }):
                res.status(400).json({ state: "failure" });
    } catch (error) {
        console.error("Error al crear la nota:", error);
        res.status(500).json({ error: "Error al crear la nota" });
    } 
})

promoterRouter.post("/mailResumenVencido", async ( req, res ) => {
    
    const to = req.body.to
    const subject = req.body.subject
    const message = req.body.message

    //console.log("soy la data del email",emailData)
    
        try {
            await sendMailResumenVencido( to, subject, message );
            
            
        } catch (e) {
            console.log(e.message)
        }
    
        res.send('Emails enviados exitosamente');    
})



module.exports = promoterRouter