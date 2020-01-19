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

    var ref = firebase.database().ref("marquee");
    ref.once("value")
        .then(function(snapshot) {
            var marquee = snapshot.child("content").val();
            document.getElementById('scroller1').innerText = marquee;
        });

});