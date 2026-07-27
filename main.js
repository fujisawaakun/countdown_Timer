"use strict";
{
  const timer = document.getElementById("timer");
  const start = document.getElementById("start");
  const reset = document.getElementById("reset");
  const startIconPath = document.getElementById("start-icon-path");

  const progress = document.getElementById("progress");
  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  progress.style.strokeDasharray = circumference;
  progress.style.strokeDashoffset = 0;

  const hoursWork = document.getElementById("hours-work");
  const minutesWork = document.getElementById("minutes-work");
  const secondsWork = document.getElementById("seconds-work");

  const hoursRest = document.getElementById("hours-rest");
  const minutesRest = document.getElementById("minutes-rest");
  const secondsRest = document.getElementById("seconds-rest");

  const setCount = document.getElementById("set-count");

  const allInputs = [
    hoursWork,
    minutesWork,
    secondsWork,
    hoursRest,
    minutesRest,
    secondsRest,
    setCount,
  ];

  const workBGMSelect = document.getElementById('work-bgm-select');
  setWorkBGMSrc(workBGMSelect.value);

  const restBGMSelect = document.getElementById('rest-bgm-select');
  setRestBGMSrc(restBGMSelect.value);

  const workBGMDropArea = document.getElementById('work-BGM-drop-area');
  const restkBGMDropArea = document.getElementById('restk-BGM-drop-area');


  const volumeSlider = document.getElementById("volume-slider");
  const volumeValue = document.getElementById("volume-value");

  const settingDisplay = document.getElementById("setting-display");
  const settingIcon = document.getElementById("setting-icon");

  let intervalId;
  let currentSet = 1;
  let isRunning = false;
  let remainingTime = 0;
  let currentMode = "work";
  let hasPlayedCountdown = false;

  //work-timerのinputに入力された数値を取得、ミリ秒に変換
  function getWorkTotalTime() {
    const h = Number(hoursWork.value) || 0;
    const m = Number(minutesWork.value) || 0;
    const s = Number(secondsWork.value) || 0;

    return (h * 3600 + m * 60 + s) * 1000;
  }

  //rest-timerのinputに入力された数値を取得、ミリ秒に変換
  function getRestTotalTime() {
    const h = Number(hoursRest.value) || 0;
    const m = Number(minutesRest.value) || 0;
    const s = Number(secondsRest.value) || 0;

    return (h * 3600 + m * 60 + s) * 1000;
  }

  //set-countのinputに入力された数値を取得
  function getSetCount() {
    return Number(setCount.value) || 1;
  }

  // //受け取った数値を時・分・秒に分割、timerのテキストに表示
  // function updateTimerText(ms) {
  //   const totalSec = Math.ceil(ms / 1000);
  //   const hh = Math.floor(totalSec / 3600);
  //   const mm = Math.floor((totalSec % 3600) / 60);
  //   const ss = Math.floor(totalSec % 60);

  //   timer.textContent =
  //     `${String(hh).padStart(1, "0")}:` +
  //     `${String(mm).padStart(2, "0")}:` +
  //     `${String(ss).padStart(2, "0")}`;
  // }

  // function updateRing(remainingTime, totalTime) {
  //   if (totalTime <= 0) {
  //     progress.style.strokeDashoffset = circumference;
  //     return;
  //   }

  //   const ratio = remainingTime / totalTime;
  //   const offset = circumference * (1 - ratio);

  //   progress.style.strokeDashoffset = offset;
  // }

  function previewTime() {
    const totalTime = getWorkTotalTime();
    updateTimerText(timer, totalTime);
    updateRing(progress, circumference, totalTime, totalTime);
  }

  function startCountdown(totalTime, finish) {
    if (totalTime <= 0) {
      finish();
      return;
    }

    clearInterval(intervalId);

    hasPlayedCountdown = false;

    const endTime = Date.now() + totalTime;
    remainingTime = totalTime;
    isRunning = true;
    updateStartIcon(startIconPath, "pause");

    updateTimerText(timer, totalTime);
    updateRing(progress, circumference, totalTime, totalTime);

    intervalId = setInterval(() => {
      const countDown = endTime - Date.now();
      remainingTime = countDown;

      if (countDown <= 0) {
        clearInterval(intervalId);
        remainingTime = 0;
        isRunning = false;
        updateStartIcon(startIconPath, "play");
        updateTimerText(timer, 0);
        updateRing(progress, circumference, 0, totalTime);
        finish();
        return;
      }

      timerEndBGM(countDown);
      fadeOutBGM(countDown);

      updateTimerText(timer, countDown);
      updateRing(progress, circumference, countDown, totalTime);
    }, 45);
  }

  function startWork() {
    currentMode = "work";
    playWorkBGM();

    startCountdown(getWorkTotalTime(), () => {
      if (currentSet >= getSetCount()) {
        resetAllBGM();
        inputsDisabled(allInputs, false);
        return;
      }

      startRest();
    });
  }
  function startRest() {
    currentMode = "rest";
    playRestBGM();

    startCountdown(getRestTotalTime(), () => {
      currentSet++;
      startWork();
    });
  }

  function resumeCountdown() {
    let totalTime;
    if (currentMode === "work") {
      totalTime = getWorkTotalTime();
      playWorkBGM();
    } else {
      totalTime = getRestTotalTime();
      playRestBGM();
    }

    if (remainingTime <= 0) {
      return;
    }

    if (remainingTime <= 4000) {
      resumeCountdownBGM();
    }

    clearInterval(intervalId);

    const endTime = Date.now() + remainingTime;
    isRunning = true;
    updateStartIcon(startIconPath, "pause");

    intervalId = setInterval(() => {
      const countDown = endTime - Date.now();
      remainingTime = countDown;

      if (countDown <= 0) {
        clearInterval(intervalId);
        remainingTime = 0;
        isRunning = false;
        updateStartIcon(startIconPath, "play");
        updateTimerText(timer, 0);
        updateRing(progress, circumference, 0, totalTime);

        if (currentMode === "work") {
          if (currentSet >= getSetCount()) {
            resetAllBGM();
            updateStartIcon(startIconPath, "play");
            return;
          }
          startRest();
        } else {
          currentSet++;
          startWork();
        }
        return;
      }

      timerEndBGM(countDown);
      fadeOutBGM(countDown);

      updateTimerText(timer, countDown);
      updateRing(progress, circumference, countDown, totalTime);
    }, 45);
  }

  // function updateVolume(volume) {
  //   workBGM.volume = volume;
  //   restBGM.volume = volume;

  //   volumeValue.textContent = `${Math.round(volume * 100)}`;
  // }

  // function updateStartIcon(startIconPath, date) {
  //   if (date === "play") {
  //     startIconPath.setAttribute("d", "M8 5v14l11-7z");
  //   }
  //   if (date === "pause") {
  //     startIconPath.setAttribute("d", "M6 5h4v14H6zm8 0h4v14h-4z");
  //   }
  // }

  // function inputsDisabled(allInputs, isDisabled) {
  //   allInputs.forEach((input) => {
  //     input.disabled = isDisabled;
  //   });
  // }

  start.addEventListener("click", () => {
    if (isRunning) {
      clearInterval(intervalId);
      isRunning = false;
      updateStartIcon(startIconPath, "play");
      pauseAllBGM();
      return;
    }

    if (remainingTime > 0) {
      resumeCountdown();
      return;
    }

    if (getWorkTotalTime() <= 0) {
      return;
    }

    currentSet = 1;
    remainingTime = 0;
    currentMode = "work";
    startWork();
    inputsDisabled(allInputs, true);
  });

  reset.addEventListener("click", () => {
    clearInterval(intervalId);
    isRunning = false;
    currentSet = 1;
    remainingTime = 0;
    currentMode = "work";
    updateStartIcon(startIconPath, "play");
    inputsDisabled(allInputs, false);
    resetAllBGM();
    previewTime();
  });

  workBGMSelect.addEventListener("change", () => {
    const wasRunningWork = isRunning === true && currentMode === "work";
    setWorkBGMSrc(workBGMSelect.value);

    if (wasRunningWork === true) {
      playWorkBGM();
    }

    saveSettings();
  });

    restBGMSelect.addEventListener("change", () => {
    const wasRunningRest = isRunning === true && currentMode === "rest";
    setRestBGMSrc(restBGMSelect.value);

    if (wasRunningRest === true) {
      playRestBGM();
    }

    saveSettings();
  });

  function setupBGMDropArea(dropArea, )

  //ローカルに「work,restの時間、セット数、音量」の保存-------------------------
  const SETTINGS_STORAGE_KEY = "timer-setting";

  function saveSettings() {
    const settings = {
      work: {
        hours: hoursWork.value,
        minutes: minutesWork.value,
        seconds: secondsWork.value,
      },
      rest: {
        hours: hoursRest.value,
        minutes: minutesRest.value,
        seconds: secondsRest.value,
      },
      workBGM: workBGMSelect.value,
      restBGM: restBGMSelect.value,
      setCount: setCount.value,
      volume: volumeSlider.value,
    }

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }

  function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!saved) {
      return;
    }

    const settings = JSON.parse(saved);

    hoursWork.value = settings.work?.hours ?? "00";
    minutesWork.value = settings.work?.minutes ?? "00";
    secondsWork.value = settings.work?.seconds ?? "00";

    hoursRest.value = settings.rest?.hours ?? "00";
    minutesRest.value = settings.rest?.minutes ?? "00";
    secondsRest.value = settings.rest?.seconds ?? "00";

    workBGMSelect.value = settings.workBGM ?? "workBGM/healing2.mp3";
    restBGMSelect.value = settings.restBGM ?? "restBGM/チルアウト.mp3";

    setWorkBGMSrc(workBGMSelect.value);
    setRestBGMSrc(restBGMSelect.value);

    setCount.value = settings.setCount ?? "1";
    volumeSlider.value = settings.volume ?? "0.5";
    updateVolume(Number(volumeSlider.value),volumeValue);
  }

  //-------------------------------------------------

  function fadeOutBGM(countDown) {
    const fadeDuration = 4000;
    const baseVolume = Number(volumeSlider.value);

    if (countDown > fadeDuration) {
      setCurrentModeVolume(currentMode, baseVolume);
      return;
    }

    const ratio = Math.max(0, countDown / fadeDuration);
    setCurrentModeVolume(currentMode, baseVolume * ratio);
  }

  hoursWork.addEventListener("input", () => {
    previewTime();
    saveSettings();
  });
  minutesWork.addEventListener("input", () => {
    previewTime();
    saveSettings();
  });
  secondsWork.addEventListener("input", () => {
    previewTime();
    saveSettings();
  });

  function timerEndBGM(countDown) {
    if (countDown <= 4000 && !hasPlayedCountdown) {
      playCountDownBGM();
      hasPlayedCountdown = true;
    }
  }

  hoursRest.addEventListener("input", saveSettings);
  minutesRest.addEventListener("input", saveSettings);
  secondsRest.addEventListener("input", saveSettings);

  setCount.addEventListener("input", saveSettings);

  //音量の操作
  volumeSlider.addEventListener("input", () => {
    const volume = Number(volumeSlider.value);
    updateVolume(volume, volumeValue);
    saveSettings();

    if (isRunning && remainingTime > 4000) {
    setCurrentModeVolume(currentMode, volume);
  }
  });


  loadSettings();
  previewTime();
  updateVolume(Number(volumeSlider.value), volumeValue);
}

//Next 