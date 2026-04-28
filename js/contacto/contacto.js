document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-contacto");
  const respuesta = document.getElementById("form-respuesta");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // Validación
    for (let value of data.values()) {
      if (!value.trim()) {
        respuesta.textContent = "Por favor completa todos los campos.";
        respuesta.style.color = "red";
        return;
      }
    }

    try {
      const resp = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (resp.ok) {
        respuesta.textContent = "✅ Mensaje enviado correctamente";
        respuesta.style.color = "#98C01E";
        form.reset();
      } else {
        respuesta.textContent = "⚠️ Error al enviar el mensaje";
        respuesta.style.color = "red";
      }

    } catch (error) {
      respuesta.textContent = "❌ Error de conexión";
      respuesta.style.color = "red";
    }
  });
});