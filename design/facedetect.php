<!DOCTYPE html>
<meta charset="utf-8">
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script type="text/javascript" src="script/facedetect.js"></script>
    <link href="style/style.css" rel="stylesheet" />
</head>
<body>
  <div id="videoDisclaimer">
    The video data is not being used or sent.
  </div>


    <div id="socialPosts">

      <div class="wall-2-instagram" id="instawall2">
          <div class="instagram-square-big">
              <img src="img/instapost.png">
          </div>
          <div class="wall-2-instapost">
              <span class="insta-header">
              <img src="img/instagram.png">
                  <h1>Instagram</h1>
              </span>
              <p>
                  <strong>@FontysICT</strong> -
                  Congrats to all students! 🎓🎉✨#proud #fontysict #fontysictinnovationlab #wearefontys
                  •
                  // REPOST // @annemariediepenbroek The first @fontysict graduation ceremony at the FontysICTInnovationLab @strijpt Congratulations to all the students!
                  </br>
                  </br>
                  <span class="insta-stats">
                      <img src="img/like.png">
                      29804 anderen vinden dit leuk
                  </span>
              </p>
          </div>
      </div>

      <div class="wall-2-instagram" id="instawall2">
          <div class="instagram-square-big">
              <img src="img/instapost2.png">
          </div>
          <div class="wall-2-instapost">
              <span class="insta-header">
              <img src="img/instagram.png">
                  <h1>Instagram</h1>
              </span>
              <p>
                  <strong>@FontysICT</strong> -
                  Do you want to learn more about bots and get inspired? 🤖 Do you want to see great projects and outcomes? Networking and contact with interesting students/companies? Join the event, acquire and increase your knowledge.Be part of the community ICT In Practice.
                  </br>
                  </br>
                  <span class="insta-stats">
                      <img src="img/like.png">
                      374 anderen vinden dit leuk
                  </span>
              </p>
          </div>
      </div>

    </div>


    <div id="processRing">
        <svg id="processRingsvg" viewbox="0 0 100 100">
        <!-- <circle cx="50" cy="50" r="45" fill="#FDB900"/> -->
        <path id="processRingPath" fill="none" stroke-linecap="round" stroke-width="6" stroke="#42ff00"
              stroke-dasharray="251.2,0"
              d="M50 10
                 a 40 40 0 0 1 0 80
                 a 40 40 0 0 1 0 -80">
          <animate id="ani-processRing" begin="click" attributeName="stroke-dasharray" from="0,251.2" to="251.2,0" dur="5s"/>
        </path>
        <text id="counter" x="50" y="50" text-anchor="middle" dy="7" font-size="12" fill="#fff">Tracking..</text>
      </svg>
    </div>

    <video  id="_webcam" style="display: none;" playsinline></video>
    <canvas id="_imageData"></canvas>


    <script src="script\brfv5_js_tk141119_v5.1.0_trial_no_modules.js"></script>

    <script>



    </script>
</body>
