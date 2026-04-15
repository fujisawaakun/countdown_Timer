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

  //-----ボタン操作用の処理----------------------------------
  function setFromSeconds(totalSeconds) {
    const hh = Math.floor(totalSeconds / 3600);
    const mm = Math.floor((totalSeconds % 3600) / 60);
    const ss = totalSeconds % 60;

    hoursInput.value = String(hh).padStart(2, "0");
    minutesInput.value = String(mm).padStart(2, "0");
    secondsInput.value = String(ss).padStart(2, "0");
  }

  function changeTime(diff) {
    let total = getSeconds();
    total += diff;

    if (total < 0) {
      total = 0;
    }

    setFromSeconds(total);
    elapsedTime = total * 1000;

    timer.classList.remove("finish");
  }

  function setupHold(button, diff) {
    let holdIntervalId;

    const startHold = () => {
      changeTime(diff);

      holdIntervalId = setInterval(() => {
        changeTime(diff);
      }, 100);
    };

    const stopHold =  () => {
      clearInterval(holdIntervalId);
    };

    button.addEventListener('mousedown', startHold);
    button.addEventListener('mouseup', stopHold);
    button.addEventListener('mouseleave', stopHold);
    document.addEventListener('mouseup', stopHold);
  }

  //startボタンクリックイベント
  start.addEventListener("click", () => {
    start.disabled = true;
    stop.disabled = false;
    start.classList.add("clear");
    stop.classList.remove("clear");
    reset.classList.remove("clear");
    timer.classList.remove("finish");

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
    clearInterval(intervalId);

    intervalId = setInterval(() => {
      const timeout = endTime - Date.now();

      if (timeout <= 0) {
        clearInterval(intervalId);
        updateDisplay(0);
        elapsedTime = 0;
        start.disabled = false;
        stop.disabled = true;
        start.classList.remove("clear");
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

  //stopボタンクリックイベント
  stop.addEventListener("click", () => {
    clearInterval(intervalId);
    stop.disabled = true;
    start.disabled = false;
    start.classList.remove("clear");
    stop.classList.add("clear");
  });

  //resetボタンクリックイベント
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

  //タイマー表示ディスプレイのクリックイベント
  timer.addEventListener("click", () => {
    clearInterval(intervalId);
    elapsedTime = 0;
    start.disabled = false;
    stop.classList.add("clear");
    start.classList.remove("clear");
    timer.classList.remove("finish");
  });

  //▲▼ボタンクリックイベント関数呼び出し
  setupHold(secondsUp, 1);
  setupHold(secondsDown,-1);

  setupHold(minutesUp, 60);
  setupHold(minutesDown,-60);
  
  setupHold(hoursUp, 3600);
  setupHold(hoursDown,-3600);
}
