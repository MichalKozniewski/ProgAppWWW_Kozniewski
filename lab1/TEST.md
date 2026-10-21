Przglądark Firefox Version 158.0.1 (64-bit)
Srodowisko: Server lokalny Python http://localhost:8000/
1.
Hipoteza: Strona nie zwróci błędów
Każdy z plikow nie zawiera żadnych błędów po sprawdzeniu w Nu HTML Checker a po wyłączeniu css nagłówki wyświetlaja sie normalnie
2.
Hipoteza strona poniżej 768px zostawi 1 kolumne a powyżej 3
poniżej 768px tworzy sie 1 kolumna a po wyżej robią sie 3 kolumny
3.
Hipoteza: poruszanie sie po stronie będzie możliwe z użyciem samej klawiatury
Możliwe jest poruszanie sie po stronie z użyciem klawiatury
4.
Hipoteza: formularz niepozwoli wysłać błędnych danych do adresu:
formularz niepozwala wysłać błędnego maila, ilości poz 1-5 oraz wiadomości krótszej niż 10 znaków a wysyłając dane pojawiają sie w adresie jak widać poniżej
http://localhost:8000/kontakt.html?email=osaidbuahjfibuahf%40aoidbisajsan.com&produkt=klawiatura&ilosc=4&wiadomosc=123456782345689

5.
Hipoteza:
mail nie zostanie przesłane do adresie
efekt:
http://localhost:8000/kontakt.html?produkt=sluchawki&ilosc=4&wiadomosc=12312412312312
niezapisany mail w adresie
oto metoda GET
GET /kontakt.html?email=sadibsaidbadbadiu%40gmail.com&produkt=klawiatura&ilosc=2&wiadomosc=12365643576980sad HTTP/1
Host: localhost:8000