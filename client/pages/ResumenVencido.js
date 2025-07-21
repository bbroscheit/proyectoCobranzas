import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import { FacturacionContext } from "../pages/context/FacturacionContext";
import { formatNumber } from "../pages/functions/formatNumber";
import { sendMailResumenVencido } from "./api/sendMailResumenVencido";
import Modal from "react-modal";
import styles from "./modules/resumenVencido.module.css";

Modal.setAppElement("#__next"); // Necesario para accesibilidad

function ResumenVencido() {
  const router = useRouter();
  const { id } = router.query;
  const { facturas } = useContext(FacturacionContext);
  const [facturasVencidas, setFacturasVencidas] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: "mesadeayuda@basani.com.ar", // se deberia de cambiar por el mail del contacto
    subject: "Facturas Vencidas",
    messageHTMLUp: `<h3>Area Cobranzas</h3>
                    <h3>Estimado cliente:</h3>
                    <p>En <strong>BASANI S.A.</strong> trabajamos para ofrecerle el mejor servicio , y como parte de nuesrto compromiso, nos gustaría informarle sobre el estado de su cuenta.</p>
                    <p>Facturas vencidas y proximas a vencer</p>
                    <p>A continuacíon, detallamos las facturas pendientes de pago para su revisíon:</p>`,
    messageHTMLDown: `<h3>Opciones de Pago</h3>
                      <p>Para su comodidad, le ofrecemos varias opciones de pago:</p>
                      <ul>
                        <ol>Transferencia bancaria a cuenta [Numero de cuenta]</ol>
                        <ol>Otros métodos de pago (consultar con nuestro equipo de cobranzas)</ol>
                      </ul><br/>
                      <p>Le solicitamos gentilmente realizar el pago de las facturas vencidas para evitar posibles recargos adicionales o interrupciones en los servicios</p>
                      <p>Si ya ha realizado el pago o tiene algún inconveniente, no dude en contactarnos para informarlo o asistirlo. Puede comunicarse con nuestro equipo de cobranzas a [número de teléfono general] o responder este correo</p><br/>
                      <p>Agradecemos su atención y quedamos a su disposición para cualquier consulta</p>
                      <p>Atentamente,</p>
                      <p>[Nombre de la gestora]</p><br/>
                      <p>Equipo de cobranzas - BASANI SA</p>
                      `,
  });
  const [tableHTML, setTableHTML] = useState("");

  useEffect(() => {
    if (facturas && id) {
      const hoy = new Date();
      const facturasFiltradas = facturas.filter(
        (factura) =>
          factura.NumeroCliente.toString().trim() === id.toString().trim() &&
          factura.MontoPendiente > 0 &&
          new Date(factura.FechaVencimiento) < hoy
      );
      setFacturasVencidas(facturasFiltradas);

      // Crear la tabla en formato HTML
      const tableHTML = `
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Fecha</th>
              <th>Vencimiento</th>
              <th>Monto Pendiente</th>
            </tr>
          </thead>
          <tbody>
            ${facturasFiltradas
              .map((factura) => {
                const fechaVencimiento = new Date(factura.FechaVencimiento);
                const diasVencidos = Math.floor(
                  (new Date() - fechaVencimiento) / (1000 * 60 * 60 * 24)
                );
                return `
                <tr key=${factura.NumeroDocumento}>
                <td>${factura.NumeroDocumento}</td>
                  <td>${new Date(
                    factura.FechaDocumento
                  ).toLocaleDateString()}</td>
                  <td>${fechaVencimiento.toLocaleDateString()}</td>
                  <td>$ ${formatNumber(factura.MontoPendiente)}</td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
      `;
      setTableHTML(tableHTML);
    }
  }, [facturas, id]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();

    // Actualizar el mensaje del correo electrónico para incluir la tabla
    const updatedEmailData = {
      ...emailData,
      message: `${emailData.messageHTMLUp}<br/><br/>${tableHTML}<br/><br/>${emailData.messageHTMLDown}`,
    };
    sendMailResumenVencido(updatedEmailData);
  }

  return (
    <div className={styles.container}>
      <h1>Detalle de Documentos Vencidos</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Documento</th>
            <th>Monto Original</th>
            <th>Monto Pendiente</th>
            <th>Vencimiento</th>
            <th>Anticuación</th>
          </tr>
        </thead>
        <tbody>
          {facturasVencidas.map((factura) => {
            const fechaVencimiento = new Date(factura.FechaVencimiento);
            const diasVencidos = Math.floor(
              (new Date() - fechaVencimiento) / (1000 * 60 * 60 * 24)
            );
            return (
              <tr key={factura.NumeroDocumento}>
                <td>{new Date(factura.FechaDocumento).toLocaleDateString()}</td>
                <td>{factura.NumeroDocumento}</td>
                <td>$ {formatNumber(factura.MontoOriginal)}</td>
                <td>$ {formatNumber(factura.MontoPendiente)}</td>
                <td>{fechaVencimiento.toLocaleDateString()}</td>
                <td>{diasVencidos}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={openModal} className={styles.button}>
        Enviar Correo
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modelo de Correo"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
          <label>
            Para:
            <input
              type="email"
              name="to"
              value={emailData.to}
              onChange={handleChange}
            />
          </label>
          <label>
            Asunto:
            <input
              type="text"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
            />
          </label>
          <h3>Mensaje:</h3>
          <div
            dangerouslySetInnerHTML={{
              __html:
                emailData.messageHTMLUp +
                "<br/><br/>" +
                tableHTML +
                "<br/><br/>" +
                emailData.messageHTMLDown,
            }}
          />
          <button type="submit">Enviar</button>
          <button type="button" onClick={closeModal}>
            Cancelar
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default ResumenVencido;
