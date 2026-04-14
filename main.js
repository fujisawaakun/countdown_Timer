"use strict";
{
  const timer = document.getElementById("timer");
  const start = document.getElementById("start");
  const stop = document.getElementById("stop");
  stop.classList.add("clear");
  const reset = document.getElementById("reset");

  const audio = new Audio("Cuckoo_Clock01-02(Denoise-Mid).mp3");

  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");

  let intervalId;
  let endTime;
  let timeout;
  let elapsedTime = 0;
  let initialTime = 0;

  function getTotalTime() {
    let h = Number(hoursInput.value) || 0;
    let m = Number(minutesInput.value) || 0;
    let s = Number(secondsInput.value) || 0;

    return (h * 3600 + m * 60 + s) * 1000;
  }

  function updateDisplay(timeout) {
    const totalSec = Math.floor(timeout / 1000);
    const hh = Math.floor(totalSec / 3600);
    const mm = Math.floor((totalSec % 3600) / 60);
    const ss = Math.floor(totalSec % 60);

    hoursInput.value = String(hh).padStart(2, "0");
    minutesInput.value = String(mm).padStart(2, "0");
    secondsInput.value = String(ss).padStart(2, "0");
  }

  start.addEventListener("click", () => {
    start.disabled = true; //ボタン押せなくする
    stop.disabled = false;
    start.classList.add("clear");
    stop.classList.remove("clear");
    reset.classList.remove("clear");

    if (elapsedTime === 0) {
      initialTime = getTotalTime();
      endTime = Date.now() + initialTime;
    } else {
      endTime = Date.now() + elapsedTime;
    }

    intervalId = setInterval(() => {
      timeout = endTime - Date.now();

      if (timeout <= 0) {
        clearInterval(intervalId);
        updateDisplay(0);
        elapsedTime = 0;
        start.disabled = true;
        stop.disabled = true;
        stop.classList.add("clear");
        audio.currentTime = 0;
        audio.play();
        timer.classList.add("finish");
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

  //・ボタンで数値の変更
  const hoursUp = document.getElementById("hours-up");
  const hoursDown = document.getElementById("hours-down");
  const minutesUp = document.getElementById("minutes-up");
  const minutesDown = document.getElementById("minutes-down");
  const secondsUp = document.getElementById("seconds-up");
  const secondsDown = document.getElementById("seconds-down");

  //秒▲
  secondsUp.addEventListener("click", () => {
    let h = Number(hoursInput.value) || 0;
    let m = Number(minutesInput.value) || 0;
    let s = Number(secondsInput.value) || 0;

    s++;

    if (s >= 60) {
      s = 0;
      m++
      
    }

    if (m >= 60) {
      m = 0;
      h++;
    }

    hoursInput.value = String(h).padStart(2, '0');
    minutesInput.value = String(m).padStart(2, '0');
    secondsInput.value = String(s).padStart(2, '0');
  });

  //秒▼
    secondsDown.addEventListener("click", () => {
    let h = Number(hoursInput.value) || 0;
    let m = Number(minutesInput.value) || 0;
    let s = Number(secondsInput.value) || 0;

    s--;

    if (h === 0 && m === 0 && s < 0) {
      s = 59;
    }

    if (s < 0) {
      s = 59;
      m--;
    }

    if (m < 0) {
      m = 59;
      h--;
    }

    hoursInput.value = String(h).padStart(2, '0');
    minutesInput.value = String(m).padStart(2, '0');
    secondsInput.value = String(s).padStart(2, '0');
  });
//---------------------------------------------------
  //分▲
  minutesUp.addEventListener("click", () => {
    let h = Number(hoursInput.value) || 0;
    let m = Number(minutesInput.value) || 0;
    let s = Number(secondsInput.value) || 0;

    m++;

    if (m >= 60) {
      m = 0;
      h++
    }

    hoursInput.value = String(h).padStart(2, '0');
    minutesInput.value = String(m).padStart(2, '0');
    secondsInput.value = String(s).padStart(2, '0');
  });

  //分▼
    minutesDown.addEventListener("click", () => {
    let h = Number(hoursInput.value) || 0;
    let m = Number(minutesInput.value) || 0;
    let s = Number(secondsInput.value) || 0;

    m--;

    if (h === 0 && m < 0 && s >= 0) {
      m = 59;
    }


    if (m < 0) {
      m = 59;
      h--;
    }

    hoursInput.value = String(h).padStart(2, '0');
    minutesInput.value = String(m).padStart(2, '0');
    secondsInput.value = String(s).padStart(2, '0');
  });
//---------------------------------------------------
  //時間▲
  hoursUp.addEventListener("click", () => {
    let h = Number(hoursInput.value) || 0;
    h++;
    hoursInput.value = String(h).padStart(2, '0');
  });

  //時間▼
    hoursDown.addEventListener("click", () => {
    let h = Number(hoursInput.value) || 0;
    let m = Number(minutesInput.value) || 0;
    let s = Number(secondsInput.value) || 0;
    if (h === 0 && m >= 0 && s >= 0) return;
    h--;

    hoursInput.value = String(h).padStart(2, '0');
    minutesInput.value = String(m).padStart(2, '0');
    secondsInput.value = String(s).padStart(2, '0');
  });
}
//・stop中に数値の変更