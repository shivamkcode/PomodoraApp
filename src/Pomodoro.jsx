import React, { useEffect, useState } from "react";
import "./App.css";

import settingIcon from "./assets/icon-settings.svg";
import closeIcon from "./assets/icon-close.svg";
import tone from "./assets/tone.mp3";

const Pomodoro = () => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timer, setTimer] = useState();
  const [paused, setPaused] = useState(true);
  const [started, setStarted] = useState(false);
  const [reset, setReset] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedButton, setSelectedButton] = useState("pomodoro");

  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);

  const [font, setFont] = useState("kumbh sans");
  const [color, setColor] = useState("#F87070");

  const [tempPomodoroTime, setTempPomodoroTime] = useState(pomodoroTime);
  const [tempShortBreakTime, setTempShortBreakTime] = useState(shortBreakTime);
  const [tempLongBreakTime, setTempLongBreakTime] = useState(longBreakTime);
  const [tempFont, setTempFont] = useState(font);
  const [tempColor, setTempColor] = useState(color);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const toggleSettings = () => setShowSettings(!showSettings);

  useEffect(() => {
    const savedCustomizations = JSON.parse(
      localStorage.getItem("customizations")
    );
    if (savedCustomizations) {
      setTempPomodoroTime(savedCustomizations.tempPomodoroTime);
      setTempShortBreakTime(savedCustomizations.tempShortBreakTime);
      setTempLongBreakTime(savedCustomizations.tempLongBreakTime);
      setFont(savedCustomizations.tempFont);
      setColor(savedCustomizations.tempColor);
      setTempFont(savedCustomizations.tempFont);
      setTempColor(savedCustomizations.tempColor);
      setSelectedButton(savedCustomizations.selectedButton);
      setSecondsLeft(savedCustomizations.secondsLeft);
      setStarted(savedCustomizations.setStarted);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "customizations",
      JSON.stringify({
        tempPomodoroTime,
        tempShortBreakTime,
        tempLongBreakTime,
        tempFont,
        tempColor,
        selectedButton,
        secondsLeft,
        started,
      })
    );
  }, [
    tempPomodoroTime,
    tempShortBreakTime,
    tempLongBreakTime,
    tempFont,
    tempColor,
    selectedButton,
    secondsLeft,
  ]);

  // useEffect(() => {
  //   document.documentElement.style.setProperty("selected-color", color);
  // });

  useEffect(() => {
    const timer = setInterval(() => {
      if (started && !paused) {
        setSecondsLeft((secondsLeft) => secondsLeft - 1);
      }
      if (secondsLeft === 0) {
        clearInterval(timer);
      }
    }, 100);
    setTimer(timer);
  }, [paused, started]);

  useEffect(() => {
    if (secondsLeft === 0) {
      clearInterval(timer);
      setStarted(true)
    }
  }, [timer, secondsLeft]);

  useEffect(() => {
    return () => clearInterval(timer);
  }, [timer]);

  useEffect(() => {
    const canvas = document.getElementById("timerCanvas");
    const ctx = canvas.getContext("2d");

    const drawTimerStrip = (remainingTime) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const percentageRemaining = remainingTime / (tempPomodoroTime * 60);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;
      const startAngle = -0.5 * Math.PI;
      const endAngle = 2 * Math.PI * percentageRemaining - 0.5 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.stroke();
    };

    drawTimerStrip(secondsLeft);

    const timerInterval = setInterval(() => {
      if (started && !paused) {
        drawTimerStrip(secondsLeft - 1);
      }
      if (secondsLeft === 0) {
        clearInterval(timerInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [paused, started, secondsLeft, color]);

  const handleClick = (time, label) => {
    setSecondsLeft(time * 60);
    setSelectedButton(label);
  };
  // const audio = new Audio(tone);

  useEffect(() => {
    if (secondsLeft === 0) {
      document.getElementById("beep").muted = false;
      document.getElementById("beep").play();
    }
  }, [secondsLeft]);

  return (
    <div style={{ fontFamily: font }}>
      <h1>pomodoro</h1>
      <audio id="beep" src={tone} autoPlay muted />
      <nav>
        <button
          onClick={() => handleClick(tempPomodoroTime, "pomodoro")}
          style={{
            backgroundColor:
              selectedButton === "pomodoro" ? color : "transparent",
            color: selectedButton === "pomodoro" ? "#1E213F" : "#D7E0FF",
          }}
        >
          pomodoro
        </button>
        <button
          onClick={() => handleClick(tempShortBreakTime, "short break")}
          style={{
            backgroundColor:
              selectedButton === "short break" ? color : "transparent",
            color: selectedButton === "short break" ? "#1E213F" : "#D7E0FF",
          }}
        >
          short break
        </button>
        <button
          onClick={() => handleClick(tempLongBreakTime, "long break")}
          style={{
            backgroundColor:
              selectedButton === "long break" ? color : "transparent",
            color: selectedButton === "long break" ? "#1E213F" : "#D7E0FF",
          }}
        >
          long break
        </button>
      </nav>
      <main>
        <div className="inner-circle">
          <div className="timer-strip" style={{ position: "relative" }}>
            <canvas
              id="timerCanvas"
              width="339"
              height="339"
              style={{ position: "absolute", top: 0, left: 0 }}
            ></canvas>
            <div className="timer">
              <h1
                style={{
                  letterSpacing: font === "space mono" ? "-10px" : "0px",
                }}
              >
                {minutes >= 10 ? `${minutes}` : "0" + minutes}:
                {seconds >= 10 ? `${seconds}` : "0" + seconds}
              </h1>
              <div>
                {!started && !reset && (
                  <button
                    onClick={() => {
                      setStarted(true);
                      setPaused(false);
                      setReset(false);
                    }}
                  >
                    Start
                  </button>
                )}
                {started && !paused && secondsLeft !== 0 && (
                  <button
                    onClick={() => {
                      setPaused(true);
                    }}
                  >
                    Pause
                  </button>
                )}
                {started && paused && secondsLeft !== 0 && (
                  <button
                    onClick={() => {
                      setPaused(false);
                    }}
                  >
                    Resume
                  </button>
                )}
                {secondsLeft === 0 && (
                  <button
                    onClick={() => {
                      setSecondsLeft(
                        (selectedButton === "pomodoro"
                          ? tempPomodoroTime
                          : selectedButton === "short break"
                          ? tempShortBreakTime
                          : tempLongBreakTime) * 60
                      );
                      setReset(true);
                      setStarted(false);
                    }}
                  >
                    Restart
                  </button>
                )}
                {reset && !started && (
                  <button
                    onClick={() => {
                      setStarted(true);
                      setPaused(false);
                      setReset(false);
                    }}
                  >
                    Start
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <img
        className="setting-button"
        onClick={toggleSettings}
        src={settingIcon}
        alt="settings"
      />
      {showSettings && (
        <div className="settings-modal">
          <header>
            <h2>Settings</h2>
            <img onClick={toggleSettings} src={closeIcon} alt="X" />
          </header>
          <div className="customize-box">
            <h3>Time (Minutes)</h3>
            <div>
              <label htmlFor="pomodoroTime">
                <span>Pomodoro</span>
                <select
                  id="pomodoroTime"
                  className="settings-select"
                  value={tempPomodoroTime}
                  onChange={(e) => setTempPomodoroTime(e.target.value)}
                >
                  {Array.from({ length: 60 }, (_, i) => i + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="shortBreak">
                <span>Short Break</span>
                <select
                  id="shortBreak"
                  className="settings-select"
                  value={tempShortBreakTime}
                  onChange={(e) => setTempShortBreakTime(e.target.value)}
                >
                  {Array.from({ length: 60 }, (_, i) => i + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="longBreak">
                <span>Long Break</span>
                <select
                  id="longBreak"
                  className="settings-select"
                  value={tempLongBreakTime}
                  onChange={(e) => setTempLongBreakTime(e.target.value)}
                >
                  {Array.from({ length: 60 }, (_, i) => i + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="select-font">
              <h3>Font</h3>
              <div>
                <span
                  style={{
                    fontFamily: "kumbh sans",
                    background:
                      tempFont === "kumbh sans" ? "#161932" : "#EFF1FA",
                    color: tempFont === "kumbh sans" ? "white" : "#1E213F",
                  }}
                  onClick={() => setTempFont("kumbh sans")}
                >
                  Aa
                </span>
                <span
                  style={{
                    fontFamily: "roboto slab",
                    background:
                      tempFont === "roboto slab" ? "#161932" : "#EFF1FA",
                    color: tempFont === "roboto slab" ? "white" : "#1E213F",
                  }}
                  onClick={() => setTempFont("roboto slab")}
                >
                  Aa
                </span>
                <span
                  style={{
                    fontFamily: "space mono",
                    background:
                      tempFont === "space mono" ? "#161932" : "#EFF1FA",
                    color: tempFont === "space mono" ? "white" : "#1E213F",
                  }}
                  onClick={() => setTempFont("space mono")}
                >
                  Aa
                </span>
              </div>
            </div>
            <div className="select-color">
              <h3>Color</h3>
              <div>
                <span
                  style={{ background: "#F87070" }}
                  onClick={() => setTempColor("#F87070")}
                >
                  {tempColor === "#F87070" && "✔"}
                </span>
                <span
                  style={{ background: "#70F3F8" }}
                  onClick={() => setTempColor("#70F3F8")}
                >
                  {tempColor === "#70F3F8" && "✔"}
                </span>
                <span
                  style={{ background: "#D881F8" }}
                  onClick={() => setTempColor("#D881F8")}
                >
                  {tempColor === "#D881F8" && "✔"}
                </span>
              </div>
            </div>
            <button
              className="apply-button"
              style={{ background: color }}
              onClick={() => {
                toggleSettings();
                setPomodoroTime(tempPomodoroTime);
                setShortBreakTime(tempShortBreakTime);
                setLongBreakTime(tempLongBreakTime);
                setFont(tempFont);
                setColor(tempColor);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pomodoro;
