$(".fb-tab").click(function() {
    //Spot switcher:
    $(this).parent().find(".fb-tab").removeClass("fb-tab-active");
    $(this).addClass("fb-tab-active");
});
