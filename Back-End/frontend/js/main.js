(function($) {

    "use strict";

    var fullHeight = function() {
        $('.js-fullheight').css('height', $(window).height());
        $(window).resize(function(){
            $('.js-fullheight').css('height', $(window).height());
        });
    };
    fullHeight();

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');

        // Overlay escuro atrás da sidebar no mobile (opcional)
        if ($(window).width() <= 768) {
            $('body').toggleClass('sidebar-open');
        }
    });

    // Fecha a sidebar ao clicar em um link no mobile
    $('.components a').on('click', function() {
        if ($(window).width() <= 768) {
            $('#sidebar').removeClass('active');
            $('body').removeClass('sidebar-open');
        }
    });

})(jQuery);