export async function sendRetenciones(data) {
  try {
    const response = await fetch(`http://${process.env.NEXT_PUBLIC_LOCALHOST}:3001/sendRetenciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al enviar retenciones:", error);
  }
}
