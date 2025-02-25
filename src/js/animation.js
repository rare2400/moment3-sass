//Function to start/stop animation
//Elements
const animationBtn = document.querySelector(".a-btn");
const aniContainer = document.querySelector(".golf-animation")

//Eventlistener
animationBtn.addEventListener("click", toggleAnimation);

//Function to start/stop animation
function toggleAnimation() {
    aniContainer.classList.toggle("animate");
}