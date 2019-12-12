var facex = 0;
var facey = 0;

$(document).ready(function() {

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
           facey = (facey / _height) * height;

           $('#facepoint').css(
               {
                   'top': facey + "px",
                   'left': facex + "px"
               }
           );

           // console.log(facex);

         } else {

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

    var width = $('#chart').width(),
        height = $('#chart').height(),
        root;

    var force = d3.layout.force()
        .linkDistance(500)
        .charge(-100)
        .gravity(.002)
        .size([width, height])
        .on("tick", tick);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    d3.json("script/graph.json", function(error, json) {
        if (error) throw error;

        root = json;
        update();
    });

    function update() {
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        console.log(nodes);

        // Restart the force layout.
        force
            .nodes(nodes)
            .links(links)
            .start();

        // Update links.
        link = link.data(links, function(d) {
            return d.target.id;
        });

        link.exit().remove();

        link.enter().insert("line", ".node")
            .attr("class", "link");

        // Update nodes.
        node = node.data(nodes, function(d) {
            return d.id;
        });

        node.exit().remove();

        var nodeEnter = node.enter().append("g")
            .attr("class", classes)
            .attr("data-id", dataid)
            .on("click", click)
            .call(force.drag);

        nodeEnter.append("circle")
            .attr("r", size);

        nodeEnter.append("text")
            .attr("dy", ".35em")
            .text(returntext);

        node.select("circle")
            .style("fill", color);
    }

    function tick() {
        link.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });



        showPosts();
    }

    function color(d) {
        return d._children ? "#3182bd" // collapsed package
            :
            d.children ? "#c6dbef" // expanded package
            :
            "#fd8d3c"; // leaf node
    }

    function size(d){
        return d._children ? 100 // collapsed package
            :
            d.children ? 100 // expanded package
            :
            200; // leaf node
    }

    function classes(d){
        return d._children ? "node" // collapsed package
            :
            d.children ? "node" // expanded package
            :
            "post"; // leaf node
    }

    function returntext(d){
        return d._children ? d.name // collapsed package
            :
            d.children ? d.name // expanded package
            :
            ""; // leaf node
    }

    function dataid(d){
        return d._children ? -1// collapsed package
            :
            d.children ? -1 // expanded package
            :
            d.id; // leaf node
    }

    // Toggle children on click.
    function click(d) {
        if (d3.event.defaultPrevented) return; // ignore drag
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        removePosts();
        update();
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
        var nodes = [],
            i = 0;

        function recurse(node) {
            if (node.children) node.children.forEach(recurse);
            if (!node.id) node.id = ++i;
            nodes.push(node);
        }

        recurse(root);
        return nodes;
    }

})

function showPosts() {
    $.each($('div#chart .post'), function(k, v) {

        var pos = $(v)[0].getAttribute('transform');
        var result = pos.split(',');
        var xpos = result[0].substr(10);
        var ypos = result[1].substr(0, result[1].length - 1);

        // $('.postblock').text("{'top': "+ xpos + ", 'left': " + ypos + "}");
        // $('.postblock').css({'top': xpos + "px", 'left': ypos + "px"});
        var isAdded = false;

        $.each($('div#chart .postblock'), function(kp, vp) {
            if ($(vp).attr('data-id') == $(v).attr('data-id')) {
                $(vp).css({
                    'top': ypos - 200 + "px",
                    'left': xpos - 200 + "px"
                });

                // $(vp).attr('transform', pos);
                isAdded = true;
            }

        })

        if(!isAdded){
            $('#chart').append('<div class="postblock" data-id="' + $(v).attr('data-id') + '" style="top: ' + xpos + '; left:' + ypos + ';"><h1>Social Media - Post</h1><p>Voorbeeld tekst</p></div>');
        }
    })

    removePosts();
}

function removePosts(){
    $.each($('div#chart .postblock'), function(k, v) {

        var isAdded = false;

        $.each($('div#chart .post'), function(kp, vp) {
            if ($(vp).attr('data-id') == $(v).attr('data-id')) {

                isAdded = true;
            }

        })

        if(!isAdded){
            $(v).remove();
        }
    })
}
