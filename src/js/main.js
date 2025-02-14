"use strict";


//function for opening/closing nav-menu
//elements
let openBtn = document.getElementById("open-menu");
let closeBtn = document.getElementById("close-menu");


//eventlisteners
openBtn.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);


function toggleMenu() {
   let navMenuEl = document.getElementById("nav-menu");


   let style = window.getComputedStyle(navMenuEl)


   if (style.display === "none") {
       navMenuEl.style.display = "block";
   } else {
       navMenuEl.style.display = "none";
   }
}

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