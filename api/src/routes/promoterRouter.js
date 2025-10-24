const promoterRouter = require("express").Router();
const getAllDocuments = require("./controllers/getAllDocuments.js");
const getClientsByGestor = require("./controllers/getClientsByGestor.js");
const getAllDocumentsBySalepoint = require("./controllers/getAllDocumentsBySalepoint.js");
const getAllDocumentsByPromoter = require("./controllers/getAllDocumentsByPromoter.js");
const getAllDocumentsByGestor = require("./controllers/getAllDocumentByGestor.js");
const getAllDocumentsByClient = require("./controllers/getAllDocumentsByClient.js");
const getClientByPromoter = require("./controllers/getClientByPromoter.js");
const getFacturasByPromoter = require("./controllers/getFacturasByPromoter.js");
const getRecibosByPromoter = require("./controllers/getRecibosByPromoter.js");
const getClientsAccount = require("./controllers/getClientsAccount.js");
const sendMailResumenVencido = require("./helpers/sendMailResumenVencido.js");
const getClientName = require("./controllers/getClientName.js");
const getAllClients = require("./controllers/getAllClients.js");
const getAllAlarms = require("./controllers/getAllAlarms.js");
const getAllNotes = require("./controllers/getAllNotes.js");
const getAllNotesInMonth = require("./controllers/getAllNotesInMonth.js");
const getAllAlarmsInMonth = require("./controllers/getAllAlarmsInMonth.js");
const postAlarm = require("./controllers/postAlarm.js");
const postNote = require("./controllers/postNote.js");
const loginUser = require("./controllers/loginUser.js");
const getListaDeLlamadas = require("./controllers/getListaDeLlamadas.js");
const getGestionesByGestor = require("./controllers/getGestionesByGestor.js")
const postNewAvisos = require("./controllers/postNewAvisos.js")


promoterRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    let login = await loginUser(username, password);
    login
      ? res.status(200).json(login)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta post user ", e.message);
  }
});

promoterRouter.get("/clientByPromoter", async (req, res) => {
  try {
    let clientByPromoter = await getClientByPromoter();
    clientByPromoter
      ? res.status(200).json(clientByPromoter)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta getClientByPromoter", e.message);
  }
});

promoterRouter.get("/lista-llamadas", async (req, res) => {
  const { usuarioId } = req.query;

  if (!usuarioId) {
    return res.status(400).json({ error: "Falta usuarioId" });
  }

  try {
    let listaDeLlamadas = await getListaDeLlamadas(usuarioId);
    //console.log("listaDeLlamadas en ruta:", listaDeLlamadas);
    listaDeLlamadas
      ? res.status(200).json(listaDeLlamadas)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta getListaDeLlamadas", e.message);
  }
});

promoterRouter.get("/allDocuments", async (req, res) => {
  try {
    let results = await getAllDocuments();
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta allDocuments", e.message);
  }
});

promoterRouter.get("/allClients", async (req, res) => {
  try {
    let results = await getAllClients();
    //console.log("soy los clientes", results)
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta allDocuments", e.message);
  }
});

promoterRouter.get("/allAlarms", async (req, res) => {
  try {
    let results = await getAllAlarms();
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta allAlarms", e.message);
  }
});

promoterRouter.get("/allNotes", async (req, res) => {
  try {
    let results = await getAllNotes();
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta allNotes", e.message);
  }
});

promoterRouter.get("/allNotesInMonth", async (req, res) => {
  let gestor = "Belen Soria";

  try {
    let results = await getAllNotesInMonth(gestor);
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta allNotes", e.message);
  }
});

promoterRouter.get("/allAlarmsInMonth", async (req, res) => {
  let gestor = "Belen Soria";

  try {
    let results = await getAllAlarmsInMonth(gestor);
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta allNotes", e.message);
  }
});

promoterRouter.get("/clientsByGestor", async (req, res) => {
  const { gestor } = req.query;
  try {
    const clients = await getClientsByGestor(gestor);
    clients
      ? res.status(200).json(clients)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    res.status(500).json({ state: "error", message: e.message });
  }
});

promoterRouter.get("/gestionesByGestor/:gestor", async (req, res) => {
  const { gestor } = req.params;

  console.log("gestor en ruta ", gestor)
  
  try {
    const gestiones = await getGestionesByGestor(gestor);
    gestiones
      ? res.status(200).json(gestiones)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    res.status(500).json({ state: "error", message: e.message });
  }
});

promoterRouter.get("/getAllDocumentsBySalepoint/:gestor", async (req, res) => {
  const { gestor } = req.params;

  try {
    const documentsBySalepoint = await getAllDocumentsBySalepoint(gestor);
    
    documentsBySalepoint
      ? res.status(200).json(documentsBySalepoint)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    res.status(500).json({ state: "error", message: e.message });
  }
});

