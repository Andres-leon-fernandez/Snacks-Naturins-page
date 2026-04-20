document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");

  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    alert("Mensaje enviado correctamente ✅");

    form.reset();
  });
});