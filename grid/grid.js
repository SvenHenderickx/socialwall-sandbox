window.onload = function () {

    let tweet1 = document.getElementById('tweets');

    function tweetsin() {
        tweet1.style.opacity = "1";
        tweet1.style.marginLeft = "0";
    }

    function tweetsout() {
        tweet1.style.opacity = "0";
        tweet1.style.marginLeft = "-25%";
    }

    let youtube = document.getElementById('channel-youtube');
    let twitter = document.getElementById('channel-twitter');
    let instagram = document.getElementById('channel-instagram');
    let facebook = document.getElementById('channel-facebook');

    channelsin();
    tweetsin();

    function channelsin() {
        youtube.style.marginTop = "0";
        youtube.style.opacity = "1";

        twitter.style.marginTop = "0";
        twitter.style.opacity = "1";

        instagram.style.marginTop = "0";
        instagram.style.opacity = "1";

        facebook.style.marginTop = "0";
        facebook.style.opacity = "1";
    }

    function channelsout() {
        youtube.style.marginTop = "-5%";
        youtube.style.opacity = "0";

        twitter.style.marginTop = "-5%";
        twitter.style.opacity = "0";

        instagram.style.marginTop = "-5%";
        instagram.style.opacity = "0";

        facebook.style.marginTop = "-5%";
        facebook.style.opacity = "0";
    }

    function tweets2in() {
        let tweetswall2 = document.getElementById('wall2tweets');

        tweetswall2.style.marginTop = "0";
        tweetswall2.style.opacity = "1";

        let instawall2 = document.getElementById('instawall2');

        instawall2.style.marginLeft = "0";
        instawall2.style.opacity = "1";
    }

    function tweets2out() {
        let tweetswall2 = document.getElementById('wall2tweets');

        tweetswall2.style.marginTop = "-5%";
        tweetswall2.style.opacity = "0";

        let instawall2 = document.getElementById('instawall2');

        instawall2.style.marginLeft = "-5%";
        instawall2.style.opacity = "0";
    }

    setTimeout(scrolldown, 10000);

    // timeouts

    let channelout;
    let channelin;
    let tweetout;
    let tweet2in;
    let downscroll;
    let tweet2out;
    let upscroll;
    let tweetin;

    function scrolldown() {
        channelout = setTimeout(channelsout, 500);
        tweetout = setTimeout(tweetsout, 500);
        tweet2in = setTimeout(tweets2in, 500);
        $('html, body').animate({
            scrollTop: $("#full1").offset().top});
        upscroll = setTimeout(scrollup, 10000);
    }

    function scrollup() {
        tweet2out = setTimeout(tweets2out, 500);
        $('html, body').animate({
            scrollTop: $("#full0").offset().top});
        downscroll = setTimeout(scrolldown, 10000);
        channelin = setTimeout(channelsin, 500);
        tweetin = setTimeout(tweetsin, 500);
    }

    function watchvid() {
        $('html, body').animate({
            scrollTop: $("#full2").offset().top});
    }

    hotkeys('right,down', function (event, handler){
        switch (handler.key) {
            case 'right':
                document.getElementById('vidplayer').innerHTML = "    <iframe width=\"100%\" height=\"115%\" src=\"https://www.youtube.com/embed/rAAFSl9Gsn0?autoplay=1&showinfo=0\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n";
                clearTimeout(channelout);
                clearTimeout(tweetout);
                clearTimeout(tweet2in);
                clearTimeout(downscroll);
                clearTimeout(tweet2out);
                clearTimeout(upscroll);
                watchvid();
                break;
            case 'down':
                scrolldown();
                break;
            default: alert(event);
        }
    });

};