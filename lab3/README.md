# TechPunkt – katalog produktów
## Środowisko
Przeglądarka i wersja: Mozilla Firefox 158.0.1 (64-bit).

Port Apache: Serwer Apache działa na domyślnym porcie 80, więc strona jest dostępna bezpośrednio pod adresem http://localhost/lab3/

bibliotekę jQuery 4.0.0 zweryfikowano w konsoli: `jQuery.fn.jquery`

## Instrukcja uruchomienia

1. Skopiuj pliki projektu do katalogu `htdocs/lab3` w ścieżce instalacji serwera XAMPP (np. `C:\xampp\htdocs\lab3`).
2. Uruchom moduł **Apache** w panelu kontrolnym XAMPP Control Panel.
3. Strona jest dostępna pod adresem: http://localhost/lab3/ (lub `http://localhost:<PORT>/lab3/`, jeśli port serwera Apache został zmieniony w pliku `httpd.conf`).

## Pseudokody

### Przycisk A (Animacja i reset kolejki)
```text
ZMIENNA isExpanded = false

ON CLICK Przycisk_A:
    isExpanded = NOT isExpanded
    Ustaw attr("aria-pressed", isExpanded)
    
    Zatrzymaj aktualne i zaległe animacje: .stop(true, false)
    
    JEŚLI isExpanded == true:
        Animuj rozmiar do (240px x 130px) w czasie 300ms
    INACZEJ:
        Animuj rozmiar do bazy (160px x 90px) w czasie 300ms
```
### Przycisk B (Logika Hover + Focus)
```text
ZMIENNE: isHovered = false, isFocused = false

ON ('mouseenter' OR 'mouseleave' OR 'focus' OR 'blur') Przycisk_B (zdarzenie e):
    JEŚLI e.type == 'mouseenter': isHovered = true
    JEŚLI e.type == 'mouseleave': isHovered = false
    JEŚLI e.type == 'focus':      isFocused = true
    JEŚLI e.type == 'blur':       isFocused = false
    
    ZMIENNA isExpanded2 = isHovered OR isFocused
    
    ZMIENNA width  = JEŚLI isExpanded2 TO 220 INACZEJ baseWidth  (160)
    ZMIENNA height = JEŚLI isExpanded2 TO 120 INACZEJ baseHeight (90)
    
    Przycisk_B.stop(true, false).animate({
        width: width + "px",
        height: height + "px"
    }, 300)
```
### Przycisk C (Limit kroków, zapobieganie spamowaniu i reset)
```text
ZMIENNE: krok = 0
STAŁE: maxKroki = 5, addWidth = 20, addHeight = 10

ON CLICK Przycisk_C:
    JEŚLI Przycisk_C jest w trakcie animacji (:animated) LUB krok >= maxKroki:
        PRZERWIJ (return)
    
    krok = krok + 1
    
    ZMIENNA targetWidth  = baseWidth + (krok * addWidth)
    ZMIENNA targetHeight = baseHeight + (krok * addHeight)
    
    Przycisk_C.stop(true, false).animate({
        width: targetWidth + "px",
        height: targetHeight + "px"
    }, 300)
    
    Zaktualizuj tekst status-C: "Kroki: " + krok + " z " + maxKroki
```
### Reset
```text
ON CLICK Przycisk_Reset:
    Przycisk_C.stop(true, false).css({
        width: baseWidth + "px",
        height: baseHeight + "px"
    })
    
    krok = 0
    Zaktualizuj tekst status-C: "Kroki: " + krok + " z " + maxKroki
    
    Przycisk_A.stop(true, false).css({
        width: baseWidth + "px",
        height: baseHeight + "px"
    })
    
    isExpanded = false
    Ustaw attr('aria-pressed', false) dla Przycisk_A
```
### Obsługa prefers-reduced-motion
```text
ZMIENNA mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

JEŚLI mediaQuery.matches TO:
    Ustaw $.fx.off = true
```
### Obsługa ajax
```text
ZMIENNE ELEMENTÓW:
    $ajaxSection  = $('#ajax')
    $checkBtn     = $ajaxSection.find('#sprawdz-serwer')
    $serverStatus = $ajaxSection.find('#wynik-serwer')

ON CLICK $checkBtn:
    $checkBtn.prop('disabled', true)
    $serverStatus.text('Ładowanie...')
    
    WYKONAJ $.ajax({
        url: 'status.php',
        method: 'GET',
        dataType: 'text',
        timeout: 5000
    })
    .done(FUNKCJA(response):
        $serverStatus.text(response)
    )
    .fail(FUNKCJA(jqXHR, textStatus):
        JEŚLI textStatus === 'timeout':
            $serverStatus.text('Błąd: Przekroczono czas oczekiwania na odpowiedź serwera (5s).')
        INACZEJ JEŚLI jqXHR.status === 404:
            $serverStatus.text('Błąd 404: Nie znaleziono pliku status.php.')
        INACZEJ:
            $serverStatus.text('Wystąpił błąd połączenia z serwerem.')
    )
    .always(FUNKCJA():
        $checkBtn.prop('disabled', false)
    )
```

