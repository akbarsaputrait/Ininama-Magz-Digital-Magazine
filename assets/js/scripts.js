// Initialization Clock
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    var clock = document.getElementsByClassName('clock');

    clock[ 0 ].innerHTML = h + ':' + m + ':' + s;

    var t = setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i}
    ;  // add zero in front of numbers < 10
    return i;
}

$(document).ready(function() {

    // Initialization Clock
    function showClock() {
        $('.clock').css({
            'opacity': 1,
            'visibility': 'visible',
            'display': 'inline'
        });
    };

    // Initialization Weather
    function loadWeather(location, woeid) {
        $.simpleWeather({
            location: location,
            woeid: woeid,
            unit: 'f',
            success: function(weather) {
                html = '<i class="weather-icon icon-' + weather.code + '"></i>';
                html += ' ' + weather.city + ', ' + weather.region + ' | ';
                html += ' ' + weather.alt.temp + '&deg;C';

                $(".weather").html(html);
                $('.weather').css({
                    'opacity': 1,
                    'visibility': 'visible',
                    'display': 'inline'
                });
            },
            error: function(error) {
                $(".weather").html(error);
            }
        });
    }

    // Load weather using your lat/lng coordinates
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                loadWeather(position.coords.latitude + ',' + position.coords.longitude);
            });
        }
    }

    // Initialization Table Of Contents
    function generateTableContents(data) {
        var $list = [];
        for (var i = 0; i < data.length; i++) {
            $list.push($('<li class="list-page" data-page="' + data[ i ].page + '" onclick="$(this).goToPage(' + data[ i ].page + ')">' +
                '<div class="title">' + data[ i ].title + '</div>' +
                '<div class="content">' + data[ i ].content.substr(0, 100) + '...</div>' +
                '</li>'));
        }
        $('#side-search .list-article ul').empty().append($list);
    }

    function generateSettingBackground(current) {
        // Initialization Page
        var $elements = [];
        for (var i = 1; i <= 5; i++) {
            var $class = 'bg-' + i;

            if ($class === current) {
                $class += ' active';
            }

            $elements.push($('<li class="bg-setting bg-image ' + $class + '">' +
                '<a class="background-image" style="background-image: url(assets/images/bg-' + i + '.jpg)"></a>' +
                '</li>'));
        }

        $('.setting .background-setting ul').append($elements);

    }

    window.setTimeout(showClock, 1000);
    window.setTimeout(getLocation, 1000);

    // Initialization Page
    var $elements = [];
    for (var i = 1; i <= 20; i++) {
        var $class = 'page page-' + i;
        if (i == 1 || i == 20) {
            $class += ' cover';
        }

        $elements.push($('<div class="' + $class + '" style="background: #ffffff url(assets/page/' + i + '.png) no-repeat;">' +
            '</div>'));
    }

    $('#book-flip').append($elements);

    // Add Custom Attribute to Page
    $('.page-1').attr('data-step', 1);
    $('.page-1').attr('data-intro', 'Welcome to Ininama Magz. The Best Digital Magazine 2017.');

    // Initialization Protip
    $.protip({
        defaults: {
            size: 'small',
            animate: 'tada',
            classes: 'nav-tooltip'
        }
    });

    // Initialization wowbook
    $('#book-flip').wowBook({
        height: 500,
        width: 746,
        centeredWhenClosed: true,
        hardcovers: true,
        turnPageDuration: 1000,
        numberedPages: [ 1, 0 ],
        flipSoundPath: "./assets/file/",
        controls: {
            zoomIn: '.zoomin',
            zoomOut: '.zoomout',
            next: '.next',
            back: '.prev',
            first: '.fcov',
            last: '.bcov',
            fullscreen: '.fullscreen'
        },
        scaleToFit: "#container",
        onFullscreenError: function() {
            var msg = "Fullscreen failed.";
            if (self != top) msg = "The frame is blocking full screen mode. Click on 'remove frame' button above and try to go full screen again."
            alert(msg);
        }

    }).css({
        'display': 'none',
        'margin': 'auto'
    }).fadeIn(1000);

    var book = $.wowBook('#book-flip');
    var mySwiper = null;

    if (typeof book === 'undefined') {
        mySwiper = document.querySelector('.swiper-container').swiper;
    }

    // Slideshow Magazine
    var slideplay = false;
    $('.slideshow').on('click', function() {
        if (!slideplay) {
            $('.slideshow .stop').css('display', 'block');
            $('.slideshow .play').css('display', 'none');
            if (typeof book === 'undefined') {
                mySwiper.autoplay.start();
            } else {
                book.startSlideShow();
            }
        } else {
            $('.slideshow .stop').css('display', 'none');
            $('.slideshow .play').css('display', 'block');
            if (typeof book === 'undefined') {
                mySwiper.autoplay.stop();
            } else {
                book.stopSlideShow();
            }
        }
        slideplay = !slideplay;
    });

    // Initialization Intro
    var introExists = localStorage.getItem("intro");
    if (introExists === null || introExists === false) {
        introJs().start();
        localStorage.setItem("intro", true);
    }

    $('.logo-icon .help').on('click', function() {
        introJs().start();
    });

    $("#side-search").simplerSidebar({
        width: 270,
        selectors: {
            trigger: ".toggle-search",
            quitter: ".close-sidebar",
        },
        events: {
            callbacks: {
                animation: {
                    open: function() {
                        var options = {
                            shouldSort: true,
                            threshold: 0.5,
                            location: 0,
                            distance: 1000,
                            maxPatternLength: 32,
                            minMatchCharLength: 1,
                            keys: [
                                "title",
                                "content"
                            ]
                        };
                        var fuse = new Fuse(articles, options);

                        // Look for changes in the value
                        $('#side-search .search-input').bind("propertychange change click keyup input paste", function(event) {
                            var text = $(this).val();

                            if (text.length === 0) {
                                generateTableContents(articles);
                            } else {
                                var result = fuse.search(text);
                                generateTableContents(result);
                            }
                        });
                    },
                }
            }
        }
    });

    $("#side-thumbnail").simplerSidebar({
        width: 200,
        selectors: {
            trigger: ".toggle-thumbnail",
            quitter: ".close-sidebar",
        },
    });

    // Initialization Generate Table Of Contents
    window.setTimeout(function() {
        generateTableContents(articles);
    }, 1000);

    // Initialization Setting Background
    window.setTimeout(function() {
        generateSettingBackground(null)
    }, 500);

    // Initialization Copied Feature
    $('.copied').on('click', function() {
        var $contents = [];
        var $page = 0;

        if (typeof book === 'undefined') {
            $page = mySwiper.realIndex * 2;
        } else {
            $page = book.currentPage;
        }

        var res = articles.filter(function(art) {
            return art.page === $page;
        });

        for (var i = 0; i < res.length; i++) {
            $contents.push(res[ i ].content);
        }

        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($contents.join(' | ')).select();
        document.execCommand("copy");

        $(this).protipShow({ title: 'Copied!' });
        $temp.remove();
    });

    // Play Backsound
    var soundplay = false;
    $('.toggle-play').on('click', function() {
        var $audio = document.getElementById('audio-player');
        if (!soundplay) {
            $('.toggle-play .pause').css('display', 'block');
            $('.toggle-play .play').css('display', 'none');
            $audio.play();
        } else {
            $('.toggle-play .pause').css('display', 'none');
            $('.toggle-play .play').css('display', 'block');
            $audio.pause();
            $audio.currentTime = 0;
        }
        soundplay = !soundplay;
    });

    // Initialization Thumbnails
    $('.list-thumb .img-info').on('click', function() {
        var page = $(this).data('page');
        console.log($(this));
    });
});

