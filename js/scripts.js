(function($, window, document) {
    $(function() {

        parallax();
        $( window ).resize(function() {
            parallax();    
        });
        
    });

    function parallax() {
        if ($(window).width() > 992) {
            $('.parallax-window').not('.initialized').parallax({
                imageSrc: '/images/ecdtools/home/highlights-prefix-bg.jpg',
                naturalWidth: '1600',
                naturalHeight: '455',
                speed: '0.8',
            }).addClass('initialized');
        }
        else {
            $('.parallax-window').removeClass('initialized');
        }
    }

}(window.jQuery, window, document));