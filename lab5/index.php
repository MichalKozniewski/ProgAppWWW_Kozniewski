<?php
$err = 0;
$projekt_id = "sklep-techpunk";
$strony = [
    'glowna' => [
        'etykieta' => 'Strona Główna',
        'tytul' => 'TechPunkt – Strona główna',
        'plik' => '/html/glowna.html',
    ],
    'kontakt' => [
        'etykieta' => 'Kontakt',
        'tytul' => 'TechPunkt – Kontakt',
        'plik' => '/html/kontakt.html',
    ],
    'produkt' => [
        'etykieta' => 'Produkt',
        'tytul' => 'TechPunkt – Produkt',
        'plik' => '/html/produkt.html',
    ],
    'filmy' => [
        'etykieta' => 'Filmy',
        'tytul'    => 'TechPunkt – Filmy',
        'plik'     => '/html/filmy.html',
    ],
];
if (!isset($_GET['idp']) || $_GET['idp'] === ''){
    $aktywne_idp = 'glowna';
    $path = $strony['glowna']['plik'];
    $title = $strony['glowna']['tytul'];
}
elseif(is_string($_GET['idp']) && array_key_exists($_GET['idp'], $strony)){
    $aktywne_idp = $_GET['idp'];
    $path = $strony[$_GET['idp']]['plik'];
    $title = $strony[$_GET['idp']]['tytul'];
}
else{
    $aktywne_idp = null;
    $title = 'TechPunkt – Nie znaleziono strony';
    http_response_code(404);
    $err = 404;        
}

if($err === 0 && (!is_file(__DIR__ . $path) || !is_readable(__DIR__ . $path))){
    $title = 'TechPunkt – Błąd serwera';
    http_response_code(500);
    $err = 500;
}
?>


<!doctype html>
<html lang="pl" data-theme="light">
    <head>
        <meta charset="UTF-8">
        <title><?php echo  htmlspecialchars($title, ENT_QUOTES, 'UTF-8')?></title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/style.css">
        <script src="js/main.js" defer></script>
        <script src="vendor/jquery-4.0.0.min.js" defer></script>
        <script src="js/lab3.js" defer></script>
    </head>
    <body>
        <header class="kontener">
            <h1>Sklep z elektroniką</h1>
        </header>
        <button type="button" id="theme-toggle" aria-pressed="false" aria-label="Przełącz tryb ciemny">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M338.5-338.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
        </button>
        <time id="date" datetime="date"></time>
        <time id="time" datetime="time"></time>
        <button id="on">Start zegara</button>
        <button id="off">Stop zegara</button>

        <div class="search-box">
            <label for="search-input">Szukaj produktów:</label>
            <input type="search" id="search-input" placeholder="Wpisz nazwę...">
            <div id="search-status" aria-live="polite"></div>
        </div>

        <nav class="menu kontener">
            <?php foreach ($strony as $klucz =>$dane): ?>
            <a href="index.php?idp=<?php echo htmlspecialchars($klucz, ENT_QUOTES, 'UTF-8');?>" <?php if ($klucz === $aktywne_idp) { echo 'aria-current="page"'; } ?>>
                <?php echo htmlspecialchars($dane['etykieta'], ENT_QUOTES, 'UTF-8');?>
            </a>
            <?php endforeach; ?>
            <a href="lab4.php">Katalog PHP</a>
        </nav>
        <main class="kontener">
            <?php 
            if ($err === 0){
                include __DIR__ . $path;
            }elseif($err===404){
                echo '<p role="alert" class="blad">Nie znaleziono podstrony (błąd 404).</p>';
                echo '<p><a href="index.php">Powrót na stronę główną</a></p>';
            }elseif ($err===500){
                echo '<p role="alert" class="blad">Błąd serwera (500) – nie można wczytać widoku podstrony.</p>';
                echo '<p><a href="index.php">Powrót na stronę główną</a></p>';
            }else{
                echo '<p role="alert" class="blad">Wystąpił nieznany błąd.</p>';
                echo '<p><a href="index.php">Powrót na stronę główną</a></p>';
            }
            
            ?>
        </main>
        <footer class="kontener">
            <?php echo htmlspecialchars($projekt_id, ENT_QUOTES, 'UTF-8'); ?>
        </footer>

    </body>
</html>