$(document).on('opened', '.remodal.setting', function() {

    function generateSettingBackground(current) {
        // Initialization Page
        var $elements = [];
        for (var i = 1; i <= 5; i++) {
            var $class = 'bg-' + i;

            if ($class === current) {
                $class += ' active';
            }

            $elements.push($('<li class="bg-setting bg-image ' + $class + '">' +
                '<a class="background-image" style="background-image: url(assets/images/bg-' + i + '.jpg)"></a>' +
                '</li>'));
        }

        $('.setting .background-setting ul .bg-image').remove();
        $('.setting .background-setting ul').append($elements);

    }

    window.setTimeout(function() {
        // Initialization Setting Background
        var backgroundType = localStorage.getItem("backgroundType");
        var backgroundValue = localStorage.getItem("backgroundValue");

        $('.background-list .bg-setting').siblings().removeClass('active');
        if (backgroundType === null) {
            $('.background-list .bg-color').addClass('active');
            $('.background-list .input-color-bg').val('#ffffff');
        } else {
            if (backgroundType === 'bg-color') {
                $('.background-list .bg-color').addClass('active');
                $('.background-list .input-color-bg').val(backgroundValue);
            } else if (backgroundType === 'bg-image') {
                generateSettingBackground(backgroundValue);
            }
        }

        // Initialization Setting Theme
        var primary = localStorage.getItem("themePrimary") || '#121212';
        var secondary = localStorage.getItem("themeSecondary") || '#ffffff';

        $('.theme-list .input-color-primary').val(primary);
        $('.theme-list .input-color-secondary').val(secondary);

        // Initialization Event Click
        $('.background-list ul li').on('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
        })
    }, 500)
});

$(document).on('opened', '.remodal.game', function() {
    game.onload();
});

$(document).on('closed', '.remodal.game', function(e) {
    game.onclose();
});

$(document).on('confirmation', '.remodal.setting', function() {
    // Save Background
    var element = $('.background-list ul').find('.active');
    var classList = element.attr('class').split(' ');

    if (classList[ 0 ] === 'bg-setting') {
        if (classList[ 1 ] === 'bg-color') {
            localStorage.setItem("backgroundValue", $('.background-list .input-color-bg').val());
        } else {
            localStorage.setItem("backgroundValue", classList[ 2 ]);
        }

        localStorage.setItem("backgroundType", classList[ 1 ]);
    }

    // Save Theme
    localStorage.setItem("themePrimary", $('.theme-list .input-color-primary').val())
    localStorage.setItem("themeSecondary", $('.theme-list .input-color-secondary').val())

    location.reload();
});

$.fn.goToPage = function(page) {
    var book = $.wowBook("#book-flip");
    $('#side-search .close-sidebar').trigger('click');

    if (typeof book === 'undefined') {
        var mySwiper = document.querySelector('.swiper-container').swiper;
        mySwiper.slideTo(page / 2);
    } else {
        book.gotoPage(page);
    }
};

$.fn.playDub = function(page) {
    var $audio = document.getElementById('dub-player');
    var $old = $audio.getAttribute('data-old-dub');

    if ($old != null) {
        $('.play-' + $old).removeClass('active');
    }
    $audio.setAttribute('data-old-dub', page);
    $audio.setAttribute('src', 'assets/sound/' + page + '.mp3');

    if ($(this).is('.active') || page == $old) {
        $audio.pause();
        $audio.currentTime = 0;
        $(this).removeClass('active');
    } else {
        $audio.currentTime = 0;
        $audio.pause();
        $audio.play();
        $(this).addClass('active');
    }
}
