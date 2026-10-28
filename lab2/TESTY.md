# Raport z testów i debugowania (Laboratorium 2)
 
**Przeglądarka:** Mozilla Firefox 158.0.1 (64-bit)
**Środowisko:** serwer lokalny Python (`http://localhost:8000/`)
 
## 1. Testy
 
### 1. Motyw i nawigacja
- **Co zrobiłem:** kliknąłem przycisk motywu, odświeżyłem stronę i przeszedłem na `kontakt.html`.
- **Oczekiwano:** motyw się utrzymuje, `aria-pressed` zgadza się ze stanem.
- **Wynik:** motyw ciemny zostaje po odświeżeniu i na innej podstronie, `aria-pressed="true"`.
- **Wniosek:** odczyt i zapis `localStorage` są w `try...catch`, więc zablokowana pamięć nie psuje strony.
### 2. Start trzy razy, potem Stop i Start
- **Co zrobiłem:** kliknąłem „Start zegara” 3 razy, potem „Stop zegara” i znowu „Start zegara”.
- **Oczekiwano:** działa jeden interwał, Stop zatrzymuje zegar, Start pokazuje aktualny czas.
- **Wynik:** zegar nie przyspiesza, Stop go zatrzymuje, Start wznawia od bieżącego czasu.
- **Wniosek:** warunek `timerId !== null` blokuje tworzenie kilku interwałów.
### 3. Wyszukiwanie ze spacjami i inną wielkością liter
- **Co zrobiłem:** wpisałem `"  RAZER  "`.
- **Oczekiwano:** zostaje pasująca karta, licznik się zgadza.
- **Wynik:** widoczna tylko karta myszy, komunikat „Znaleziono produktów: 1”.
- **Wniosek:** `.trim()` i `.toLowerCase()` załatwiają spacje i wielkość liter.
### 4. Brak dopasowania i wyczyszczenie pola
- **Co zrobiłem:** wpisałem `xyz`, potem wyczyściłem pole.
- **Oczekiwano:** komunikat o braku wyników, po wyczyszczeniu wracają 3 karty.
- **Wynik:** wszystkie karty są ukryte i pojawia się „Brak wyników dla podanej frazy.”, po wyczyszczeniu widać 3 karty.
- **Wniosek:** komunikat jest w `aria-live="polite"`, więc czytają go czytniki ekranu.
### 5. Cena 1999 gr i ilość 3
- **Co zrobiłem:** w konsoli wywołałem `obliczWartoscGrosze(1999, 3)`.
- **Oczekiwano:** 5997 gr, czyli 59,97 zł.
- **Wynik:** funkcja zwraca `5997`, po podzieleniu przez 100 i sformatowaniu wychodzi `59,97 zł`.
- **Wniosek:** funkcja liczy tylko na liczbach (bez DOM), a obliczenia w groszach unikają błędów zaokrągleń.
### 6. Ilość pusta, 0, 6 oraz 1,5
- **Co zrobiłem:** wybrałem produkt i wpisywałem kolejno: puste pole, `0`, `6`, `1,5`.
- **Oczekiwano:** brak błędnej wyceny i brak podsumowania.
- **Wynik:** w `#wycena` pojawia się „Wybierz produkt i podaj ilość od 1 do 5”, podsumowanie nie powstaje.
- **Wniosek:** walidacja działa w HTML (`min`, `max`, `step`) i w JS (`Number.isInteger()`).
### 7. Same spacje oraz `<b>Test</b>`
- **Co zrobiłem:** wpisałem 10 spacji, potem `<b>Test</b>`.
- **Oczekiwano:** spacje są odrzucone, a znaczniki pokazane jako zwykły tekst.
- **Wynik:** dla spacji pojawia się błąd o minimum 10 znakach, a `<b>Test</b>` jest wyświetlony dosłownie w podsumowaniu.
- **Wniosek:** `.trim()` łapie same spacje, a `.textContent` chroni przed wstrzyknięciem HTML (XSS).
### 8. Klawiatura, różne szerokości, wyłączony JavaScript
- **Co zrobiłem:** obsługiwałem stronę samym Tabem przy 375 px i 1280 px, potem wyłączyłem JS.
- **Oczekiwano:** wszystko działa z klawiatury, bez JS treść i menu nadal są dostępne.
- **Wynik:** nawigacja Tab i zmiana motywu działają w obu szerokościach, bez JS cała treść jest czytelna.
- **Wniosek:** semantyczny HTML i układ w CSS (Grid, Flexbox) działają bez skryptów.
## 2. Debugowanie w DevTools
 
### Funkcja w konsoli
```javascript
obliczWartoscGrosze(1999, 3);
// 5997  →  59,97 zł po podzieleniu przez 100 i sformatowaniu
```
 
### Timer
W *Debuggerze* ustawiłem breakpoint w `updateTime()`. Po 5 kliknięciach „Start zegara” kod zatrzymywał się raz na sekundę, więc interwały się nie dublują.
 
### Celowy błąd i naprawa
1. Ustawiłem breakpoint w obsłudze `submit` formularza i sprawdziłem zmienne `dane` i `wiadomosc`.
2. Na końcu `main.js` dopisałem wywołanie nieistniejącej funkcji:
```javascript
   zlyFunc();
```
3. W konsoli pojawił się błąd `Uncaught ReferenceError: zlyFunc is not defined` w `main.js:242:1`. Oznacza to, że funkcja `zlyFunc` nie jest nigdzie zdefiniowana, a konsola wskazuje plik i linię z wywołaniem.
   ![Błąd ReferenceError w konsoli](img/image.png)
4. Usunąłem `zlyFunc();` z `main.js`. Po odświeżeniu strony konsola jest czysta.