## Testy Animacji

### 1. Szybkie kliknięcia A
- **Co zrobiłem:** Reset i od razu 10 szybkich klików w Przycisk A. Po zakończeniu klikania odczekałem chwilę i patrzyłem co się dzieje.
- **Oczekiwano:** Przycisk ma wrócić do bazy (160 x 90 px) i nie odtwarzać zaległej kolejki animacji po zakończeniu klikania.
- **Wynik:** Przycisk wraca do 160 x 90 px. Po zakończeniu klikania nic dodatkowego się nie kolejkuje i nie animuje.
- **Wniosek:** Dopisanie .stop(true, false) załatwiło sprawę – usuwa kolejkę i nie buforuje kliknięć.

### 2. Kursor i fokus B
- **Co zrobiłem:** Najechałem na Przycisk B, potem fokus Tabem. Zjechałem myszką poza przycisk (fokus został) i dopiero na koniec dałem blur.
- **Oczekiwano:** Zjechanie kursorem przy aktywnym fokusie nie powinno zmniejszać obiektu. Dopiero utrata obu stanów wraca go do bazy (160 x 90 px).
- **Wynik:** Zjechanie myszką nie zmniejsza przycisku póki trzyma go fokus. Dopiero po utracie obu na raz wraca do wyjściowych wymiarów.
- **Wniosek:** Warunek `isHovered || isFocused` w JS działa jak trzeba i ładnie pilnuje rozmiaru.

### 3. Limit i reset C
- **Co zrobiłem:**
  - Próba 1 (szybkie klikanie): Wykonałem reset, a następnie kliknąłem Przycisk C 5 razy w ciągu 1 s.
  - Próba 2 (klikanie z odstępem): Wykonałem reset i kliknąłem Przycisk C 7 razy z odstępami min. 0,5 s (czekając na zakończenie każdej animacji). Na koniec wcisnąłem "Resetuj A i C" w trakcie trwania animacji.
- **Oczekiwano:**
  - W próbie 1: kliknięcia w trakcie animacji zostają zignorowane, a licznik wzrasta o wartość mniejszą niż 5.
  - W próbie 2: po 5 krokach przycisk osiąga max 260 x 140 px, a 6. i 7. kliknięcie nie zmienia wymiarów ani licznika. Reset w trakcie animacji natychmiast przywraca stan początkowy.
- **Wynik:**
  - W próbie 1: po 5 szybkich kliknięciach licznik wskazał "Kroki: 2 z 5", co potwierdza ignorowanie klików w trakcie ruchu.
  - W próbie 2: po 5 krokach przycisk osiągnął 260 x 140 px, a 6. i 7. klik nic nie zmieniły. Wciśnięcie "Reset" podczas animacji zatrzymało ruch, przywróciło wymiary do bazy i wyzerowało licznik do 0.
