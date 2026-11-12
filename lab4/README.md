# TechPunkt – Laboratorium 4 (PHP: formularze i sesja)

Projekt katalogu produktów z obsługą filtrowania metodą `GET`, zapisem wyboru metodą `POST` (wzorzec Post/Redirect/Get), zapamiętywaniem stanu w sesji PHP (`$_SESSION`) oraz walidacją danych wejściowych.

## Instrukcja uruchomienia

1. Skopiuj katalog `lab4` do folderu `htdocs/` w środowisku XAMPP.
2. Uruchom serwer **Apache** w panelu sterowania XAMPP.
3. Otwórz przeglądarkę i przejdź pod adres:
   - Strona główna: `http://localhost/lab4/`
   - Katalog PHP: `http://localhost/lab4/lab4.php`

---

## Pseudokod obsługi sesji, formularza POST i GET

### Część 1: Poprawne żądanie
1. Rozpocznij sesję (`session_start()`) na samym początku pliku.
2. Wczytaj tablicę produktów z `includes/produkty.php` za pomocą `require_once`.
3. Zainicjuj stałą `MAX_ILOSC = 5` oraz pusty komunikat błędu `$komunikat_bledu_post = ''` (dla żądań `GET` walidacja `POST` nie jest wykonywana).
4. Jeśli metoda żądania to `POST`:
   - Sprawdź za pomocą `isset()` oraz `is_string()`, czy pola `produkt` i `ilosc` istnieją w `$_POST` i są tekstem (odrzucenie braku pól oraz tablic).
   - Przefiltruj obie wartości przez `FILTER_VALIDATE_INT` i porównaj wynik ściśle z `false` (`=== false`), aby odrzucić ułamki (np. `2.5`) i teksty (np. `2abc`). Dopiero po udanym filtrze zapisz wartości do zmiennych `$produkt_id` i `$ilosc`.
   - Odszukaj produkt o podanym `id` w katalogu `$produkty`.
   - Sprawdź, czy `$ilosc` mieści się w przedziale od `1` do `MAX_ILOSC` oraz nie przekracza wartości `stan` wybranego produktu.
   - Po przejściu wszystkich warunków zapisz w `$_SESSION['ostatni_wybor']` identyfikator `id` oraz `ilosc`, wyślij nagłówek przekierowania `HTTP 303 See Other` (`header('Location: lab4.php', true, 303)`) i zakończ skrypt instrukcją `exit`.
5. Podczas generowania widoku (`GET`):
   - Jeśli `$_SESSION['ostatni_wybor']` istnieje, odszukaj nazwę produktu w katalogu po zapisanym `id` i wyświetl ją wraz z ilością; w przeciwnym razie wyświetl komunikat o braku zapisanego wyboru.
   - Parametr `$_GET['kategoria']` filtruje wyłącznie wyświetlane wiersze tabeli i nie modyfikuje stanu zapisanego w sesji.

### Część 2: Błędne żądanie
1. Gdy dla żądania `POST` nie zostanie spełniony którykolwiek warunek walidacji (brak pola, przesłanie tablicy, ułamek `2.5`, tekst `2abc`, nieistniejące `id` produktu, ilość `0` lub `6`, ilość przekraczająca `stan` magazynowy):
   - Ustaw kod odpowiedzi `HTTP 400 Bad Request` za pomocą `http_response_code(400)`.
   - Przypisz odpowiedni komunikat błędu do zmiennej `$komunikat_bledu_post`.
   - Nie wykonuj przekierowania `header()` ani instrukcji `exit`.
   - Nie nadpisuj `$_SESSION['ostatni_wybor']` — wcześniejszy poprawny wybór pozostaje w sesji bez zmian.
   - Wyrenderuj stronę normalnie z kodem `400` i wyświetl komunikat błędu przy formularzu (zabezpieczony przez `htmlspecialchars()` z `role="alert"`).

---

## Wyniki prób testowych (Panel Network)

