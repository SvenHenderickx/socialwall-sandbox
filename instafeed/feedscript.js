$(document).ready(function(){
    var instaPosts;
    var facebookPosts;

    $.ajaxSetup({ cache: true });
      $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
          appId:'529069617875587',
          version: 'v5.0'
        });

        var token = 'EAAHhL56iioMBACmZCxlpTZBPo8koSbVFWOlKbjrl9zmBPqBZBFhO5v8IoDYU12UzznpXDyjk2gz6FXmfx9KspE5RYevpOFmB5jDhxgvVToQ1KTrATfGUEKZBFzAuZB91sZAX8Q0knrHvDMZA3xi9PtgsGl7qpb8mMh8VSIdsG64PYkmndwh4HcyUr6SBFGdhawZD';

        FB.api(
              '/me',
              'GET',
              { access_token : token,
                  "fields":"posts{source,full_picture,message,description}"},
                function(response) {
                  facebookPosts = response;
                  showFacebookFeed();
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
            showFeed();
        }

    });

    userFeed.run();

    function showFeed(){

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

});
