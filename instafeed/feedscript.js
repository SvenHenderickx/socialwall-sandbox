var instaPosts;
var facebookPosts;
var twitterPosts;

var instaLoaded = false;
var facebookLoaded = false;
var twitterLoaded = false;

var instaCounter = 0;
var facebookCounter = 0;
var twitterCounter = 0;
var maxPostsPerChannel = 150;

function getFacebookPosts(){
    $.ajaxSetup({ cache: true });
      $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
          appId:'529069617875587',
          version: 'v5.0'
        });

        var token = 'EAAHhL56iioMBAD61NKTfL71NJeJxNrUuy05hjnkyca33ns26OfO13P5PVxRNcFR19QVgSQJRnv2t2MIZCBRJHfKZA7ZCfCtPs8OUhupYjHDCqOK6Dj1jyoIlBcr9nJAb5ZAnp0vjlVDsft0ZBQQa3CPMQRakwk1CHQU4ih02abfoLTvmmwJkCHXNoS8MWD2CkUzFc90iiFxqYUEfr1JezM1s46cMQ0Ob7dneaCOJnKwZDZD';

        FB.api(
              '/me',
              'GET',
              { access_token : token,
                  "fields":"posts{source,full_picture,message,description,created_time}"},
                function(response) {
                  facebookPosts = response;
                  facebookLoaded = true;
                  // console.log(facebookPosts);
                  // showFacebookFeed();
              }
        );

    });
}

function getInstagramPosts(){
    var userFeed = new Instafeed({
        get: 'user',
        userId: 784297742,
        resolution: 'standard_resolution',
        accessToken: '784297742.1677ed0.155b78eba16f4362a7e7599c297cdb8b',
        mock: true,
        success: function(data){
            instaPosts = data;
            instaLoaded = true;
            // showInstaFeed();

        }
    });

    userFeed.run();
}

function getTwitterPosts(){

    $.ajax({
        url: 'php/twitterposts.php',
        type: "GET",
        data: {
            name: 'HenderickxSven'
        },
        success: function(data)
        {
            data = JSON.parse(data);
            twitterPosts = data;
            twitterLoaded = true;
            // console.log(twitterPosts);
        },
        error: function (xhr, ajaxOptions, thrownError)
        {
            $(input).text('Mislukt.');
            var errorMsg = 'Ajax request failed: ' + xhr.responseText;
            console.log(errorMsg);
        }
    })
}

$(document).ready(function(){

    getFacebookPosts();
    getInstagramPosts();
    getTwitterPosts();

    function checkVariable() {
       if (facebookLoaded && instaLoaded && twitterLoaded) {
           showFeed();
       }
    }

     setTimeout(checkVariable, 1500);

});

function showFeed(){

    console.log('test');
    var mixedfeed = $.merge($.merge( [], instaPosts.data ), facebookPosts.posts.data );
    mixedfeed = $.merge($.merge( [], twitterPosts ), mixedfeed );

    mixedfeed = mixedfeed.sort(SortByDate);

    var count = 0;
    $.each(mixedfeed, function(k, v){
        addToFeed(v);
        count += 1;
        if(count > 300 && false){
            // return false;
        }
    })
}

function SortByDate(a, b){
    if(checkSort(a) == 'instagram'){
        var timeA = new Date((a.created_time)*1000);
        console.log(a.created_time);
    }
    else if(checkSort(a) == 'facebook'){
        var timeA = new Date(a.created_time);
        console.log(a.created_time);
    }
    else if(checkSort(b) == 'twitter'){
        var timeA = new Date(a.created_at);
        console.log(a.created_at);
    }


    if(checkSort(b) == 'instagram'){
        var timeA = new Date((b.created_time)*1000);
        console.log(b.created_time);
    }
    else if(checkSort(b) == 'facebook'){
        var timeB = new Date(b.created_time);
        console.log(b.created_time);
    }
    else if(checkSort(b) == 'twitter'){
        var timeB = new Date(b.created_at);
        console.log(b.created_at);
    }

    console.log(timeA);
    console.log(timeB);

    // if(timeA > timeB){
    //     return 1;
    // }
    // else if(timeA < timeB){
    //     return -1
    // }
    // else{
    //     return 0;
    // }

    return timeA < timeB;
}

function addToFeed(feedObject){
    if(checkSort(feedObject) == 'instagram' && instaCounter < maxPostsPerChannel){
        instaCounter++;
        var caption = '';
        var imagesrc = '';

        if(feedObject.caption !== null){
            caption = "<p>" + feedObject.caption.text + "</p>";
        }

        if(feedObject.images !== null){
            imagesrc = '<img class="instapic" src="' + feedObject.images.standard_resolution.url + '"/>';
        }

        var date = new Date(feedObject.created_time * 1000)
        date = '<small>' + date + '</small>'

        $('#mixedfeed').append('<div class="facebook_wrapper instagram">' + imagesrc + ' ' + caption + date + '</div>');
    }

    if(checkSort(feedObject) == 'facebook' && facebookCounter < maxPostsPerChannel){
        facebookCounter++;
        var caption = '';
        var imagesrc = '';
        // console.log(value);

        $.each(feedObject, function(k, v){
            if(k == 'message'){
                caption = '<p>' + v + '</p>';
            }

            if(k == 'full_picture'){
                imagesrc = '<img src="' + v + '" />';
            }
        })

        var date = '<small>' + new Date(feedObject.created_time) + '</small>'

        if(caption.length > 0 || imagesrc.length > 0){

            $('#mixedfeed').append('<div class="facebook_wrapper facebook">' + imagesrc + caption + date + '</div>');
        }
    }

    if(checkSort(feedObject) == 'twitter' && twitterCounter < maxPostsPerChannel){
        twitterCounter++;
        var caption = '';
        var imagesrc = '';

        if(feedObject.text !== null){
            caption = "<p>" + feedObject.text + "</p>";
        }

        $.each(feedObject, function(k, v){
            if(k == 'extended_entities'){
                $.each(v, function(k_, va){
                    imagesrc = '<img src="' + va[0].media_url + '" />';
                    console.log(va);
                })
            }
        })

        var date = new Date(feedObject.created_at);
        date = '<small>' + date + '</small>';

        $('#mixedfeed').append('<div class="facebook_wrapper twitter">' + imagesrc + ' ' + caption + date + '</div>');
    }
}

function checkSort(feedObject){
    var isInsta = false;
    var isTwitter = false;

    $.each(feedObject, function(k, v){
        // console.log(v);
        if(k === 'filter'){
            isInsta = true;
        }
        if(k === 'in_reply_to_screen_name'){
            isTwitter = true;
        }
    })

    if(isInsta){
        return 'instagram';
    }
    else if(isTwitter){
        return 'twitter';
    }
    else{
        return 'facebook';
    }

}

function createSimpleDate(date){

}
