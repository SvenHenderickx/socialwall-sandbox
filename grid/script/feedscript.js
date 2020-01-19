var instaPosts;
var facebookPosts;
var twitterPosts;

var instaLoaded = false;
var facebookLoaded = false;
var twitterLoaded = false;

var instaCounter = 0;
var facebookCounter = 0;
var twitterCounter = 0;
var maxPostsPerChannel = 10;
var maxPostTotal = 20;

function getTwitterPosts(){

    $.ajax({
        url: 'php/twitterposts.php',
        type: "GET",
        success: function(data)
        {
            data = JSON.parse(data);
            twitterPosts = data;
            twitterLoaded = true;
        },
        error: function (xhr, ajaxOptions, thrownError)
        {
            $(input).text('Mislukt.');
            var errorMsg = 'Ajax request failed: ' + xhr.responseText;
            console.log(errorMsg);
        }
    })
}

function getFacebookPosts(){
    $.ajax({
        url: 'php/facebookposts.php',
        type: "GET",
        success: function(data)
        {
            data = JSON.parse(data);
            console.log(data);
            facebookPosts = data;
            facebookLoaded = true;
        },
        error: function (xhr, ajaxOptions, thrownError)
        {
            var errorMsg = 'Ajax request failed: ' + xhr.responseText;
            console.log(errorMsg, thrownError);
        }
    })
}

function getInstagramPosts(){
    var userFeed = new Instafeed({
        get: 'user',
        userId: 784297742,
        resolution: 'standard_resolution',
        accessToken: '784297742.1677ed0.155b78eba16f4362a7e7599c297cdb8b',
        limit: 60,
        mock: true,
        sortBy: 'most-recent',
        success: function(data){
            instaPosts = data;
            instaLoaded = true;
            // showInstaFeed();

        }
    });

    userFeed.run();
}

function checkVariable() {
   if (facebookLoaded && instaLoaded && twitterLoaded) {
       // $('#mixedfeed').empty();
       console.log('is loaded, show feed');
       showFeed();
       facebookLoaded = false;
       instaLoaded = false;
       twitterLoaded = false;
       instaCounter = 0;
       facebookCounter = 0;
       twitterCounter = 0;
   }
}

function refreshPosts(){
    if (!facebookLoaded || !instaLoaded || !twitterLoaded) {
        getInstagramPosts();
        getFacebookPosts();
        getTwitterPosts();
    }
}

$(document).ready(function(){
    refreshPosts();

    setInterval(checkVariable, 500);
    setInterval(refreshPosts, 60000);

});

function showFeed(){

    var mixedfeed = $.merge($.merge( [], instaPosts.data ), facebookPosts.posts );
    mixedfeed = $.merge($.merge( [], twitterPosts ), mixedfeed );

    mixedfeed = mixedfeed.sort(SortByDate);
    console.log(mixedfeed);

    $('#mixedfeed').empty();
    var count = 0;

    $.each(mixedfeed, function(k, v){

        addToFeed(v);
        count += 1;
        if(count > maxPostTotal){
            return false;
        }
    })
}

function SortByDate(a, b){
    var timeA = getDate(a);
    var timeB = getDate(b);

    if(timeA < timeB){
        return 1;
    }
    else if(timeA > timeB){
        return -1
    }
    else{
        return 0;
    }

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
        // console.log('added ' + caption);
    }

    if(checkSort(feedObject) == 'facebook' && facebookCounter < maxPostsPerChannel){
        var caption = '';
        var imagesrc = '';
        console.log('add facebook');
        console.log(feedObject);

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
            facebookCounter++;

            $('#mixedfeed').append('<div class="facebook_wrapper facebook">' + imagesrc + caption + '</div>');
            // console.log('added ' + caption);

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
        // console.log('added ' + caption);

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
        // console.log(a.created_time);
    }
    else if(checkSort(feedObject) == 'facebook'){
        return timeA = new Date(feedObject.created_time.date);
    }
    else if(checkSort(feedObject) == 'twitter'){
        if($.isArray(feedObject) && feedObject.length > 1){
            return timeA = new Date(feedObject[0].created_at);

        }
        else {
            return timeA = new Date(feedObject.created_at);
        }
        // console.log(a.created_at);
    }
}
