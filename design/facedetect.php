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
    <div id="processRing">
      <svg id="processRingsvg" viewbox="0 0 100 100">
      <!-- <circle cx="50" cy="50" r="45" fill="#FDB900"/> -->
      <path fill="none" stroke-linecap="round" stroke-width="6" stroke="#42ff00"
            stroke-dasharray="251.2,0"
            d="M50 10
               a 40 40 0 0 1 0 80
               a 40 40 0 0 1 0 -80">
        <animate attributeName="stroke-dasharray" from="0,251.2" to="251.2,0" dur="5s"/>
      </path>
      <text id="count" x="50" y="50" text-anchor="middle" dy="7" font-size="20" fill="#fff">100%</text>
    </svg>
    </div>
    <video  id="_webcam" style="display: none;" playsinline></video>
    <canvas id="_imageData"></canvas>


    <script src="script\brfv5_js_tk141119_v5.1.0_trial_no_modules.js"></script>

    <script>



    </script>
</body>
