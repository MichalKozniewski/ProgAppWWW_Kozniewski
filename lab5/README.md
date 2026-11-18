# TechPunkt – Laboratorium 5 (PHP: Front Controller, szablony i multimedia)

Projekt sklepu internetowego **TechPunkt** zrealizowany w oparciu o wspólny szablon `index.php` (routing po parametrze `$_GET['idp']`), fragmenty podstron w katalogu `html/`, osadzone wideorecenzje w `html/filmy.html` oraz katalog produktów z obsługą formularzy i sesji w `lab4.php`.

## Instrukcja uruchomienia

1. Skopiuj katalog projektu (`lab5`) do folderu `htdocs/` w XAMPP.

2. Uruchom serwer **Apache** w panelu sterowania XAMPP.

3. Otwórz przeglądarkę i przejdź pod wybrany adres:

   * Strona główna: `http://localhost/lab5/index.php` (lub `http://localhost/lab5/index.php?idp=glowna`)

   * Kontakt: `http://localhost/lab5/index.php?idp=kontakt`

   * Szczegóły produktu: `http://localhost/lab5/index.php?idp=produkt`

   * Filmy (wideorecenzje): `http://localhost/lab5/index.php?idp=filmy`

   * Katalog produktów PHP (sesja): `http://localhost/lab5/lab4.php`

## Punkt odniesienia (weryfikacja kopii przed zmianami)

Przed wprowadzeniem zmian z Laboratorium 5 sprawdzono działanie kopii projektu z Lab 4 w przeglądarce oraz w zakładce **Network**:

* Filtrowanie kategorii w `lab4.php` metodą `GET` poprawnie zawężało tabelę produktów (`GET 200`).

* Zapis wyboru w formularzu (`POST`) wykonywał przekierowanie `POST 303` -> `GET 200` i zapamiętywał wybrany produkt w sesji po odświeżeniu strony.

* Przycisk *„Sprawdź serwer”* wysyłał żądanie `GET status.php` i wyświetlał odpowiedź `PHP działa` (`GET 200`).

## Struktura projektu

* `index.php` – główny szablon aplikacji (Front Controller). Zawiera wspólny układ HTML (`<head>`, nagłówek, tryb ciemny, zegar, wyszukiwarkę, menu nawigacyjne, kontener `<main>` i stopkę) oraz dobiera podstronę na podstawie `$_GET['idp']`.

* `html/` – fragmenty treści poszczególnych podstron (bez znaczników `<!doctype html>`, `<head>` i `<body>`):

  * `glowna.html` – animacje jQuery, test AJAX (`status.php`) oraz karty produktów.

  * `kontakt.html` – formularz kontaktowy z wyceną i walidacją w JS.

  * `produkt.html` – opis i specyfikacja techniczna klawiatury mechanicznej.

  * `filmy.html` – podstrona z 3 osadzonymi recenzjami wideo z YouTube (`<iframe>` bez autoodtwarzania).

* `lab4.php` – katalog produktów z filtrowaniem `GET`, zapisem `POST` (PRG) i sesją `$_SESSION`.

* `includes/produkty.php` – tablica produktów wczytywana przez `require_once`.

* `includes/naglowek.php` – nagłówek i nawigacja używane przez `lab4.php` (*uwaga architektoniczna:* menu w `naglowek.php` jest zapisane na stałe, więc przy dodaniu nowej podstrony do tablicy `$strony` w `index.php` należy zaktualizować również linki w `naglowek.php`).

* `status.php` – plik zwracający tekst `PHP działa` dla żądania AJAX.

* `css/style.css`, `js/main.js`, `js/lab3.js`, `vendor/jquery-4.0.0.min.js` – warstwa stylów i skryptów po stronie klienta.

## Pseudokod wyboru widoku (`index.php`)

1. Zdefiniuj tablicę `$strony` (białą listę dozwolonych widoków: `glowna`, `kontakt`, `produkt`, `filmy`) wraz z etykietami menu, tytułami `<title>` i ścieżkami do plików w `/html/`.

2. Ustaw `$err = 0`.

