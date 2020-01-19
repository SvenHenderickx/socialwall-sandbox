$(document).ready(function() {

    // setting up the connection between the script and the database
    var firebaseConfig = {
        apiKey: "AIzaSyAYogQHkZoucTX15Ote8o59Juxl8U0hi4M",
        authDomain: "socialwall-7d881.firebaseapp.com",
        databaseURL: "https://socialwall-7d881.firebaseio.com",
        projectId: "socialwall-7d881",
        storageBucket: "socialwall-7d881.appspot.com",
        messagingSenderId: "624194282989",
        appId: "1:624194282989:web:42b5daa1daef50950533e4",
        measurementId: "G-DN5CV7M2Y6"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    retrieve();

    document.getElementById('showmarquee').addEventListener('click', showmarquee);
    document.getElementById('showvideo').addEventListener('click', showvideo);
    document.getElementById('showmsocials');

    function showmarquee() {
        document.getElementById('marquee-editor').style.display = "block";
        document.getElementById('video-editor').style.display = "none";
    }

    function showvideo() {
        document.getElementById('marquee-editor').style.display = "none";
        document.getElementById('video-editor').style.display = "block";

        var ref = firebase.database().ref("mainvideo");
        ref.once("value")
            .then(function(snapshot) {
                var content = snapshot.child("video").val();
                document.getElementById('video-url').value = content;
            });
    }

    function retrieve() {

        var ref = firebase.database().ref("marquee");
        ref.once("value")
            .then(function(snapshot) {
                var content = snapshot.child("content").val();
                document.getElementById('marqueei').value = content;
                document.getElementById('marquee').innerText = content;
            });

    }

    document.getElementById('submit').addEventListener('click', update);
    document.getElementById('submit-vid').addEventListener('click', updatevid);

    function update() {

        let newcontent = document.getElementById('marqueei').value;

        firebase.database().ref('marquee').set({
            content: newcontent
        });

        retrieve();

    }

    function updatevid() {

        let vidurl = document.getElementById('video-url').value;

        firebase.database().ref('mainvideo').set({
            video: vidurl
        });

    }

});