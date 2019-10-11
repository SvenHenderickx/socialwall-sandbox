$(document).ready(function(){
    $.ajaxSetup({ cache: true });
      $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
        FB.init({
          appId: '427412294581822',
          appSecret: 'ed3baf5e6989a074f4adbddcdc6ecbb1',
          version: 'v4.0'
        });

        // FB.login(function(response) {
        //     if (response.authResponse) {
        //      console.log('Welcome!  Fetching your information.... ');
        //      FB.api('/me', function(response) {
        //        console.log('Good to see you, ' + response.name + '.');
        //      });
        //     } else {
        //      console.log('User cancelled login or did not fully authorize.');
        //     }
        // });

        FB.api(
          '/me',
          'GET',
          {"fields":"posts{source,link,name,picture,full_picture,created_time,description}"},
          function(response) {
              console.log(response);
          }
        );

    });



    var instaPosts;

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

});
