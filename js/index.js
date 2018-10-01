


// This .ready() function means that the document is ready. 
// If anything is outside of this, the code will run before the document is ready.
$(document).ready(function () {
  $(window).scroll(function () {
    var top =  $(".goto-top");
        if ( $('body').height() <= (    $(window).height() + $(window).scrollTop() + 200 )) {
  top.animate({"margin-left": "0px"},1500);
        } else {
            top.animate({"margin-left": "0px"},1500);
        }
    });

    $(".goto-top").on('click', function () {
        $("html, body").animate({scrollTop: 0}, 1100);
    });

    // Hide Header on on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('header').outerHeight();

    $(window).scroll(function(event){
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('header').removeClass('nav-down').addClass('nav-up');
        } else {
            // Scroll Up
            if(st + $(window).height() < $(document).height()) {
                $('header').removeClass('nav-up').addClass('nav-down');
            }
        }

        lastScrollTop = st;
    }


     var $document = $(document),
       $element = $('header'),
       className = 'box-shadow';

    // Start listening for the 'scroll' event
     $document.scroll(function() {
         console.log($document.scrollTop());
       if ($document.scrollTop() >= 5) {
         // Change 50 to the value you require
         // for the event to trigger
         $element.addClass(className);
       } else {
         $element.removeClass(className);
       }
     });
    
    // On page load, check the $document.scrollTop().
    // If scrollTop() is >= 5, then add the class 'box-shadow' to $('header')
    // This is a fix for the box-shadow not appearing on refresh.
    if ($document.scrollTop() >= 5) {
        console.log('happens exactly once');
        $element.addClass(className);
    }

});