- **Wniosek:** Blokada .is(":animated") odsiewa kliknięcia podczas trwania animacji, a warunek limitu kroków powstrzymuje rozrost powyżej 260 x 140 px.

### 4. Klawiatura
- **Co zrobiłem:** Przechodziłem po stronie klawiszem Tab oraz aktywowałem elementy przy użyciu Entera i Spacji.
- **Oczekiwano:** Klawisz Tab przenosi fokus kolejno na Przyciski A, B, C oraz Reset z widocznym wyróżnieniem (obrysem). Enter i Spacja wyzwalają akcje przycisków.
- **Wynik:** Tab przechodzi kolejno po A, B, C i Reset. Zaznaczony element ma widoczny obrys fokusa. Enter i Spacja zmieniają stan przycisków A, C oraz wyzwalają Reset.
- **Wniosek:** Interfejs pozwala na kompletną nawigację i obsługę zdarzeń wyłącznie za pomocą klawiatury.

### 5. Ograniczenie ruchu
- **Co zrobiłem:** W Firefoksie ustawiłem w about:config `ui.prefersReducedMotion = 1` i odświeżyłem stronę (F5). Sprawdziłem w konsoli wartość `$.fx.off` (zwróciło `true`), po czym przeklikałem przyciski A, B i C (w tym 6. kliknięcie w C) oraz sprawdziłem atrybuty `aria-pressed`.
- **Oczekiwano:** Zmiany rozmiaru przycisków zachodzą natychmiast. Atrybuty `aria-pressed`, licznik kroków oraz blokada maksymalnego rozmiaru działają bez zmian.
- **Wynik:** Zmiana rozmiaru następuje natychmiastowo bez puszczania animacji powiększania/zmniejszania. Atrybut `aria-pressed` przełącza się poprawnie (true/false) w Przycisku A, licznik C nalicza kroki do 5, a 6. kliknięcie nie powiększa obiektu. Przy `$.fx.off = true` warunek `.is(":animated")` nie blokuje kliknięć, więc limit zapewnia `krok >= maxKroki`.
- **Wniosek:** Wyłączenie animacji w przeglądarce skutkuje natychmiastową zmianą wymiarów.

## Testy AJAX

### 1. Prawidłowa odpowiedź (200 OK)
- **Co zrobiłem:** Kliknąłem przycisk `$checkBtn` (`#sprawdz-serwer`) przy uruchomionym serwerze XAMPP z plikiem `status.php` oraz otwartą zakładką Network w narzędziach deweloperskich.
- **Oczekiwano:** Przycisk zostaje zablokowany, w tekście `#wynik-serwer` pojawia się "Ładowanie...", po czym funkcja `.done()` wpisuje w ten obszar treść odpowiedzi z serwera ("PHP działa"), a `.always()` odblokowuje przycisk. W zakładce Network widoczne jest zapytanie z metodą GET, kodem 200 i odpowiedzią "PHP działa".
- **Wynik:** W trakcie żądania widoczny był napis "Ładowanie...", przycisk był nieaktywny, a po powrocie odpowiedzi pokazał się napis "PHP działa". Przycisk natychmiast się odblokował. W zakładce Network potwierdziłem metodę GET, status 200 OK oraz treść odpowiedzi "PHP działa".
- **Wniosek:** Metoda `$.ajax()` poprawnie wykonuje zapytanie GET i aktualizuje drzewo DOM poprzez `.done()`.

