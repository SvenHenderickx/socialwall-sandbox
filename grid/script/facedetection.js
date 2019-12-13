var facex = 0;
var facey = 0;

var width;
var height;
var timerSeen = 0;
var timerNotseen = 0;
var seenPerson = false;
var smileFactor;

 const toDegree = (x)       => { return (x * 180.0 / Math.PI); }
 const toRadian = (x)       => { return (x * Math.PI / 180.0); }
 const length   = (x, y)    => { return Math.sqrt((x * x) + (y * y)); };
 const distance = (p0, p1)  => { return length((p1.x - p0.x), (p1.y - p0.y)); };
 const angle    = (p0, p1)  => { return Math.atan2((p1.y - p0.y), (p1.x - p0.x)) };

 const setPointFromVertices = (v, i, p) => {

  p.x = v[i * 2]
  p.y = v[i * 2 + 1]
}

 const applyMovementVector = (p, p0, pmv, f) => {

  p.x = p0.x + pmv.x * f
  p.y = p0.y + pmv.y * f
}

 const interpolatePoint = (p, p0, p1, f) => {

  p.x = p0.x + f * (p1.x - p0.x)
  p.y = p0.y + f * (p1.y - p0.y)
}

 const getAveragePoint = (p, ar) => {

  p.x = 0.0
  p.y = 0.0

  for(let i = 0; i < ar.length; i++) {

    p.x += ar[i].x;
    p.y += ar[i].y;
  }

  p.x /= ar.length
  p.y /= ar.length;
}

 const getMovementVector = (p, p0, p1, f) => {

  p.x = f * (p1.x - p0.x)
  p.y = f * (p1.y - p0.y)
}

 const getMovementVectorOrthogonalCW = (p, p0, p1, f) => {

  getMovementVector(p, p0, p1, f)

  const x = p.x
  const y = p.y

  p.x = -y
  p.y = x
}

 const getMovementVectorOrthogonalCCW = (p, p0, p1, f) => {

  getMovementVector(p, p0, p1, f)

  const x = p.x
  const y = p.y

  p.x = y
  p.y = -x
}

 const getIntersectionPoint = (p, pk0, pk1, pg0, pg1) => {

  //y1 = m1 * x1  + t1 ... y2 = m2 * x2 + t1
  //m1 * x  + t1 = m2 * x + t2
  //m1 * x - m2 * x = (t2 - t1)
  //x * (m1 - m2) = (t2 - t1)

  let dx1 = (pk1.x - pk0.x); if(dx1 === 0) dx1 = 0.01;
  let dy1 = (pk1.y - pk0.y); if(dy1 === 0) dy1 = 0.01;

  let dx2 = (pg1.x - pg0.x); if(dx2 === 0) dx2 = 0.01;
  let dy2 = (pg1.y - pg0.y); if(dy2 === 0) dy2 = 0.01;

  const m1 = dy1 / dx1
  const t1 = pk1.y - m1 * pk1.x

  const m2 = dy2 / dx2
  const t2 = pg1.y - m2 * pg1.x

  let m1m2 = (m1 - m2); if(m1m2 === 0) m1m2 = 0.01;
  let t2t1 = (t2 - t1); if(t2t1 === 0) t2t1 = 0.01;

  const px = t2t1 / m1m2
  const py = m1 * px + t1

  p.x = px
  p.y = py
}


// end geom
//

// import { distance, setPointFromVertices } from './utils__geom.js'

const _p0 = { x: 0, y: 0 }
const _p1 = { x: 0, y: 0 }

