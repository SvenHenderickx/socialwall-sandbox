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
    setInterval(channelsin, 10000);
    setInterval(tweetsin, 10000);

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

    setTimeout(scrolldown, 5000);

    function scrolldown() {
        setTimeout(channelsout, 500);
        setTimeout(tweetsout, 500);
        setTimeout(tweets2in, 500);
        $('html, body').animate({
            scrollTop: $("#full1").offset().top});
        setTimeout(scrollup, 5000);
    }

    function scrollup() {
        setTimeout(tweets2out, 500);
        $('html, body').animate({
            scrollTop: $("#full0").offset().top});
        setTimeout(scrolldown, 5000);
    }

};