3. Odczytaj parametr `$_GET['idp']`:

   * Jeśli `idp` nie istnieje (`!isset`) lub jest pustym ciągiem (`''`) -> ustaw aktywny widok na `'glowna'`, przypisz ścieżkę i tytuł strony głównej.

   * W przeciwnym razie, jeśli `idp` jest tekstem (`is_string`) i istnieje jako klucz w tablicy `$strony` -> ustaw aktywny widok na `$_GET['idp']`, przypisz odpowiednią ścieżkę i tytuł.

   * W przeciwnym razie (nieznana wartość, np. `?idp=nieznana`, próba obejścia ścieżki `?idp=..%2Fstatus.php` lub tablica `?idp[]=filmy`) -> ustaw kod odpowiedzi `HTTP 404` (`http_response_code(404)`), ustaw `$err = 404` i tytuł błędu `404`.

4. Jeśli `$err === 0`, sprawdź czy plik widoku istnieje na dysku (`is_file`) oraz czy można go odczytać (`is_readable`):

   * Jeśli plik nie istnieje lub brak do niego dostępu -> ustaw kod odpowiedzi `HTTP 500` (`http_response_code(500)`), ustaw `$err = 500` i tytuł błędu `500`.

5. Wygeneruj wspólny szkielet dokumentu HTML (wstawiając dynamiczny `<title>` i oznaczając bieżącą stronę w menu atrybutem `aria-current="page"`).

6. Wewnątrz `<main>`:

   * Jeśli `$err === 0` -> dołącz plik widoku instrukcją `include`.

   * Jeśli `$err === 404` -> wyświetl komunikat `Nie znaleziono podstrony (błąd 404).` oraz link powrotu do `index.php`.

   * Jeśli `$err === 500` -> wyświetl ogólny komunikat `Błąd serwera (500) – nie można wczytać widoku podstrony.` (bez ujawniania ścieżki systemowej) oraz link powrotu.

## Pseudokod obsługi sesji, formularza POST i GET (`lab4.php`)

### Część 1: Poprawne żądanie

1. Rozpocznij sesję (`session_start()`) na początku pliku i wczytaj `includes/produkty.php` przez `require_once`.

2. Ustaw stałą `MAX_ILOSC = 5` oraz pusty komunikat błędu `$komunikat_bledu_post = ''`.

3. Dla żądania `POST`:

   * Sprawdź przez `isset()` oraz `is_string()`, czy pola `produkt` i `ilosc` istnieją i są tekstem.

   * Przefiltruj obie wartości przez `FILTER_VALIDATE_INT` (`!== false`).

   * Odszukaj produkt o podanym `id` w katalogu `$produkty` i sprawdź, czy `ilosc` mieści się w przedziale `1..MAX_ILOSC` oraz nie przekracza `stan`.

   * Zapisz wybór w `$_SESSION['ostatni_wybor']`, wykonaj przekierowanie `HTTP 303` (`header('Location: lab4.php', true, 303)`) i zakończ skrypt przez `exit`.

4. Dla żądania `GET`:

   * Wyświetl zapisany w sesji wybór (lub informację o jego braku).

   * Parametr `$_GET['kategoria']` filtruje wyłącznie wyświetlaną listę produktów i nie zmienia zawartości sesji.

### Część 2: Błędne żądanie

1. Jeśli dowolny warunek walidacji `POST` nie zostanie spełniony (brak pola, tablica, ułamek `2.5`, tekst `2abc`, nieistniejące `id`, ilość `0` lub `6`, przekroczenie stanu magazynowego):

   * Ustaw kod odpowiedzi `HTTP 400 Bad Request` (`http_response_code(400)`).

   * Zapisz komunikat błędu w `$komunikat_bledu_post` i nie wykonuj przekierowania.

   * Nie nadpisuj `$_SESSION['ostatni_wybor']`.

   * Wyrenderuj stronę z kodem `400` i wyświetl komunikat błędu przy formularzu (`htmlspecialchars()`).

## Wyniki prób testowych – Laboratorium 5 (Panel Network)

