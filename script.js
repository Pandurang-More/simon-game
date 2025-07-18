document.addEventListener("DOMContentLoaded", function () {
  let gameSeq = [];
  let userSeq = [];

  let btns = ["yellow", "red", "purple", "green"];
  let started = false;
  let level = 0;

  let h2 = document.querySelector("h2");

  document.addEventListener("keydown", function () {
    if (started == false) {
      console.log("Game is started");
      started = true;
      levelUP();
    }
  });

  function btnFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
      btn.classList.remove("flash");
    }, 250);
  }

  function levelUP() {
    level++;
    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    console.log(randIdx);
    console.log(randColor);
    console.log(randBtn);
    btnFlash(randBtn);
  }

  function btnPress() {
    console.log("Button Pressed");
  }

  let allBtns = document.querySelectorAll(".btn");
  for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
  }
});
