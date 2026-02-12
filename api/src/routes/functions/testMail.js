const FormData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.API_KEY,
  url: "https://api.mailgun.net", // o https://api.eu.mailgun.net si estás en EU
});

async function testMail() {
  try {
    const result = await mg.messages.create("basani.com.ar", {
      from: "Carlos Broscheit <bernardo.broscheit@basani.com.ar>",
      to: "bernardo.broscheit@gmail.com",
      subject: "Test directo desde dominio basani.com.ar",
      text: "Hola! Este es un correo de prueba desde basani.com.ar usando Mailgun.",
    });
    console.log("✅ Enviado correctamente:", result.id);
  } catch (error) {
    console.error("❌ Error:", error.message, error.status, error.details);
  }
}

testMail();