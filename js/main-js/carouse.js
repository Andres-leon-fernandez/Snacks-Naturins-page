const carousel = document.getElementById("carousel");
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

setInterval(nextSlide, 5000);
