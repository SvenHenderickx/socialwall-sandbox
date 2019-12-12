window.onload = function () {

    let tweet1 = document.getElementById('tweets');

    tweet1.style.opacity = "1";
    tweet1.style.marginLeft = "0";

    let youtube = document.getElementById('channel-youtube');
    let twitter = document.getElementById('channel-twitter');
    let instagram = document.getElementById('channel-instagram');
    let facebook = document.getElementById('channel-facebook');

    youtube.style.marginTop = "0";
    youtube.style.opacity = "1";

    twitter.style.marginTop = "0";
    twitter.style.opacity = "1";

    instagram.style.marginTop = "0";
    instagram.style.opacity = "1";

    facebook.style.marginTop = "0";
    facebook.style.opacity = "1";

    document.getElementById('channel-youtube').addEventListener('click', scroll);

    function scroll() {
        $('html, body').animate({
            scrollTop: $("#full1").offset().top});
    }

    document.getElementById('huts').addEventListener('click', switchtweets);

    function switchtweets() {
        let tweets1 = document.getElementById('wall2tweets');

        tweets1.style.opacity = "0";
        tweets1.style.display = "none";
        tweets1.style.marginRight = "-100%";

        let tweets2 = document.getElementById('wall2tweets2');

            if (tweets2.classList.contains('hidden')) {
                // show
                tweets2.classList.add('tweets-trans');
                tweets2.clientWidth; // force layout to ensure the now display: block and opacity: 0 values are taken into account when the CSS transition starts.
                tweets2.classList.remove('hidden');
                tweets2.style.marginLeft = "0";
                tweets2.style.opacity = "1";
            } else {
                // hide
                tweets2.classList.add('tweets-trans');
                tweets2.classList.add('hidden');
            }


    }

};