promoterRouter.get("/getAllDocumentsByGestor/:gestor", async (req, res) => {
  const { gestor } = req.params;

  try {
    const documentsByGestor = await getAllDocumentsByGestor(gestor);
    
    documentsByGestor
      ? res.status(200).json(documentsByGestor)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    res.status(500).json({ state: "error", message: e.message });
  }
});

promoterRouter.get("/getAllDocumentsByClient", async (req, res) => {
  const { userId , clienteId } = req.query;

  try {
    const documentsByClient = await getAllDocumentsByClient(userId, clienteId);
    
    documentsByClient
      ? res.status(200).json(documentsByClient)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    res.status(500).json({ state: "error", message: e.message });
  }
});

promoterRouter.get("/allDocumentsByPromoter", async (req, res) => {
  try {
    let clientByPromoter = await getClientByPromoter();
    let results = await getAllDocumentsByPromoter(clientByPromoter);
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta allDocuments", e.message);
  }
});

promoterRouter.get("/clientsAccount", async (req, res) => {
  try {
    let results = await getClientsAccount();
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta clientsAccount", e.message);
  }
});

promoterRouter.get("/recibosByPromoter", async (req, res) => {
  try {
    let recibos = await getClientByPromoter();
    let results = await getRecibosByPromoter(recibos);
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta recibosByPromoter", e.message);
  }
});

promoterRouter.get("/facturasByPromoter", async (req, res) => {
  try {
    let clientes = await getClientByPromoter();
    let results = await getFacturasByPromoter(clientes);
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta facturasByPromoter", e.message);
  }
});

promoterRouter.get("/clientName", async (req, res) => {
  const { userId , clienteId } = req.query;
  
  try {
    let results = await getClientName( userId, clienteId);
    results
      ? res.status(200).json(results)
      : res.status(400).json({ state: "failure" });
  } catch (e) {
    console.log("error en ruta getClientName", e.message);
    res.status(500).json({ error: e.message });
  }
});

promoterRouter.post("/newAlarm", async (req, res) => {
  const { texto, fecha, hora, numeroCliente, user } = req.body;

  if (!texto || !fecha || !hora || !numeroCliente || !user) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  try {
    let results = await postAlarm(texto, fecha, hora, numeroCliente, user);

    results && results !== "Cliente no encontrado"
      ? res.status(201).json({ state: "success" })
      : results && results === "Cliente no encontrado"
      ? res.status(400).json({ state: "Cliente no encontrado" })
      : res.status(400).json({ state: "failure" });
  } catch (error) {
    console.error("Error al crear la alarma:", error);
    res.status(500).json({ error: "Error al crear la alarma" });
  }
});

promoterRouter.post("/newNote", async (req, res) => {
  const { nota, comunicacion, numeroCliente, user } = req.body;

  if (!nota || !comunicacion || !numeroCliente || !user) {
    return res.status(400).json({ error: "Faltan datos en la solicitud" });
  }

  try {
    let results = await postNote(nota, comunicacion, numeroCliente, user);

    results && results !== "Cliente no encontrado"
      ? res.status(201).json({ state: "success" })
      : results && results === "Cliente no encontrado"
      ? res.status(400).json({ state: "Cliente no encontrado" })
      : res.status(400).json({ state: "failure" });
  } catch (error) {
    console.error("Error al crear la nota:", error);
    res.status(500).json({ error: "Error al crear la nota" });
  }
});

promoterRouter.post("/newAvisos", async (req, res) => {
  const {
    nota,
    comunicacion,
    emailText,
    cuentaCorriente,
    reprogram,
    numeroCliente,
    user,
  } = req.body;
  
  try {
    let results = await postNewAvisos(
      nota,
      comunicacion,
      emailText,
      cuentaCorriente,
      reprogram,
      numeroCliente,
      user
    )
    
    results && results !== "Cliente no encontrado"
      ? res.status(201).json({ state: "success" })
      : res.status(400).json({ state: "failure" });
  } catch (error) {
    console.log("Error en /newAvisos : ", error);
    res.status(500).json({ error: "Error al crear la nota" });
  }
});

promoterRouter.post("/mailResumenVencido", async (req, res) => {
  const to = req.body.to;
  const subject = req.body.subject;
  const message = req.body.message;

  //console.log("soy la data del email",emailData)

  try {
    await sendMailResumenVencido(to, subject, message);
  } catch (e) {
    console.log(e.message);
  }

  res.send("Emails enviados exitosamente");
});

module.exports = promoterRouter;
