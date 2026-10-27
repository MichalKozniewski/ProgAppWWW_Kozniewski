"use strict";

document.addEventListener("DOMContentLoaded", () => {
  inicjalizujTrybCiemny();
});

function inicjalizujTrybCiemny() {
  const przyciskMotywu = document.getElementById("theme-toggle");
  if (!przyciskMotywu) return;

  const KLUCZ_STORAGE = "wybrany_motyw";
  const dozwoloneMotywy = ["light", "dark"];

  let zapisanyMotyw = localStorage.getItem(KLUCZ_STORAGE);
  if (!dozwoloneMotywy.includes(zapisanyMotyw)) {
    zapisanyMotyw = "light";
  }

  function ustawMotyw(motyw) {
    document.documentElement.setAttribute("data-theme", motyw);
    przyciskMotywu.setAttribute("aria-pressed", motyw === "dark" ? "true" : "false");
    localStorage.setItem(KLUCZ_STORAGE, motyw);
  }

  ustawMotyw(zapisanyMotyw);


  przyciskMotywu.addEventListener("click", () => {
    const aktualnyMotyw = document.documentElement.getAttribute("data-theme");
    const nowyMotyw = aktualnyMotyw === "dark" ? "light" : "dark";
    ustawMotyw(nowyMotyw);
  });
}
const timeFormatter = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
});
const dayFormatter = new Intl.DateTimeFormat("pl-PL",{
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
});
let timerId = null;

function inicjalizujZegar() {
  const czas = document.getElementById("time");
  const date = document.getElementById("date");
  const startBtn = document.getElementById("on");
  const stopBtn = document.getElementById("off");

  if (!czas || !startBtn || !stopBtn || !date) {
    return;
  }


  function updateTime() {
    const now = new Date();
    czas.textContent = timeFormatter.format(now);
    date.textContent = dayFormatter.format(now);
  }

  function startTimer() {
    if (timerId !== null) return;
    updateTime();
    timerId = setInterval(updateTime, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  startBtn.addEventListener("click", startTimer);
  stopBtn.addEventListener("click", stopTimer);
  startTimer();
}

function inicjalizujWyszukiwarke() {
  const searchInput = document.getElementById("search-input");
  const searchStatus = document.getElementById("search-status");
  const cards = document.querySelectorAll(".karta");


  if (!searchInput || !cards.length) {
    return;
  }

  function updateSearch() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {

      const titleElement = card.querySelector("h2");
      const titleText = titleElement ? titleElement.textContent.toLowerCase() : "";

      const matches = titleText.includes(query);

      if (matches) {
        card.hidden = false;
        visibleCount++;
      } else {
        card.hidden = true;
      }
    });

    if (searchStatus) {
      if (visibleCount === 0) {
        searchStatus.textContent = "Brak wyników dla podanej frazy.";
      } else {
        searchStatus.textContent = `Znaleziono produktów: ${visibleCount}`;
      }
    }
  }


  searchInput.addEventListener("input", updateSearch);

  updateSearch();
}
inicjalizujWyszukiwarke();
inicjalizujZegar();
