<?php
session_start();

require_once __DIR__ . '/includes/produkty.php';

define('MAX_ILOSC', 5);

$tytul = "Katalog Produktów TechPunkt (PHP)";
$grupa = "GRUPA-404-PAW";
$komunikat_bledu_post = '';

function znajdz_produkt(array $produkty, int $id): ?array {
    foreach ($produkty as $p) {
        if ($p['id'] === $id) {
            return $p;
        }
    }
    return null;
}

$dozwolone = ['wszystkie', 'ksiazki', 'akcesoria'];
$wybrana_kategoria = 'wszystkie';
$komunikat_filtra = '';

if (isset($_GET['kategoria'])) {
    if (is_string($_GET['kategoria']) && in_array($_GET['kategoria'], $dozwolone, true)) {
        $wybrana_kategoria = $_GET['kategoria'];
    } else {
        $komunikat_filtra = 'Nieznana kategoria lub nieprawidłowy format parametru. Wyświetlono pełną listę.';
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $poprawny = true;

    if (!isset($_POST['produkt']) || !is_string($_POST['produkt']) || 
        !isset($_POST['ilosc']) || !is_string($_POST['ilosc'])) {
        $poprawny = false;
        $komunikat_bledu_post = 'Brak wymaganych pól formularza lub nieprawidłowy typ danych.';
    } else {
        $produkt_id = filter_var($_POST['produkt'], FILTER_VALIDATE_INT);
        $ilosc = filter_var($_POST['ilosc'], FILTER_VALIDATE_INT);

        if ($produkt_id === false || $ilosc === false) {
            $poprawny = false;
            $komunikat_bledu_post = 'Identyfikator produktu oraz ilość muszą być liczbami całkowitymi.';
        }
    }

    $produkt = null;
    if ($poprawny) {
        $produkt = znajdz_produkt($produkty, $produkt_id);
        if ($produkt === null) {
            $poprawny = false;
            $komunikat_bledu_post = 'Wybrany produkt nie istnieje w katalogu.';
        }
    }

    if ($poprawny) {
        if ($ilosc < 1 || $ilosc > MAX_ILOSC) {
            $poprawny = false;
            $komunikat_bledu_post = 'Ilość musi mieścić się w przedziale od 1 do ' . MAX_ILOSC . '.';
        } elseif ($ilosc > $produkt['stan']) {
            $poprawny = false;
            $komunikat_bledu_post = 'Wybrana ilość (' . $ilosc . ' szt.) przekracza dostępny stan magazynowy (' . $produkt['stan'] . ' szt.).';
        }
    }

    if ($poprawny) {
        $_SESSION['ostatni_wybor'] = [
            'id' => $produkt_id,
            'ilosc' => $ilosc
        ];

        header('Location: lab4.php', true, 303);
        exit;
    } else {
        http_response_code(400);
    }
}

include __DIR__ . '/includes/naglowek.php';
?>

<main class="kontener">
    <h2><?php echo htmlspecialchars($tytul, ENT_QUOTES, 'UTF-8'); ?></h2>
    <p>Identyfikator grupy: <strong><?php echo htmlspecialchars($grupa, ENT_QUOTES, 'UTF-8'); ?></strong></p>
    
    <p><a href="index.html">Powrót do strony głównej</a></p>

    <section class="sesja-wybor">
        <h3>Ostatnio wybrany produkt (Stan Sesji):</h3>
        <?php if (isset($_SESSION['ostatni_wybor'])): ?>
            <?php 
                $z_id = $_SESSION['ostatni_wybor']['id'];
                $z_ilosc = $_SESSION['ostatni_wybor']['ilosc'];
                $z_prod = znajdz_produkt($produkty, $z_id);
                $z_nazwa = $z_prod ? $z_prod['nazwa'] : 'Nieznany produkt';
            ?>
            <p>Zapamiętany wybór: <strong><?php echo htmlspecialchars($z_nazwa, ENT_QUOTES, 'UTF-8'); ?></strong> w ilości <strong><?php echo (int)$z_ilosc; ?></strong> szt.</p>
        <?php else: ?>
            <p>Brak zapisanego wyboru.</p>
        <?php endif; ?>
    </section>

    <section class="sekcja-filtr">
        <?php if ($komunikat_filtra !== ''): ?>
            <p role="alert" class="blad"><?php echo htmlspecialchars($komunikat_filtra, ENT_QUOTES, 'UTF-8'); ?></p>
        <?php endif; ?>

        <form method="get" action="lab4.php">
            <label for="kategoria">Filtruj wg kategorii:</label>
            <select name="kategoria" id="kategoria">
                <option value="wszystkie" <?php if ($wybrana_kategoria === 'wszystkie') { echo 'selected'; } ?>>Wszystkie</option>
                <option value="ksiazki" <?php if ($wybrana_kategoria === 'ksiazki') { echo 'selected'; } ?>>Książki</option>
                <option value="akcesoria" <?php if ($wybrana_kategoria === 'akcesoria') { echo 'selected'; } ?>>Akcesoria</option>
            </select>
            <button type="submit">Filtruj</button>
        </form>
    </section>

    <section class="sekcja-katalog">
        <h3>Katalog produktów</h3>

        <?php if ($komunikat_bledu_post !== ''): ?>
            <p role="alert" class="blad"><?php echo htmlspecialchars($komunikat_bledu_post, ENT_QUOTES, 'UTF-8'); ?></p>
        <?php endif; ?>

        <form method="post" action="lab4.php">
            <fieldset>
                <legend>Wybór produktu z katalogu</legend>

                <table>
                    <thead>
                        <tr>
                            <th>Wybór</th>
                            <th>Nazwa produktu</th>
                            <th>Kategoria</th>
                            <th>Status dostępności</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            $i = 0;
                            while ($i < count($produkty)) {
                                $p = $produkty[$i];

                                if ($wybrana_kategoria !== 'wszystkie' && $p['kategoria'] !== $wybrana_kategoria) {
                                    $i++;
                                    continue;
                                }

                                $stan = $p['stan'];

                                if ($stan === 0) {
                                    $komunikat = "Niedostępny";
                                } elseif ($stan >= 1 && $stan <= 5) {
                                    $komunikat = "Niski stan";
                                } else {
                                    $komunikat = "Dostępny";
                                }

                                switch ($p['kategoria']) {
                                    case 'ksiazki':
                                        $etykieta_kategorii = "Książki i literatura";
                                        break;
                                    case 'akcesoria':
                                        $etykieta_kategorii = "Akcesoria komputerowe";
                                        break;
                                    default:
                                        $etykieta_kategorii = "Inna kategoria";
                                        break;
                                }
                        ?>
                            <tr>
                                <td>
                                    <input type="radio" name="produkt" value="<?php echo (int)$p['id'];?>" id="prod_<?php echo (int)$p['id']; ?>">
                                </td>
                                <td>
                                    <label for="prod_<?php echo (int)$p['id']; ?>">
                                        <?php echo htmlspecialchars($p['nazwa'], ENT_QUOTES, 'UTF-8'); ?>
                                    </label>
                                </td>
                                <td><?php echo htmlspecialchars($etykieta_kategorii, ENT_QUOTES, 'UTF-8'); ?></td>
                                <td><?php echo htmlspecialchars($komunikat, ENT_QUOTES, 'UTF-8'); ?> (<?php echo (int)$stan; ?> szt.)</td>
                            </tr>
                        <?php
                                $i++;
                            } 
                        ?>
                    </tbody>
                </table>
            </fieldset>

            <div class="pole-wyboru-ilosci">
                <label for="ilosc">Wybierz ilość:</label>
                <select name="ilosc" id="ilosc">
                    <?php for ($j = 1; $j <= MAX_ILOSC; $j++): ?>
                        <option value="<?php echo $j; ?>"><?php echo $j; ?></option>
                    <?php endfor; ?>
                </select>
            </div>

            <button type="submit">Zapisz wybór</button>
        </form>
    </section>
</main>

<footer class="kontener">
    <p>&copy; TechPunkt</p>
</footer>

</body>
</html>