// Returns a 'smileFactor' between 0.0 ... 1.0
// Works with 68l and 42l models.
 const detectSmile = (face) => {

  const vertices = face.vertices
  const is68lModel = vertices.length === 68 * 2 || vertices.length === 74 * 2

  if(is68lModel) {

    setPointFromVertices(vertices, 48, _p0); // mouth corner left
    setPointFromVertices(vertices, 54, _p1); // mouth corner right

  } else { // 42l model

    setPointFromVertices(vertices, 40, _p0); // mouth corner left
    setPointFromVertices(vertices, 41, _p1); // mouth corner right
  }

  let mouthWidth = distance(_p0, _p1);

  if(is68lModel) {

    setPointFromVertices(vertices, 36, _p1); // left eye outer corner
    setPointFromVertices(vertices, 45, _p0); // right eye outer corner

  } else { // 42l model

    setPointFromVertices(vertices, 36, _p1); // left eye outer corner
    setPointFromVertices(vertices, 39, _p0); // right eye outer corner

    mouthWidth /= 0.8
  }

  const eyeDist = distance(_p0, _p1);

  smileFactor = mouthWidth / eyeDist;

  const rotX     = face.rotationX < 0.0 ? face.rotationX : 0.0
  const percRotX = Math.abs(rotX) / 25.0

  smileFactor -= (0.60 + percRotX * 0.14); // 0.60 - neutral, 0.70 smiling

  if(smileFactor > 0.125) smileFactor = 0.125;
  if(smileFactor < 0.000) smileFactor = 0.000;

  smileFactor *= 8.0;

  if(smileFactor < 0.0) { smileFactor = 0.0; }
  if(smileFactor > 1.0) { smileFactor = 1.0; }

  return smileFactor;
};

 // default { detectSmile }

// end smile detect

// import { detectSmile }                      from '../utils/utils__smile_detection.js'

