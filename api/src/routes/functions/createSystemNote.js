const { Note } = require("../../bd");

const createSystemNote = async ({ clientId, userId, sucursal, detail }) => {
  return await Note.create({
    detail,
    typecontact: "Sistema",
    user: userId,
    sucursal,
    clientId,
  });
};

module.exports = createSystemNote;