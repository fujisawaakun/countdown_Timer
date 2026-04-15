"use strict";
{
  const timer = document.getElementById("timer");
  const start = document.getElementById("start");
  const stop = document.getElementById("stop");
  const reset = document.getElementById("reset");

  stop.classList.add("clear");

  const audio = new Audio("Cuckoo_Clock01-02(Denoise-Mid).mp3");

  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");

  const hoursUp = document.getElementById("hours-up");
  const hoursDown = document.getElementById("hours-down");
  const minutesUp = document.getElementById("minutes-up");
  const minutesDown = document.getElementById("minutes-down");
  const secondsUp = document.getElementById("seconds-up");
  const secondsDown = document.getElementById("seconds-down");

  let intervalId;
  let elapsedTime = 0;
  let initialTime = 0;

  function getTotalTime() {
    const h = Number(hoursInput.value) || 0;
    const m = Number(minutesInput.value) || 0;
    const s = Number(secondsInput.value) || 0;

    return (h * 3600 + m * 60 + s) * 1000;
  }

  function getSeconds() {
    return Math.floor(getTotalTime() / 1000);
  }

  //-----ボタン操作用の処理----------------------------------
  function getFromSeconds(totalSeconds) {
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;

    hoursInput.value = String(hh).padStart(2, "0");
    minutesInput.value = String(mm).padStart(2, "0");
    secondsInput.value = String(ss).padStart(2, "0");
  }

  //-----タイマー表示用の処理----------------------------------
  function updateDisplay(ms) {
    const totalSec = Math.floor(ms / 1000);
    const hh = Math.floor(totalSec / 3600);
    const mm = Math.floor((totalSec % 3600) / 60);
    const ss = Math.floor(totalSec % 60);

    hoursInput.value = String(hh).padStart(2, "0");
    minutesInput.value = String(mm).padStart(2, "0");
    secondsInput.value = String(ss).padStart(2, "0");
  }

  //--------------------------------------------------------------・一旦ここまで

  start.addEventListener("click", () => {
    start.disabled = true;
    stop.disabled = false;
    start.classList.add("clear");
    stop.classList.remove("clear");
    reset.classList.remove("clear");

    if (elapsedTime === 0) {
      initialTime = getTotalTime();
      if (initialTime <= 0) {
        start.disabled = false;
        stop.disabled = true;
        start.classList.remove("clear");
        stop.classList.add("clear");
        return;
      }
      elapsedTime = initialTime;
    } 

    const endTime = Date.now() + elapsedTime;

    intervalId = setInterval(() => {
      const timeout = endTime - Date.now();

      if (timeout <= 0) {
        clearInterval(intervalId);
        updateDisplay(0);
        elapsedTime = 0;
        start.disabled = true;
        stop.disabled = true;
        stop.classList.add("clear");
        timer.classList.add("finish");
        audio.currentTime = 0;
        audio.play();
        return;
      }

      elapsedTime = timeout;
      updateDisplay(timeout);
    }, 100);
  });

  stop.addEventListener("click", () => {
    clearInterval(intervalId);
    stop.disabled = true;
    start.disabled = false;
    start.classList.remove("clear");
    stop.classList.add("clear");
  });

  reset.addEventListener("click", () => {
    clearInterval(intervalId);
    elapsedTime = 0;
    updateDisplay(initialTime);
    audio.pause();
    audio.currentTime = 0;
    start.disabled = false;
    stop.classList.add("clear");
    start.classList.remove("clear");
    timer.classList.remove("finish");
  });

  timer.addEventListener("click", () => {
    clearInterval(intervalId);
    elapsedTime = 0;
    start.disabled = false;
    stop.classList.add("clear");
    start.classList.remove("clear");
    timer.classList.remove("finish");
  });
}

//・stop中に数値の変更
