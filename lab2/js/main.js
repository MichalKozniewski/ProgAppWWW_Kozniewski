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

const PRODUKTY = [
  { id: "klawiatura", nazwa: "HyperX Alloy Origins 2 65", cenaGrosze: 33900 },
  { id: "mysz", nazwa: "Razer DeathAdder Essential", cenaGrosze: 9900 },
  { id: "sluchawki", nazwa: "Mad Dog GH800", cenaGrosze: 24900 }
];

function obliczWartoscGrosze(cenaGrosze, ilosc){
  return cenaGrosze * ilosc
}
const priceFormatter = new Intl.NumberFormat("pl-PL",{style: "currency", currency: "PLN"})
function inicjalizujFormularz(){
  const form = document.getElementById("formularz-kontakt");
  const selectProdukt = document.getElementById("produkt");
  const inputIlosc = document.getElementById("ilosc");
  const textareaWiadomosc = document.getElementById("wiadomosc");
  const err = document.getElementById("error");
  const podsumowanie = document.getElementById("podsumowanie");
  const wycena = document.getElementById("wycena");
  if (!form || !selectProdukt || !inputIlosc || !textareaWiadomosc || !err || !podsumowanie || !wycena) return;
  function pobierzDane() {
    const idTekst = selectProdukt.value; 
    const iloscTekst = inputIlosc.value;  
    const ilosc = Number(iloscTekst);    
    const produkt = PRODUKTY.find((p) => String(p.id) === idTekst);


    const poprawne =
      Boolean(produkt) &&
      iloscTekst.trim() !== '' &&
      Number.isInteger(ilosc) &&
      ilosc >= 1 &&
      ilosc <= 5;

    return { produkt, ilosc, poprawne };
  }
  function pokazWycene(){
    const x = pobierzDane();
    if (!x.poprawne){
      wycena.textContent = "Wybierz produkt i podaj ilość od 1 do 5";
      return;
    }
    wycena.textContent = priceFormatter.format(obliczWartoscGrosze(x.produkt.cenaGrosze,x.ilosc)/100);
      
  }
  function ukryjPodsumowanie(){
    podsumowanie.hidden = true;
    podsumowanie.textContent = "";
  }
  function ukryjBlad(){
    err.hidden = true;
    err.textContent = "";
    textareaWiadomosc.removeAttribute("aria-invalid");
  }
  function pokazPodsumowanie(dane, wiadomosc){
    podsumowanie.textContent = "";
    const waroscZl = obliczWartoscGrosze(dane.produkt.cenaGrosze, dane.ilosc) /100;
    const sformatowane = priceFormatter.format(waroscZl)
    const linie = [
      `Wybrany produkt: ${dane.produkt.nazwa || dane.produkt.id}`,
      `Ilość: ${dane.ilosc}`,
      `Wartość zamówienia: ${sformatowane}`,
      `Treść wiadomości: ${wiadomosc}`
    ];
    linie.forEach((tekst) => {
      const p = document.createElement("p");
      p.textContent = tekst;
      podsumowanie.appendChild(p);
    });
    podsumowanie.hidden = false;
  }
  function obsluzZmianeWyceny(){
    pokazWycene();
    ukryjPodsumowanie();
  }
  selectProdukt.addEventListener("change", obsluzZmianeWyceny);
  inputIlosc.addEventListener("input", obsluzZmianeWyceny);
  textareaWiadomosc.addEventListener("input", () => {
    if (textareaWiadomosc.value.trim().length >= 10) {
      ukryjBlad();
    }
    ukryjPodsumowanie();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    
    const dane = pobierzDane();
    const wiadomosc = textareaWiadomosc.value.trim();

    
    if (!dane.poprawne) {
      pokazWycene();
      ukryjPodsumowanie();
      return;
    }

    if (wiadomosc.length < 10) {
      err.textContent = "Wiadomość musi zawierać co najmniej 10 znaków.";
      err.hidden = false;
      textareaWiadomosc.setAttribute("aria-invalid", "true");
      textareaWiadomosc.focus();
      ukryjPodsumowanie();
      return;
    }
    ukryjBlad();
    pokazPodsumowanie(dane, wiadomosc);
  });
  pokazWycene();
  
  
}

inicjalizujFormularz();
inicjalizujWyszukiwarke();
inicjalizujZegar();
