
Readme · MD
# TechPunkt – katalog produktów
 
Prosta strona sklepu z elektroniką (HTML, CSS, JavaScript).
 
## Uruchomienie
 
```
python -m http.server 8000
```
 
lub na Windowsie: `py -m http.server 8000`
 
Strona jest dostępna pod adresem: http://localhost:8000/
 
## Jak to działa
 
W każdej funkcji przepływ jest taki sam: zdarzenie → dane wejściowe → obliczenie → zmiana DOM.
 
### Wycena (kontakt.html)
 
- **Zdarzenie:** zmiana produktu (`change`) lub ilości (`input`).
- **Dane wejściowe:** wybrany produkt i wpisana ilość.
- **Obliczenie:** sprawdzenie, czy ilość to liczba całkowita od 1 do 5, potem cena w groszach × ilość (`obliczWartoscGrosze`), podział przez 100 i zapis jako kwota w zł.
- **Zmiana DOM:** kwota (lub komunikat o błędzie) pojawia się w `#wycena`.
### Wysłanie formularza (kontakt.html)
 
- **Zdarzenie:** `submit` formularza (przeładowanie strony jest blokowane przez `preventDefault`).
- **Dane wejściowe:** produkt, ilość i wiadomość (po `.trim()`).
- **Obliczenie:** sprawdzenie danych i długości wiadomości (min. 10 znaków), obliczenie wartości zamówienia.
- **Zmiana DOM:** komunikat błędu w `#error` albo podsumowanie w `#podsumowanie`. Tekst jest wstawiany przez `textContent`, więc kod HTML wpisany przez użytkownika nie jest wykonywany.
### Wyszukiwarka (index.html)
 
- **Zdarzenie:** wpisywanie w polu wyszukiwania (`input`).
- **Dane wejściowe:** wpisana fraza i nazwy produktów.
- **Obliczenie:** porównanie frazy z nazwą (bez spacji na brzegach i bez znaczenia wielkości liter), zliczenie pasujących kart.
- **Zmiana DOM:** pasujące karty są widoczne, reszta ma `hidden`; liczba wyników pojawia się w `#search-status`.
### Zegar (index.html)
 
- **Zdarzenie:** kliknięcie „Start zegara” lub „Stop zegara” (zegar startuje też sam po wczytaniu strony).
- **Dane wejściowe:** aktualny czas z systemu (`new Date()`).
- **Obliczenie:** formatowanie daty i godziny w formacie polskim; `setInterval` co 1 sekundę (tylko jeden naraz).
- **Zmiana DOM:** nowy tekst w `#time` i `#date`.
### Motyw jasny i ciemny (wszystkie strony)
 
- **Zdarzenie:** kliknięcie przycisku motywu.
- **Dane wejściowe:** aktualny motyw i wartość zapisana w `localStorage`.
- **Obliczenie:** zamiana `light` na `dark` albo odwrotnie.
- **Zmiana DOM:** nowy `data-theme` na `<html>`, zmiana `aria-pressed` na przycisku, zapis wyboru w `localStorage`.
## Źródła zdjęć
 
- Klawiatura: https://www.mediaexpert.pl/komputery-i-tablety/klawiatury-komputerowe/klawiatury/klawiatura-hyperx-alloy-origins-2-65-rgb
- Mysz: https://www.mediaexpert.pl/komputery-i-tablety/myszy-komputerowe/myszki-uniwersalne/mysz-razer-deathadder-essential-czarny
- Słuchawki: https://www.mediaexpert.pl/komputery-i-tablety/sluchawki-i-glosniki-komputerowe/sluchawki-z-mikrofonem/sluchawki-mad-dog-gh800-nauszne-dzwiek-przestrzenny