$(document).ready(function(){

    width = $('body').width();
    height = $('body').height();

    // Set the BRFv5 library name here, also set your own appId for reference.

    const _libraryName    = 'brfv5_js_tk141119_v5.1.0_trial.brfv5'
    const _appId          = 'brfv5.browser.minimal.nomodules' // (mandatory): 8 to 64 characters, a-z . 0-9 allowed
    const brfv5           = {} // The library namespace.

    // References to the video and canvas.
    const _webcam         = document.getElementById('_webcam')
    const _imageData      = document.getElementById('_imageData')

    // Those variables will be retrieved from the stream and the library.
    let _brfv5Manager     = null
    let _brfv5Config      = null
    let _width            = 0
    let _height           = 0

    // loadBRFv5Model and openCamera are being done simultaneously thanks to Promises. Both call
    // configureTracking which only gets executed once both Promises were successful. Once configured
    // trackFaces will do the tracking work and draw the results.

    const loadBRFv5Model  = (modelName, numChunksToLoad, pathToModels = '', appId = null, onProgress = null) => {

      console.log('loadBRFv5Model')

      if(!modelName) { throw 'Please provide a modelName.' }

      return new Promise((resolve, reject) => {

        if(_brfv5Manager && _brfv5Config) {

          resolve({ brfv5Manager: _brfv5Manager, brfv5Config: _brfv5Config })

        } else {

          try {

            brfv5.appId             = appId ? appId : _appId
            brfv5.binaryLocation    = pathToModels + _libraryName
            brfv5.modelLocation     = pathToModels + modelName + '_c'
            brfv5.modelChunks       = numChunksToLoad // 4, 6, 8
            brfv5.binaryProgress    = onProgress
            brfv5.binaryError       = (e) => { reject(e) }
            brfv5.onInit            = (brfv5Manager, brfv5Config) => {

              _brfv5Manager         = brfv5Manager
              _brfv5Config          = brfv5Config

              resolve({ brfv5Manager: _brfv5Manager, brfv5Config: _brfv5Config })
            }

            brfv5Module(brfv5)

          } catch(e) {

            reject(e)
          }
        }
      })
    }

    const openCamera = () => {

      console.log('openCamera')

      return new Promise((resolve, reject) => {

        window.navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, frameRate: 30, facingMode: 'user'} })
          .then((mediaStream) => {

            _webcam.srcObject = mediaStream
            _webcam.play().then(() => { resolve({ width: _webcam.videoWidth, height: _webcam.videoHeight }) }).catch((e) => { reject(e) })

          }).catch((e) => { reject(e) })
      })
    }

    const configureTracking = () => {

      if(_brfv5Config !== null && _width > 0) {

        // Camera stream and BRFv5 are ready. Now configure. Internal defaults are set for a 640x480 resolution.
        // So the following isn't really necessary.

        const brfv5Config = _brfv5Config
        const imageWidth  = _width
        const imageHeight = _height

        const inputSize = imageWidth > imageHeight ? imageHeight : imageWidth

        // Setup image data dimensions

        brfv5Config.imageConfig.inputWidth  = imageWidth
        brfv5Config.imageConfig.inputHeight = imageHeight

        const sizeFactor      = inputSize / 480.0

        // Set face detection region of interest and parameters scaled to the image base size.

        brfv5Config.faceDetectionConfig.regionOfInterest.setTo(0, 0, imageWidth, imageHeight)

        brfv5Config.faceDetectionConfig.minFaceSize = 144 * sizeFactor
        brfv5Config.faceDetectionConfig.maxFaceSize = 480 * sizeFactor

        if(imageWidth < imageHeight) {

          // Portrait mode: probably smartphone, faces tend to be closer to the camera, processing time is an issue,
          // so save a bit of time and increase minFaceSize.

          brfv5Config.faceDetectionConfig.minFaceSize = 240 * sizeFactor
        }

        // Set face tracking region of interest and parameters scaled to the image base size.

        brfv5Config.faceTrackingConfig.regionOfInterest.setTo(0, 0, imageWidth, imageHeight)

        brfv5Config.faceTrackingConfig.minFaceScaleStart        =  50.0  * sizeFactor
        brfv5Config.faceTrackingConfig.maxFaceScaleStart        = 320.0  * sizeFactor

        brfv5Config.faceTrackingConfig.minFaceScaleReset        =  35.0  * sizeFactor
        brfv5Config.faceTrackingConfig.maxFaceScaleReset        = 420.0  * sizeFactor

        brfv5Config.faceTrackingConfig.confidenceThresholdReset = 0.001

        brfv5Config.faceTrackingConfig.enableStabilizer         = true

        brfv5Config.faceTrackingConfig.maxRotationXReset        = 35.0
        brfv5Config.faceTrackingConfig.maxRotationYReset        = 45.0
        brfv5Config.faceTrackingConfig.maxRotationZReset        = 34.0

        brfv5Config.faceTrackingConfig.numTrackingPasses        = 3
        brfv5Config.faceTrackingConfig.enableFreeRotation       = true
        brfv5Config.faceTrackingConfig.maxRotationZReset        = 999.0

        brfv5Config.faceTrackingConfig.numFacesToTrack          = 1
        brfv5Config.enableFaceTracking                          = true

        console.log('configureTracking:', _brfv5Config)

        _brfv5Manager.configure(_brfv5Config)

        trackFaces()
      }
    }

    const trackFaces = () => {

      if(!_brfv5Manager || !_brfv5Config || !_imageData) { return }

      const ctx = _imageData.getContext('2d')

      ctx.setTransform(-1.0, 0, 0, 1, _width, 0) // A virtual mirror should be... mirrored
      ctx.drawImage(_webcam, 0, 0, _width, _height)
      ctx.setTransform(1.0, 0, 0, 1, 0, 0) // unmirror to draw the results

      _brfv5Manager.update(ctx.getImageData(0, 0, _width, _height))

      let doDrawFaceDetection = !_brfv5Config.enableFaceTracking

      if(_brfv5Config.enableFaceTracking) {

        const sizeFactor = Math.min(_width, _height) / 480.0
        const faces      = _brfv5Manager.getFaces()

        for(let i = 0; i < faces.length; i++) {

          const face = faces[i]

          if(face.state === brfv5.BRFv5State.FACE_TRACKING) {

            drawRect(ctx, _brfv5Config.faceTrackingConfig.regionOfInterest, '#00a0ff', 2.0)

            drawCircles(ctx, face.landmarks, '#00a0ff', 2.0 * sizeFactor)
            drawRect(ctx, face.bounds, '#ffffff', 1.0)
            facex = face.landmarks[27].x;
            facey = face.landmarks[27].y;

            facex = (facex / _width) * width;
            facey = (facey / _height) * height + minHeight;
            $('#facepoint').show();
            $('#facepoint').css(
                {
                    'top': facey + "px",
                    'left': facex + "px"
                }
            );

            if(!seenPerson){
                seePerson();
            }
            else{
                seenPerson = true;
            }
            console.log(smileFactor);


          } else {

            if(timerNotseen){
                clearTimeout(timerNotseen);
            }
            timerNotseen = setTimeout(function(){ seenPerson = false }, 5 * 1000);

            $('#facepoint').hide();
            doDrawFaceDetection = true
          }
        }
      }

      if(doDrawFaceDetection) {

        // Only draw face detection results, if face detection was performed.

        drawRect( ctx, _brfv5Config.faceDetectionConfig.regionOfInterest, '#ffffff', 2.0)
        drawRects(ctx, _brfv5Manager.getDetectedRects(), '#00a0ff', 1.0)
        drawRects(ctx, _brfv5Manager.getMergedRects(), '#ffffff', 3.0)
      }
      // console.log(trackFaces)
      requestAnimationFrame(trackFaces)
    }

    openCamera().then(({ width, height }) => {

      console.log('openCamera: done: ' + width + 'x' + height)

      _width            = width
      _height           = height

      _imageData.width  = _width
      _imageData.height = _height

      configureTracking()

    }).catch((e) => { if(e) { console.error('Camera failed: ', e) } })

    loadBRFv5Model('68l', 8, './js/brfv5/models/', _appId,
      (progress) => { console.log(progress) }).then(({ brfv5Manager, brfv5Config }) => {

      console.log('loadBRFv5Model: done')

      _brfv5Manager  = brfv5Manager
      _brfv5Config   = brfv5Config

      configureTracking()

    }).catch((e) => { console.error('BRFv5 failed: ', e) })

    const drawCircles    = (ctx, array, color, radius) => {

      ctx.strokeStyle           = null
      ctx.fillStyle             = getColor(color, 1.0)

      let _radius               = radius || 2.0

      for(let i = 0; i < array.length; ++i) {

        ctx.beginPath()
        ctx.arc(array[i].x, array[i].y, _radius, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    const drawRect       = (ctx, rect, color, lineWidth) => {

      ctx.strokeStyle           = getColor(color, 1.0)
      ctx.fillStyle             = null

      ctx.lineWidth             = lineWidth || 1.0

      ctx.beginPath()
      ctx.rect(rect.x, rect.y, rect.width, rect.height)
      ctx.stroke()
    }

    const drawRects      = (ctx, rects, color, lineWidth) => {

      ctx.strokeStyle           = getColor(color, 1.0)
      ctx.fillStyle             = null

      ctx.lineWidth             = lineWidth || 1.0

      for(let i = 0; i < rects.length; ++i) {

        let rect                = rects[i]

        ctx.beginPath()
        ctx.rect(rect.x, rect.y, rect.width, rect.height)
        ctx.stroke()
      }
    }

    const getColor = (color, alpha) => {

      const colorStr = color + ''

      if(colorStr.startsWith('rgb')) {

        return color
      }

      if(colorStr.startsWith('#')) {

        color = parseInt('0x' + colorStr.substr(1))
      }

      return 'rgb(' +
        (((color >> 16) & 0xff).toString(10)) + ', ' +
        (((color >> 8) & 0xff).toString(10))  + ', ' +
        (((color) & 0xff).toString(10)) + ', ' + alpha +')'
    }
})

function seePerson(){
    // alert('PERSON');
    seenPerson = true;
    // showPopUpHelp();
    // setTimeout(removePopUp, 5000);
}

function showPopUpHelp(){
    $('body').append('<div class="popup_wrapper"><div class="popup_container"><p>Gebruik je gezicht om een item te selecteren. LACHEN!</p></div></div>');
}

function removePopUp(){
    $('.popup_wrapper').remove();
}
