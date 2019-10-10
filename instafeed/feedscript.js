$(document).ready(function(){
    var userFeed = new Instafeed({
        get: 'user',
        userId: 784297742,
        resolution: 'standard_resolution',
        accessToken: '784297742.1677ed0.155b78eba16f4362a7e7599c297cdb8b',
        template: '<div class="instapic_wrapper"><img class="instapic" src="{{image}}" /><p>{{caption}}</p></div>',
        mock: true,
        success: function(data){
            console.log(data);
        }

    });
    userFeed.run();
});
