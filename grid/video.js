// hieronder fetch ik eerst de JSON file die ik opvraag bij Google
    fetch('https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyB6ahTydl8uyP-N5pX4HOSoORdb_Or7e0M&part=snippet&playlistId=UUKwzgt7L00x9_iMo3bbW_6A&maxResults=1&resultsPerPage=1')
        .then(response => {
            return response.json();
        })
        .then(data => {
            // hieronder ga ik aan de slag met de JSON file die ik opgehaald heb.
            var datafile = data.items;

            // een functie die ik gebruik waardoor ik lange teksten korter kan maken en kan eindigen met een stel puntjes...
            String.prototype.trunc = String.prototype.trunc ||
                function(n){
                    return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
                };

            for ( var i in datafile) { // voor elk item in de JSON ga ik het volgende doen
                var title = datafile[i].snippet.title; // haal de title van elke video op
                var desc = datafile[i].snippet.description; // haal de description van elke video op

                document.getElementById('desc-title').innerText = title;
                document.getElementById('desc-desc').innerText = desc;

                var videoid = datafile[i].snippet.resourceId.videoId; // haal het videoid op

                document.getElementById('iframevid').src = 'https://www.youtube.com/embed/' + videoid;


            };


        })
        .catch(err => {
            // Do something for an error here
        });