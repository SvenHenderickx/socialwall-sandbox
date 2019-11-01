var instaPosts;
var facebookPosts;
var twitterPosts;

var instaLoaded = false;
var facebookLoaded = false;
var twitterLoaded = false;

var instaCounter = 0;
var facebookCounter = 0;
var twitterCounter = 0;
var maxPostsPerChannel = 5;

function getFacebookPosts(){
    $.ajaxSetup({ cache: true });
      $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
          appId:'529069617875587',
          version: 'v5.0'
        });

        var token = 'EAAHhL56iioMBAI0ZBvyYh3S1Mdpz3r7Yf5NwAAxkgx0ESiWQ6FVnJykOuujSTXaZCazta0D2TLVRznRMmYU5UreoJJQdH8B07zsOZAfg1bJKqyoeZA6sY2kXErUGyWNjplTp1uZBt7uitHP0uaMQwRZCvC0wtvqru9QHOeusE6h5Q6RcLE1L9a4mhlUMMZAeduvZAielDk5QmixzqTPftShCzWlSkgx9HN2nEMQXDCg4twZDZD';

        var pageid = '362165877144004';

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
        // console.log(v);
        addToFeed(v);
        count += 1;
        if(count > 1000){
            // return false;
        }
    })
}

function SortByDate(a, b){
    var timeA = getDate(a);
    var timeB = getDate(b);

    console.log(timeA);
    console.log(timeB);

    if(timeA < timeB){
        console.log(1);
        return 1;
    }
    else if(timeA > timeB){
        console.log(-1);
        return -1
    }
    else{
        return 0;
    }

    // return -1000;
    console.log(timeA < timeB);
}

function addToFeed(feedObject){
    if(checkSort(feedObject) == 'instagram' && instaCounter < maxPostsPerChannel){
        instaCounter++;
        var caption = '';
        var imagesrc = '';

        if(feedObject.caption !== null){
            caption = "<p>" + instaCounter + ' - ' + feedObject.caption.text + "</p>";
        }

        if(feedObject.images !== null){
            imagesrc = '<img class="instapic" src="' + feedObject.images.standard_resolution.url + '"/>';
        }

        var date = new Date(feedObject.created_time * 1000)
        date = '<small>' + date + '</small>'

        $('#mixedfeed').append('<div class="facebook_wrapper instagram">' + imagesrc + ' ' + caption + '</div>');
    }

    if(checkSort(feedObject) == 'facebook' && facebookCounter < maxPostsPerChannel){
        facebookCounter++;
        var caption = '';
        var imagesrc = '';
        // console.log(value);

        $.each(feedObject, function(k, v){
            if(k == 'message'){
                caption = '<p>' + facebookCounter + ' - '+ v + '</p>';
            }

            if(k == 'full_picture'){
                imagesrc = '<img src="' + v + '" />';
            }
        })

        var date = '<small>' + new Date(feedObject.created_time) + '</small>'

        if(caption.length > 0 || imagesrc.length > 0){

            $('#mixedfeed').append('<div class="facebook_wrapper facebook">' + imagesrc + caption + '</div>');
        }
    }

    if(checkSort(feedObject) == 'twitter' && twitterCounter < maxPostsPerChannel){
        twitterCounter++;
        var caption = '';
        var imagesrc = '';

        if(feedObject.text !== null){
            caption = "<p>" + twitterCounter + ' - '+ feedObject.text + "</p>";
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

        $('#mixedfeed').append('<div class="facebook_wrapper twitter">' + imagesrc + ' ' + caption + '</div>');
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

function getDate(feedObject){
    if(checkSort(feedObject) == 'instagram'){
        return timeA = new Date(feedObject.created_time * 1000);
        console.log(a.created_time);
    }
    else if(checkSort(feedObject) == 'facebook'){
        return timeA = new Date(feedObject.created_time);
        console.log(a.created_time);
    }
    else if(checkSort(feedObject) == 'twitter'){
        if($.isArray(feedObject) && feedObject.length > 1){
            return timeA = new Date(feedObject[0].created_at);

        }
        else {
            return timeA = new Date(feedObject.created_at);
        }
        console.log(a.created_at);
    }
}
