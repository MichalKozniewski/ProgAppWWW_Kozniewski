"use strict";
let isExpanded = false;
$('#buttonA').on('click',function(){
    isExpanded = !isExpanded;
    $(this).attr('aria-pressed', isExpanded);
    const width = isExpanded ? 240 : 160;
    const height = isExpanded ? 130 : 90;
    $(this).stop(true,false).animate({
        width: width + 'px',
        height: height + 'px'
    },300);
});
let isHovered = false;
let isFocused = false;
$('#buttonB').on('mouseenter mouseleave focus blur', function(e){
    if (e.type === 'mouseenter') isHovered = true;
    if (e.type === 'mouseleave') isHovered = false;
    if (e.type === 'focus')      isFocused = true;
    if (e.type === 'blur')       isFocused = false;
    const isExpanded2 = isHovered || isFocused
    const width = isExpanded2 ? 220 : 160;
    const height = isExpanded2 ? 120 : 90;
    $(this).stop(true,false).animate({
        width: width + 'px',
        height: height + 'px'
    },300);
});
let krok = 0;
const maxKroki = 5;
const baseWidth = 160;
const baseHeight = 90;
$('#buttonC').on('click',function() {
    if ($(this).is(':animated') || krok >= maxKroki) {
      return;
    }
    krok = krok + 1;
    const targetWidth = baseWidth + (krok * 20); 
    const targetHeight = baseHeight + (krok * 10);
    $(this)
      .stop(true, false)
      .animate({
        width: targetWidth + 'px',
        height: targetHeight + 'px'
      }, 300);
    $('#status').text(`Kroki: ${krok} z ${maxKroki}`);
});
$('#reset').on('click', function() {
    $('#buttonC').stop(true,false).css({
            width: baseWidth + 'px',
            height: baseHeight + 'px'
        });
    krok = 0;
    $('#status').text(`Kroki: ${krok} z ${maxKroki}`);
    $('#buttonA').stop(true,false).css({
            width: baseWidth + 'px',
            height: baseHeight + 'px'
        });
    isExpanded = false;
    $('#buttonA').attr('aria-pressed', false);
});