### 2. Obsługa błędu (404 Not Found)
- **Co zrobiłem:** Zmieniłem nazwę pliku `status.php` na `status_old.php` w katalogu `htdocs/lab3`, kliknąłem `#sprawdz-serwer` obserwując zakładkę Network, a po sprawdzeniu wyniku przywróciłem poprawną nazwę pliku (`status.php`) i kliknąłem ponownie.
- **Oczekiwano:** Brak pliku wyzwoli gałąź `.fail()`. W zakładce Network pojawi się kod statusu 404, a warunek `jqXHR.status === 404` wstawi tekst "Błąd 404: Nie znaleziono pliku status.php.". W sekcji `.always()` przycisk zostanie odblokowany. Kolejne kliknięcie po przywróceniu pliku obsłuży `.done()`.
- **Wynik:** W zakładce Network zarejestrowano odpowiedź z kodem 404. W obszarze `#wynik-serwer` pojawił się komunikat "Błąd 404: Nie znaleziono pliku status.php.". Przycisk odblokował się od razu. Po przywróceniu nazwy `status.php` i ponownym kliknięciu pojawił się napis "PHP działa" ze statusem 200.
- **Wniosek:** Warunek wewnątrz `.fail()` prawidłowo rozróżnia kod statusu 404 zgłoszony w panelu Network, a `.always()` dba o zdjęcie blokady `disabled` bez względu na wynik żądania.

### 3. Wolna sieć i obsługa przekroczenia czasu (Timeout / Slow network)
- **Co zrobiłem:**
  - Próba A (wielokrotne klikanie): W zakładce Network w przeglądarce Firefox wybrałem profil ograniczenia prędkości "Regular 2G" i kilkukrotnie, szybko kliknąłem `#sprawdz-serwer`.
  - Próba B (timeout): Na czas testu w pliku `status.php` dopisałem `sleep(6);` (dłużej niż parametr `timeout: 5000` w `$.ajax()`). Po przeprowadzeniu testu usunąłem `sleep(6);` z `status.php`, przywracając plik do czystej postaci zgodnej z instrukcją PDF.
- **Oczekiwano:**
  - W próbie A: po pierwszym kliknięciu przycisk dostaje `disabled = true`, więc kolejne kliknięcia nie generują nowych zapytań w zakładce Network.
  - W próbie B: po 5 sekundach wyzwoli się `.fail()` z parametrem `textStatus === 'timeout'` i pojawi się tekst "Błąd: Przekroczono czas oczekiwania na odpowiedź serwera (5s).".
- **Wynik:**
  - W próbie A: przycisk natychmiast poszedł w `disabled`, w zakładce Network zarejestrowano dokładnie 1 żądanie XHR mimo wielokrotnego klikania.
  - W próbie B: dokładnie po 5 sekundach status zmienił się na "Błąd: Przekroczono czas oczekiwania na odpowiedź serwera (5s).", po czym przycisk się odblokował.
- **Wniosek:** Blokada `prop('disabled', true)` skutecznie zapobiega wielokrotnym wysyłaniom żądań, a parametr `timeout: 5000` w `$.ajax()` zabezpiecza aplikację przed zawieszeniem.

### 4. Brak przeładowania strony
- **Co zrobiłem:** Wyczyściłem dziennik zdarzeń w zakładce Network narzędzi deweloperskich i kliknąłem `#sprawdz-serwer`.
- **Oczekiwano:** Dokument HTML nie jest przeładowywany (brak odświeżenia karty), zapytanie pojawia się w zakładce Network jako XHR.
- **Wynik:** Strona nie przeładowała się. W zakładce Network zarejestrowano pojedyncze żądanie XHR. Aktualizacja treści `#wynik-serwer` nastąpiła bez utraty stanu pozostałych elementów strony.
- **Wniosek:** Żądanie wykonuje się całkowicie asynchronicznie.

## Źródła zdjęć
 
- Klawiatura: https://www.mediaexpert.pl/komputery-i-tablety/klawiatury-komputerowe/klawiatury/klawiatura-hyperx-alloy-origins-2-65-rgb
- Mysz: https://www.mediaexpert.pl/komputery-i-tablety/myszy-komputerowe/myszki-uniwersalne/mysz-razer-deathadder-essential-czarny
- Słuchawki: https://www.mediaexpert.pl/komputery-i-tablety/sluchawki-i-glosniki-komputerowe/sluchawki-z-mikrofonem/sluchawki-mad-dog-gh800-nauszne-dzwiek-przestrzenny