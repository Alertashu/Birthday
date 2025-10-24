//jshint esversion:6

const button = document.querySelector(".btn"),
  darkroom = document.querySelector(".darkroom"),
  giftroom = document.querySelector(".giftroom"),
  hallway = document.querySelector(".hallway"),
  room = document.querySelector(".empty-room"),
  flash = document.querySelector(".flash");

const blackText = document.querySelectorAll(".bb-text"),
  giftText = document.querySelectorAll(".gift-text"),
  hallText = document.querySelectorAll(".hall-text"),
  roomText = document.querySelectorAll(".room-text"),
  CTAtext = document.querySelector(".btn-ref");

const frames = document.querySelectorAll(".frame"),
  msgWindow = document.querySelector(".scroll"),
  msg = document.querySelector(".text");

const light = document.querySelector(".switch-aud"),
  blast = document.querySelector(".blast-aud"),
  door = document.querySelector(".door-aud"),
  haunt = document.querySelector(".haunt-aud"),
  music = document.querySelector(".hbd-aud");

const readMsg = (text) => {
  for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
      text[i].classList.add("read");
      if (i === text.length - 1) {
        button.style.display = "inline-block";
        CTAtext.style.display = "block";
      }
    }, 5000 * i);
  }
};

const transition = (currentScene) => {
  currentScene.classList.add("fade-in");
  currentScene.style.opacity = "0";
  button.style.display = "none";
  CTAtext.style.display = "none";
};

export const animate = function () {
  CTAtext.innerHTML = "Click the Light Bulb.";
  readMsg(blackText);

  button.addEventListener("click", function () {
    if (button.classList.contains("switch")) {
      light.play();
      transition(darkroom);
      CTAtext.innerHTML = "Click the Door";
      setTimeout(function () {
        button.classList.add("door-out");
        button.classList.remove("switch");
        darkroom.style.display = "none";
        readMsg(roomText);
      }, 4000);
    } else if (button.classList.contains("door-out")) {
      door.play();
      transition(room);
      setTimeout(function () {
        haunt.play();
        haunt.loop = true;
        button.classList.add("door-in");
        button.classList.remove("door-out");
        room.style.display = "none";
        readMsg(hallText);
      }, 4000);
    } else if (button.classList.contains("door-in")) {
      door.play();
      transition(hallway);
      CTAtext.innerHTML = "Click the Gift";
      setTimeout(function () {
        button.classList.add("gift");
        button.classList.remove("door-in");
        hallway.style.display = "none";
        readMsg(giftText);
      }, 4000);
    } else if (button.classList.contains("gift")) {
      haunt.pause();
      blast.play();
      giftroom.style.display = "none";
      transition(flash);

      music.loop = true;
      music.play();

      // Check if message text exists and has content
      const hasScrollMessage = msg && msg.textContent.trim().length > 0;

      if (!hasScrollMessage) {
        // No scroll message - show card directly and quickly
        setTimeout(() => {
          flash.style.display = "none";
          frames[0].style.display = "flex";
          setTimeout(() => {
            frames[0].classList.add("appear");
            frames[0].style.opacity = "1";
          }, 100);
        }, 1500); // Show card after 1.5 seconds
        return;
      }

      // Has scroll message - show it first, then card
      // Get read time from CSS (default 17s based on your HTML)
      const readTime = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--readTime")
      ) || 17;

      // Show scroll frame immediately after flash
      setTimeout(() => {
        flash.style.display = "none";
        frames[1].style.display = "flex";
        
        setTimeout(() => {
          frames[1].classList.add("appear");
          frames[1].style.opacity = "1";
          msg.style.opacity = "1";
          msg.classList.add("move-up");
        }, 100);

        // Start scrolling the message
        setTimeout(() => {
          msg.style.transform = "translateY(-100%)";
        }, 500);
      }, 1000);

      // After message finishes scrolling, fade it out
      setTimeout(() => {
        msgWindow.classList.add("fade-in");
        msgWindow.style.opacity = "0";
      }, (readTime + 2) * 1000); // Changed from readTime * 300 to proper timing

      // Show birthday card
      setTimeout(() => {
        frames[1].style.display = "none";
        frames[0].style.display = "flex";
        
        setTimeout(() => {
          frames[0].classList.add("appear");
          frames[0].style.opacity = "1";
        }, 100);
      }, (readTime + 4) * 1000); // Card appears 2 seconds after message fades
    }
  });
};