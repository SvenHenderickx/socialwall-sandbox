var instaPosts;
var facebookPosts;

var instaLoaded = false;
var facebookLaoded = false;


$(document).ready(function(){

    $.ajaxSetup({ cache: true });
      $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
          appId:'529069617875587',
          version: 'v5.0'
        });

        var token = 'EAAHhL56iioMBAH766dMhfdoomLhRUL0E05BDZAMlnL0zxfWZBajf2zlt5fzhrymOqcoXfZBcH7ZBh126TkJcHD2fT0oSxHRIhOKZBuHynygp39ZB3xDYSfo6WYHniamoYWB8T9e8Ma7wGGUVGRXSDxZBgZAvcSzkivQSIaPJxjN0xd7ekitATZBZBVMVWvZAFfOr40xGUKHYRGj5AZDZD';

        FB.api(
              '/me',
              'GET',
              { access_token : token,
                  "fields":"posts{source,full_picture,message,description,created_time}"},
                function(response) {
                  facebookPosts = response;
                  facebookLaoded = true;
                  // console.log(facebookPosts);
                  // showFacebookFeed();
              }
        );

    });


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

    function showInstaFeed(){

        $.each(instaPosts.data, function(k, v) {
            // console.log(v);

            var caption = '';
            var imagesrc = '';
            if(v.caption !== null){
                caption = "<p>" + v.caption.text + "</p>";
            }

            if(v.images !== null){
                imagesrc = '<img class="instapic" src="' + v.images.standard_resolution.url + '"/>';
            }


            $('#instafeed').append('<div class="instapic_wrapper">' + imagesrc + ' ' + caption + '</div>');

        });
    }

    function showFacebookFeed(){
        $.each(facebookPosts.posts.data, function (key, value) {
            var caption = '';
            var imagesrc = '';
            // console.log(value);

            $.each(value, function(k, v){
                if(k == 'message'){
                    caption = '<p>' + v + '</p>';
                }

                if(k == 'full_picture'){
                    imagesrc = '<img src="' + v + '" />';
                }
            })

            if(caption.length > 0 || imagesrc.length > 0){

                $('#facebookfeed').append('<div class="facebook_wrapper">' + imagesrc + caption + '</div>');
            }

        })
    }

    function checkVariable() {
       if (facebookLaoded && instaLoaded) {
           showFeed();
       }
    }

     setTimeout(checkVariable, 1500);

});

function showFeed(){

    console.log('test');
    var mixedfeed = $.merge( $.merge( [], instaPosts.data ), facebookPosts.posts.data );
    mixedfeed.sort(SortByDate);

    // console.log(mixedfeed);

    $.each(mixedfeed, function(k, v){
        addToFeed(v);
    })
}

function SortByDate(a, b){
    if($.isNumeric(a.created_time)){
        var timeA = new Date($(a.created_time).text()*1000);
    }
    else{
        var timeA = new Date($(a.created_time).text());
    }


    if($.isNumeric(b.created_time)){
        var timeA = new Date($(b.created_time).text()*1000);
    }
    else{
        var timeB = new Date($(b.created_time).text());
    }

    return timeA - timeB;
}

function addToFeed(feedObject){
    if(checkSort(feedObject) == 'instagram'){
        var caption = '';
        var imagesrc = '';

        console.log('instagram object');
        console.log(feedObject);

        if(feedObject.caption !== null){
            caption = "<p>" + feedObject.caption.text + "</p>";
        }

        if(feedObject.images !== null){
            imagesrc = '<img class="instapic" src="' + feedObject.images.standard_resolution.url + '"/>';
        }

        var date = new Date(feedObject.created_time * 1000)
        date = '<small>' + date + '</small>'

        $('#mixedfeed').append('<div class="facebook_wrapper">' + imagesrc + ' ' + caption + date + '</div>');
    }

    if(checkSort(feedObject) == 'facebook'){
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

        var date = '<small>' + feedObject.created_time + '</small>'

        if(caption.length > 0 || imagesrc.length > 0){

            $('#mixedfeed').append('<div class="facebook_wrapper">' + imagesrc + caption + date + '</div>');
        }
    }
}

function checkSort(feedObject){
    var isInsta = false;

    $.each(feedObject, function(k, v){
        console.log(v);
        if(k === 'filter'){
            isInsta = true;
        }
    })

    if(isInsta){
        return 'instagram';
    }
    else{
        return 'facebook';
    }
}
