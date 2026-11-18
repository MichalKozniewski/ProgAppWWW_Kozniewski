"use strict";
let isExpanded = false;
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (mediaQuery.matches) {
    $.fx.off = true;
}
const $section = $('#demo-animacje');
const baseWidth = 160;
const baseHeight = 90;
$section.find('#buttonA').on('click',function(){
    isExpanded = !isExpanded;
    $(this).attr('aria-pressed', isExpanded);
    const width = isExpanded ? 240 : baseWidth;
    const height = isExpanded ? 130 : baseHeight;
    $(this).stop(true,false).animate({
        width: width + 'px',
        height: height + 'px'
    },300);
});
let isHovered = false;
let isFocused = false;
$section.find('#buttonB').on('mouseenter mouseleave focus blur', function(e){
    if (e.type === 'mouseenter') isHovered = true;
    if (e.type === 'mouseleave') isHovered = false;
    if (e.type === 'focus')      isFocused = true;
    if (e.type === 'blur')       isFocused = false;
    const isExpanded2 = isHovered || isFocused;
    const width = isExpanded2 ? 220 : baseWidth;
    const height = isExpanded2 ? 120 : baseHeight;
    $(this).stop(true,false).animate({
        width: width + 'px',
        height: height + 'px'
    },300);
});
let krok = 0;
const maxKroki = 5;
const addWidth = 20;
const addHeight = 10;
$section.find('#buttonC').on('click',function() {
    if ($(this).is(':animated') || krok >= maxKroki) {
      return;
    }
    krok = krok + 1;
    const targetWidth = baseWidth + (krok * addWidth); 
    const targetHeight = baseHeight + (krok * addHeight);
    $(this)
      .stop(true, false)
      .animate({
        width: targetWidth + 'px',
        height: targetHeight + 'px'
      }, 300);
    $section.find('#status-C').text(`Kroki: ${krok} z ${maxKroki}`);
});
$section.find('#reset').on('click', function() {
    $section.find('#buttonC').stop(true,false).css({
            width: baseWidth + 'px',
            height: baseHeight + 'px'
        });
    krok = 0;
    $section.find('#status-C').text(`Kroki: ${krok} z ${maxKroki}`);
    $section.find('#buttonA').stop(true,false).css({
            width: baseWidth + 'px',
            height: baseHeight + 'px'
        });
    isExpanded = false;
    $section.find('#buttonA').attr('aria-pressed', false);
});
const $ajaxSection = $('#ajax');
const $checkBtn = $ajaxSection.find('#sprawdz-serwer');
const $serverStatus = $ajaxSection.find('#wynik-serwer');
$checkBtn.on('click', function(){
    $checkBtn.prop('disabled', true);
    $serverStatus.text('Ładowanie...');
    $.ajax({
        url: 'status.php',
        method: 'GET',
        dataType: 'text',
        timeout: 5000 
    })
    .done(function(response) {
        $serverStatus.text(response);
    })
    .fail(function(jqXHR, textStatus) {
        if (textStatus === 'timeout') {
            $serverStatus.text('Błąd: Przekroczono czas oczekiwania na odpowiedź serwera (5s).');
        } else if (jqXHR.status === 404) {
            $serverStatus.text('Błąd 404: Nie znaleziono pliku status.php.');
        } else {
            $serverStatus.text('Wystąpił błąd połączenia z serwerem.');
        }
    })
    .always(function() {
        $checkBtn.prop('disabled', false);
    });
});