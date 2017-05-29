(function () {
    console.log('Hello world!');
    console.log('My workflow initial build.');
})();

/* menu (RWD) 導行列 */
$(document).ready(function () {
    var $navigation = $('.menu .navigation');
    var $all_subMenu = $('.menu ul.main-menu li.dropdown > ul.sub-menu');
    var $closeNavbar = $('#main ,#footer');

    if ($(window).width() <= 767) {
        $('body').css('margin-top', '55px');
        $('.menu').addClass('fixed');
    }

    $('.menu .menu-toggle').click(function() {
        if ($navigation.hasClass('side-slide')) {

            if ($navigation.hasClass('pushed')) {
                $navigation.removeClass('pushed');
                $('body').css('overflow', 'auto');
            } else {
                $navigation.addClass('pushed');
                $('body').css('overflow', 'hidden');
            }
        } else {

            if ($navigation.css('display') === 'block') {
                $('body').css('overflow', 'auto');
            } else {
                $('body').css('overflow', 'hidden');
            }

            $navigation.slideToggle(300);
        }

        $all_subMenu.removeAttr('style');
    });

    $('.menu ul.main-menu li.dropdown > a').click(function() {
        if ($(window).width() <= 767) {
            $(this).parent('li').siblings('.dropdown').find('ul.sub-menu').slideUp(300);
            $(this).siblings('ul.sub-menu').slideToggle(300);
        }
    });

    $closeNavbar.click(function() {
        if ($(window).width() <= 767) {

            if ($navigation.hasClass('side-slide pushed')) {
                $navigation.removeClass('pushed');
                $('body').css('overflow', 'auto');
                $all_subMenu.removeAttr('style');
            }else
            if ($navigation.css('display') === 'block' && !$navigation.hasClass('side-slide')) {
                $navigation.slideToggle(300);
                $('body').css('overflow', 'auto');
                $all_subMenu.removeAttr('style');
            }
        }
    });

    $(window).resize(function() {
        if ($(window).width() > 767) {
            $('body').removeAttr('style');
            $('.menu').removeClass('fixed');
            $all_subMenu.removeAttr('style');

            if ($navigation.hasClass('side-slide')) {
                $navigation.removeClass('pushed');
            } else {
                $navigation.removeAttr('style');
            }
        }

        if ($(window).width() <= 767) {
            $('body').css('margin-top', '55px');
            $('.menu').addClass('fixed');
        }
    });
});
