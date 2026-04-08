document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  if (!carousel) return;

  const totalSlides = carousel.children.length;
  let index = 0;

  function updateSlide() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }
  function nextSlide() {
    index = (index + 1) % totalSlides;
    updateSlide();
  }
  function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    updateSlide();
  }
  function goToSlide(num) {
    index = (num + totalSlides) % totalSlides;
    updateSlide();
  }

  // Exponer al HTML (onclick="nextSlide()")
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  window.goToSlide = goToSlide;

  setInterval(nextSlide, 5000);
  updateSlide();
});
