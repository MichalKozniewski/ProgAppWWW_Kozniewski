Przglądark Firefox Version 158.0.1 (64-bit)
Srodowisko: Server lokalny Python http://localhost:8000/
1.
Hipoteza: Strona sprawdzona w Nu HTML Checker nie będzie zawierać błędów
Każdy z plikow nie zawiera żadnych błędów po sprawdzeniu w Nu HTML Checker.
Hipoteza: Po wyłączeniu css nagłówki będą sie wyświetlać w odpowiedzniej kolejności
odpowiedz: a po wyłączeniu css nagłówki wyświetlaja sie normalnie
2.
Hipoteza strona w rodzielczości 375px
odpowiedź: formularz mieści sie w jednej kolumnie nie rozicaga sie
hipoteza: strona w 1280 px zachowa 3 kolumny
odpowiedź: strona zachowuje proporcje i przechodzi w 3 kolumny
3.
Hipoteza: Po stronie będzie możan poruszać się używajac wyłacznie klawiatura przyciskami tab shift+tab oraz enterem
Odpowiedź: można poruszać sie po stronie używając tylko klawiatury oraz enter otwiera zaznaczone linki a link jest odpowiednio oznaczony, fokus odpowiedznio znajduje sie na każdym elemencie.
hipoteza: kliknięcie w napis etykiey label przenosi kursor prosto do pola tekstowego/
odpowiedź: Tak klikniecie przenosi kursor
4.
Hipoteza: Pusty Formularz
odpowiedź: Strona nie pozwala na przesłanie formularza
hipoteza: zły adres mail
odpowiedź: Strona blokuje przesłanie formularza
hipoteza: wpisanie ilosći poza zakeresem czyli 0 i 6
odpowiedź: Strona blokuje przesłanie formularza
hipoteza: mniej niż 10 znakow w polu testowym
odpowiedź: strona blokuje wysłanie formularza
Hipoteza Poprawne Dane
odpowiedź formularz jest wysłany a to jest jego wynik
email=huiscbahcijvbuhijpsacoasoicbvuh9%@gmail.com
produkt=klawiatura
ilosc=3
wiadomosc=21435689342578
http://localhost:8000/kontakt.html?email=huiscbahcijvbuhijpsacoasoicbvuh9%40gmail.com&produkt=klawiatura&ilosc=3&wiadomosc=21435689342578

5.
Hipoteza:
mail nie zostanie przesłane do adresie
efekt:
http://localhost:8000/kontakt.html?produkt=sluchawki&ilosc=4&wiadomosc=12312412312312
Po usunięciu atrybutu name z pola e-mail dane z tego pola nie pojawiły się w adresie URL. Wysłane zostały tylko pola, które miały name (produkt, ilosc, wiadomosc). Przeglądarka używa name jako nazwy parametru w zapytaniu, więc pole bez name nie jest wysyłane, nawet jeśli ma id i label. Walidacja nadal działała, bo required nie zależy od name.
Atrybut id służy do połączenia pola z etykietą (label for="email") oraz do odwoływania się do elementu w CSS i JavaScripcie. Przy wysyłaniu formularza nie jest używany.
Po sprawdzeniu przywróciłem atrybut name="email".
Poprawka: name przywrócony, po tym e-mail znowu pojawia się w adresie.
oto metoda GET przy poprawnym formularzu:
GET /kontakt.html?email=sadibsaidbadbadiu%40gmail.com&produkt=klawiatura&ilosc=2&wiadomosc=12365643576980sad HTTP/1
Host: localhost:8000