**1. Adres domyślny, pusty `idp` i nawigacja w menu (`GET 200`)**
Przetestowano wejście na adres `index.php`, `index.php?idp=` oraz kolejne przejścia po linkach menu (`Strona Główna`, `Kontakt`, `Produkt`, `Filmy`). Oczekiwano załadowania strony głównej dla braku `idp` i pustego parametru, poprawnego wczytania wszystkich widoków ze wspólnym szablonem, oznaczenia aktywnego linku przez `aria-current="page"` oraz dynamicznej zmiany znacznika `<title>` na każdej podstronie (np. `TechPunkt – Kontakt`, `TechPunkt – Filmy`). W rzeczywistości wszystkie widoki otworzyły się poprawnie ze stylami CSS, skryptami JS i obrazami, aktywny link otrzymał `aria-current="page"`, a tytuł karty przeglądarki zmieniał się odpowiednio dla każdego widoku (`TechPunkt – Strona główna`, `TechPunkt – Kontakt`, `TechPunkt – Produkt`, `TechPunkt – Filmy`) ze statusem `GET 200`.

**2. Nieznany `idp` oraz tablica w parametrze URL (`GET 404`)**
Ręcznie wpisano w pasku adresu kolejno `index.php?idp=nieznana` oraz `index.php?idp[]=filmy`. Oczekiwano odrzucenia obu żądań z kodem `HTTP 404` oraz wyświetlenia komunikatu błędu z linkiem powrotu bez dołączania żadnego pliku. Zgodnie z oczekiwaniem serwer zwrócił status `GET 404` i wyświetlił komunikat `Nie znaleziono podstrony (błąd 404).` wraz z linkiem powrotu na stronę główną.

**3. Próba obejścia ścieżki – Path Traversal (`GET 404`)**
Wpisano w pasku adresu `index.php?idp=..%2Fstatus.php`. Oczekiwano odrzucenia parametru spoza białej listy `$strony` z kodem `404` i niedopuszczenia do dołączenia pliku `status.php`. W panelu Network zarejestrowano odpowiedź `GET 404` z komunikatem `Nie znaleziono podstrony (błąd 404).`, a zawartość `status.php` nie została dołączona ani wykonana.

**4. Brak pliku widoku na dysku (`GET 500`)**
Tymczasowo zmieniono nazwę pliku `html/filmy.html` na dysku i wywołano `index.php?idp=filmy`, a po teście przywrócono właściwą nazwę pliku. Oczekiwano wykrycia braku pliku przez `is_file()`, zwrotu kodu `HTTP 500` oraz komunikatu błędu bez ujawniania ścieżki systemowej serwera. Rzeczywiście zwrócono status `GET 500` i komunikat `Błąd serwera (500) – nie można wczytać widoku podstrony.` (bez żadnych ścieżek systemowych), a po przywróceniu nazwy pliku podstrona ponownie działa ze statusem `GET 200`.

**5. Strona główna i komunikacja AJAX (`GET 200`)**
Na stronie głównej (`index.php?idp=glowna`) kliknięto przycisk *„Sprawdź serwer”*. Oczekiwano wysłania żądania asynchronicznego do `status.php` i wyświetlenia odpowiedzi bez przeładowania strony. W panelu Network pojawiło się żądanie `GET status.php` ze statusem `200`, a w kontenerze statusu wyświetlono tekst `PHP działa`.

**6. Katalog i sesja po migracji (`POST 303` -> `GET 200`)**
Wejście do `lab4.php` z poziomu menu, użycie filtra kategorii, zapis wyboru produktu i ilości (`POST 303` -> `GET 200`), następnie przejście na stronę główną oraz do podstrony *Filmy* i ponowny powrót do katalogu. Oczekiwano poprawnego filtrowania, zapisu wyboru w `$_SESSION['ostatni_wybor']` oraz zachowania zapisanego stanu mimo nawigacji między podstronami `index.php`. Filtr poprawnie zawęził tabelę (`GET 200`), zapis wykonał przekierowanie `POST 303` -> `GET 200`, a po powrocie ze strony głównej i *Filmów* katalog nadal wyświetlał zapamiętany produkt i ilość.

