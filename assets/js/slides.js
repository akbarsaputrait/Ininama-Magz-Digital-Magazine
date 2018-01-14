$(document).ready(function() {
    var mySwiper = new Swiper('.swiper-container', {
        zoom: true,
        keyboard: true,
        allowTouchMove: false,
        centeredSlides: true,
        loop: false,
        slidesPerView: 'auto',
        navigation: {
            nextEl: '.next-slide',
            prevEl: '.prev-slide',
        },
    });

    $('.fcov-slide, .bcov-slide').on('click', function() {
        if ($(this).is('.fcov-slide')) {
            mySwiper.slideTo(0, 1000);
        } else {
            mySwiper.slideTo(10, 1000);
        }
    });

    var scale = 0;

    $(".zoomin-slide, .zoomout-slide").click(function() {
        if ($(this).is('.zoomin-slide')) {
            mySwiper.zoom.in();
        } else {
            mySwiper.zoom.out();
        }
    });
});
