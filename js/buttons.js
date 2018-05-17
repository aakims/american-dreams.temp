$(document).ready(function() {
    $('.legend-option').hide();
    $('.curtain').hide();
    $('.overlay').hide();
    $('.hidden').removeClass("hidden");
});

$(".fb-tab").click(function() {
    //Spot switcher:
    $(this).parent().find(".fb-tab").removeClass("fb-tab-active");
    $(this).addClass("fb-tab-active");
});

$("#about").click(function() {
    $('.curtain').show();
    $('.overlay').show();
});

$('.close').click(function() {
    $('.overlay').hide();
    $('.curtain').hide();
});

$('.curtain').click(function() {
    $('.overlay').hide();
    $('.curtain').hide();
});