**7. Podstrona `filmy`, widok mobilny `360 px` i nawigacja klawiaturą (`GET 200`)**
Otwarto `index.php?idp=filmy`, sprawdzono zachowanie odtwarzaczy YouTube, przełączono podgląd responsywny na szerokość `360 px` oraz przetestowano przechodzenie po elementach klawiszem `Tab`. Oczekiwano braku autoodtwarzania filmów, poprawnego skalowania ramek bez poziomego paska przewijania przy `360 px` oraz pełnej dostępności odnośników z klawiatury. Filmy nie uruchamiają się automatycznie, wszystkie trzy ramki mieszczą się w szerokości `360 px` bez poziomego scrolla, a fokus klawisza `Tab` przechodzi płynnie po odtwarzaczach i linkach bezpośrednich do YouTube (`GET 200`).

## Wyniki prób testowych – Katalog i walidacja (`lab4.php`)

**Filtrowanie GET – poprawne i błędne (`GET 200`)**
Wybrano z listy kategorię `ksiazki`, a następnie ręcznie wpisano w URL parametr tablicowy `?kategoria[]=ksiazki`. Oczekiwano zawężenia listy dla poprawnej kategorii oraz wyświetlenia ostrzeżenia i pełnej listy bez naruszania sesji dla błędnego parametru. Dla `ksiazki` tabela wyświetliła wyłącznie książki, natomiast dla tablicy pojawił się komunikat ostrzegawczy i pełna lista produktów przy nienaruszonym stanie sesji.

**Ilość poza dozwolonym zakresem `1..5` (`POST 400`)**
W narzędziach deweloperskich zmieniono atrybut `value` opcji ilości kolejno na `0` oraz na `6` i wysłano formularz. Oczekiwano odrzucenia obu prób kodem `HTTP 400`, komunikatu o dopuszczalnym przedziale oraz zachowania dotychczasowej sesji. W obu przypadkach serwer zwrócił `POST 400` i komunikat *„Ilość musi mieścić się w przedziale od 1 do 5.”* bez nadpisywania sesji.

**Błędny format danych liczbowych (`POST 400`)**
Zmieniono wartość pola ilości w Inspektorze kolejno na ułamek `2.5` oraz tekst `2abc`. Oczekiwano odrzucenia danych przez filtr `FILTER_VALIDATE_INT` z kodem `400` i brakiem zmian w sesji. Serwer odrzucił oba żądania statusem `POST 400` i wyświetlił komunikat *„Identyfikator produktu oraz ilość muszą być liczbami całkowitymi.”*.

**Brak wymaganego pola lub przesłanie tablicy (`POST 400`)**
Wysłano formularz bez zaznaczenia żadnego produktu, a następnie po zmianie nazwy pola w Inspektorze na `name="produkt[]"`. Oczekiwano odrzucenia żądania kodem `400` i komunikatu o braku lub błędnym typie pól. W obu próbach zwrócono status `POST 400` oraz komunikat *„Brak wymaganych pól formularza lub nieprawidłowy typ danych.”* bez modyfikacji sesji.

**Nieistniejący identyfikator produktu (`POST 400`)**
Zmieniono w Inspektorze wartość `value` zaznaczonego przycisku radio na `99` i wysłano formularz. Oczekiwano odrzucenia żądania kodem `400` i komunikatu o braku produktu w katalogu. Serwer zwrócił `POST 400` z komunikatem *„Wybrany produkt nie istnieje w katalogu.”*, pozostawiając sesję bez zmian.

**Przekroczenie dostępnego stanu magazynowego (`POST 400`)**
Próbowano zamówić `2` sztuki produktu ze stanem `1` oraz `1` sztukę produktu ze stanem `0`. Oczekiwano odrzucenia obu prób kodem `400` mimo mieszczącej się w limicie `1..5` ilości. Wyświetlono komunikaty o przekroczeniu dostępnego stanu magazynowego ze statusem `POST 400`, a sesja nie została nadpisana.

**Nowa sesja i ochrona przed XSS (`GET 200`)**
Otwarto katalog w oknie prywatnym przeglądarki, a w pliku `includes/produkty.php` tymczasowo wpisano nazwę produktu zawierającą znaczniki `<b>Test</b>`. Oczekiwano informacji o braku zapisanego wyboru w nowej sesji oraz wyrenderowania znaczników HTML jako zwykłego tekstu. Wyświetlono komunikat *„Brak zapisanego wyboru.”* oraz dosłowny ciąg `<b>Test</b>` zamiast pogrubionego tekstu.

