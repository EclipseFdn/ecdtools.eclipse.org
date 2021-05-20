(function($, window, document) {
    $(function() {

        parallax();
        $( window ).resize(function() {
            parallax();    
        });
        
    });

    function parallax() {
        if ($(window).width() > 992) {
            $('.parallax-window').parallax({
                imageSrc: '/images/ecdtools/home/highlights-prefix-bg.jpg',
                naturalWidth: '1600',
                naturalHeight: '455',
                speed: '0.8'
            });
        }
    }
}(window.jQuery, window, document));