| Próba | Kroki wykonania | Oczekiwany wynik | Rzeczywisty wynik | Status HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **Filtr GET (poprawny i błędny)** | Wybór kategorii `ksiazki` oraz ręczne wpisanie `?kategoria[]=ksiazki`. | Filtrowanie listy dla poprawnej kategorii; komunikat błędu i pełna lista dla nieznanej wartości/tablicy; sesja bez zmian. | Wyświetlono komunikat o nieprawidłowym parametrze i pełną listę; stan sesji nienaruszony. | `GET 200` |
| **Poprawny POST i odświeżenie** | Wybór dostępnego produktu i ilości `2`, wysłanie formularza, następnie `F5` i zmiana filtra. | Przekierowanie `POST 303` -> `GET 200`, zapis w sesji widoczny po odświeżeniu i zmianie filtra. | W Network widoczne `POST 303`, potem `GET 200`; wybór zapamiętany po odświeżeniu. | `POST 303` -> `GET 200` |
| **Ilość poza zakresem (`0` i `6`)** | Zmiana `value` opcji ilości w Inspektorze na `0`, a następnie na `6`. | Odrzucenie żądania z kodem `400`, komunikat o przedziale `1 do 5`, sesja bez zmian. | Komunikat: *„Ilość musi mieścić się w przedziale od 1 do 5.”*; sesja bez zmian. | `POST 400` |
| **Błędny format (`2.5` i `2abc`)** | Zmiana `value` opcji ilości w Inspektorze na `2.5`, a potem na `2abc`. | Odrzucenie przez `FILTER_VALIDATE_INT` z kodem `400`, sesja bez zmian. | Komunikat: *„Identyfikator produktu oraz ilość muszą być liczbami całkowitymi.”*; sesja bez zmian. | `POST 400` |
| **Brak pola / brak zaznaczenia** | Wysłanie formularza bez zaznaczenia radio lub po usunięciu atrybutu `name` w Inspektorze. | Odrzucenie żądania z kodem `400`, komunikat o braku pól, sesja bez zmian. | Komunikat: *„Brak wymaganych pól formularza lub nieprawidłowy typ danych.”*; sesja bez zmian. | `POST 400` |
| **Przesłanie tablicy (`produkt[]`)** | Zmiana atrybutu w Inspektorze na `name="produkt[]"`. | Odrzucenie tablicy z kodem `400`, sesja bez zmian. | Żądanie odrzucone z kodem `400` i komunikatem błędu; sesja bez zmian. | `POST 400` |
| **Nieistniejący produkt (`99`)** | Zmiana `value` zaznaczonego radio w Inspektorze na `99`. | Odrzucenie żądania z kodem `400`, komunikat o nieistniejącym produkcie. | Komunikat: *„Wybrany produkt nie istnieje w katalogu.”*; sesja bez zmian. | `POST 400` |
| **Przekroczenie stanu (stan `1` i `0`)** | Wybór produktu ze stanem `1` (ilość `2`) oraz produktu ze stanem `0` (ilość `1`). | Odrzucenie obu prób z kodem `400` mimo mieszczącej się w limicie 1–5 ilości. | Komunikaty o przekroczeniu stanu (`1 szt.` oraz `0 szt.`); brak nadpisania sesji. | `POST 400` |
| **Nowa sesja i ochrona XSS** | Otwarcie w oknie prywatnym; tymczasowa nazwa produktu `<b>Test</b>` w `produkty.php`. | Brak wyboru w nowej sesji; tagi `<b>Test</b>` wyświetlone jako zwykły tekst. | Wyświetlono *„Brak zapisanego wyboru.”* oraz dosłowny tekst `<b>Test</b>`. | `GET 200` |
| **Zmiana limitu `MAX_ILOSC`** | Tymczasowa zmiana stałej `MAX_ILOSC` na `3` i próba wysłania ilości większej niż `3`. | Lista generuje opcje `1–3`, a większa wartość jest odrzucana z kodem `400`. | Komunikat: *„Ilość musi mieścić się w przedziale od 1 do 3.”* dla próby powyżej limitu. | `POST 400` |
| **Ścieżki i zasoby z Lab 3** | Przejście po podstronach (`index.html`, `html/kontakt.html`, `html/produkt.html`, `lab4.php`) i test `status.php`. | Poprawne ładowanie CSS, JS, obrazów i odpowiedź `200` z `status.php` bez błędów `404`. | Wszystkie style, skrypty i żądania działają poprawnie, brak błędów `404`. | `GET 200` |

---

## Odpowiedzi na pytania kontrolne

* **Gdzie znajdują się dane katalogu?**
  Wszystkie dane o produktach (ID, nazwy, kategorie i stany magazynowe) znajdują się w osobnym pliku `includes/produkty.php` w formie tablicy `$produkty`. Pozwala to oddzielić dane od reszty kodu aplikacji.

* **Co robi żądanie GET?**
  Żądanie `GET` odpowiada wyłącznie za wyświetlenie strony i ewentualne przefiltrowanie listy produktów po wybranej kategorii. Nie wprowadza żadnych zmian w sesji ani na serwerze.

* **Co robi żądanie POST?**
  Żądanie `POST` odbiera dane z formularza i sprawdza po kolei: obecność pól oraz ich typ tekstowy, poprawność liczb całkowitych, istnienie produktu w katalogu, a także czy ilość mieści się w przedziale od `1` do `MAX_ILOSC` i nie przekracza stanu magazynowego. Jeśli wszystko się zgadza, zapisuje wybór w sesji i przekierowuje przez `HTTP 303`, a w razie błędu zwraca kod `400` bez zapisywania zmian.

* **Kiedy zmienia się zawartość sesji (`$_SESSION`)?**
  Dane w `$_SESSION['ostatni_wybor']` zapisują się lub aktualizują tylko wtedy, gdy formularz `POST` przejdzie pomyślnie całą walidację. Filtrowanie przez `GET` oraz odrzucone próby `POST` nie wpływają na zapamiętany wybór.

* **Czym różni się `include` od `require_once`?**
  Gdy brakuje pliku, `require_once` przerywa działanie skryptu błędem krytycznym i pilnuje, by plik został wczytany tylko raz, natomiast `include` wyświetla jedynie ostrzeżenie, a skrypt wykonuje się dalej. Zastosowano `require_once` dla `includes/produkty.php`, ponieważ dane produktów są krytyczne dla działania katalogu, a `include` dla `includes/naglowek.php`, ponieważ odpowiada on wyłącznie za warstwę wyglądu.

---

## Źródła zdjęć

- Klawiatura: https://www.mediaexpert.pl/komputery-i-tablety/klawiatury-komputerowe/klawiatury/klawiatura-hyperx-alloy-origins-2-65-rgb
- Mysz: https://www.mediaexpert.pl/komputery-i-tablety/myszy-komputerowe/myszki-uniwersalne/mysz-razer-deathadder-essential-czarny
- Słuchawki: https://www.mediaexpert.pl/komputery-i-tablety/sluchawki-i-glosniki-komputerowe/sluchawki-z-mikrofonem/sluchawki-mad-dog-gh800-nauszne-dzwiek-przestrzenny