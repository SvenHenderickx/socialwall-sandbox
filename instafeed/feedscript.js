$(document).ready(function(){
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

    FB.api(
      '/me',
      'GET',
      {"fields":"posts{source,link,name,picture,full_picture,created_time,description}"},
      function(response) {
          console.log(response);
      }
    );

    userFeed.run();

    function showFeed(){
        console.log(instaPosts);
        $.each(instaPosts.data, function(k, v) {
            console.log(v);

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
