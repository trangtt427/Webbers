

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

$('.nav-item').click(function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');                     
});





$(document).scroll(function() {
  var st = $(this).scrollTop();
  $("#header").css({
    "background-position-y": (-st/20)
  })
  $("#first-section").css({
    "top": (-st/5),
    "bottom": (st/5)
  })
  
});




function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 500);

    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}

onReady(function () {
    show('page', true);
    show('loading', false);
});






// disable :hover on touch devices
// based on https://gist.github.com/4404503 
// via https://twitter.com/javan/status/284873379062890496
// + https://twitter.com/pennig/status/285790598642946048
// re http://retrogamecrunch.com/tmp/hover
if ('createTouch' in document)
{
    try
    {
        var ignore = /:hover/;
        for (var i=0; i<document.styleSheets.length; i++)
        {
            var sheet = document.styleSheets[i];
            for (var j=sheet.cssRules.length-1; j>=0; j--)
            {
                var rule = sheet.cssRules[j];
                if (rule.type === CSSRule.STYLE_RULE && ignore.test(rule.selectorText))
                {
                    sheet.deleteRule(j);
                }
            }
        }
    }
    catch(e){}
}