**Zmiana stałej limitu `MAX_ILOSC` (`POST 400`)**
Tymczasowo zmieniono wartość stałej `MAX_ILOSC` na `3` i próbowano przesłać ilość większą niż `3`. Oczekiwano wygenerowania listy opcji `1..3` i odrzucenia wyższej wartości kodem `400`. Lista poprawnie ograniczyła opcje do `1..3`, a próba wysłania wyższej wartości została odrzucona statusem `POST 400` z komunikatem *„Ilość musi mieścić się w przedziale od 1 do 3.”*.

## Odpowiedzi na pytania kontrolne

* **Jak działa Front Controller w `index.php`?**
  Plik `index.php` jest wspólnym szablonem strony. Odbiera parametr `$_GET['idp']`, sprawdza go na białej liście `$strony`, weryfikuje istnienie pliku widoku na serwerze i wstawia odpowiedni fragment HTML z katalogu `html/` wewnątrz `<main>`.

* **Dlaczego używamy białej listy `$strony` zamiast bezpośredniego wczytywania `$_GET['idp']`?**
  Bezpośrednie przekazanie parametru z URL do `include` umożliwiłoby atak *Path Traversal* / *LFI* (np. `?idp=..%2Fstatus.php` lub odczyt plików spoza katalogu projektu). Biała lista dopuszcza wyłącznie zdefiniowane klucze.

* **Gdzie znajdują się dane katalogu?**
  Wszystkie dane o produktach (ID, nazwy, kategorie i stany magazynowe) znajdują się w osobnym pliku `includes/produkty.php` w formie tablicy `$produkty`. Pozwala to oddzielić dane od logiki i widoku.

* **Co robi żądanie GET, a co POST w `lab4.php`?**
  Żądanie `GET` odpowiada wyłącznie za wyświetlenie strony i filtrowanie listy produktów po kategorii. Żądanie `POST` waliduje dane formularza, zapisuje poprawny wybór w `$_SESSION['ostatni_wybor']` i przekierowuje przez `HTTP 303` (PRG), a w razie błędu zwraca `400`.

* **Czym różni się `include` od `require_once` i gdzie ich użyto?**
  Gdy brakuje pliku, `require_once` przerywa działanie skryptu błędem krytycznym i pilnuje, by plik został wczytany tylko raz, natomiast `include` wyświetla jedynie ostrzeżenie, a skrypt wykonuje się dalej. W projekcie zastosowano:

  * `require_once` dla `includes/produkty.php` w `lab4.php`, ponieważ dane produktów są niezbędne do działania logiki i walidacji katalogu;

  * `include` dla `includes/naglowek.php` (w `lab4.php`) oraz dla fragmentów widoków z katalogu `html/` (w `index.php`), ponieważ odpowiadają one za warstwę prezentacji.

## Źródła multimediów i zdjęć

* **Zdjęcia produktów:**

  * Klawiatura: https://www.mediaexpert.pl/komputery-i-tablety/klawiatury-komputerowe/klawiatury/klawiatura-hyperx-alloy-origins-2-65-rgb

  * Mysz: https://www.mediaexpert.pl/komputery-i-tablety/myszy-komputerowe/myszki-uniwersalne/mysz-razer-deathadder-essential-czarny

  * Słuchawki: https://www.mediaexpert.pl/komputery-i-tablety/sluchawki-i-glosniki-komputerowe/sluchawki-z-mikrofonem/sluchawki-mad-dog-gh800-nauszne-dzwiek-przestrzenny

* **Filmy wideo (YouTube):**

  * *Najlepsze klawiatury mechaniczne do 250 zł* (Komputronik Gaming): https://www.youtube.com/watch?v=5P4zPoA80UA

  * *Najlepsze myszki gamingowe do 400 zł* (Komputronik Gaming): https://www.youtube.com/watch?v=HXdU_fcZRpA

  * *Recenzja myszki Razer DeathAdder Essential* (Radojones): https://www.youtube.com/watch?v=6ocS3DZloFw