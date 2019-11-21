var amountOfBubble = 4;
var radius = 180;
var pushbackPx = 40;
var types = [
    'facebook',
    'twitter',
    'instagram'
];
var bubbles = [];

var maxX;
var maxY;
var minX = 0;
var minY = 0;
var moveDis = 10;
var moveSpeed = 400;


$(document).ready(function(){
    var maxX = $("#canvas").width() - (radius * 2);
    var maxY = $('#canvas').height() - (radius * 2);
    for(var i = 0; i < types.length; i++){
        do {
            newBubble = new Bubble(i, getRandomInt(minX, maxX), getRandomInt(minX, maxY), radius, 'facebook');
        }
        while(hasCollision(newBubble));

        bubbles.push(newBubble);
    }

    $.each(bubbles, function(k, v){
        createBubble(v);
    })

    setInterval(moveBubbles, moveSpeed);

})

function Bubble(id, x, y, radius, type) {
    this.id = id;
    this.x = x;
    this.xmax = x + radius;
    this.y = y;
    this.ymax = y + radius;
    this.radius = radius;
    this.type = type;

    return this;
}

function createBubble(bubble){
    $('#canvas').append('<div data-id="' + bubble.id + '" class="socialBubble ' + bubble.type + '" style="width:' + bubble.radius + 'px;height:' + bubble.radius + 'px;left:' + bubble.x + 'px; top:' + bubble.y + 'px"></div>');
}

function getRandomInt(min, max) {

    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function hasCollision(bubble){
    var hasHit = false;
    for(var i = 0; i < bubbles.length; i++){

            var distX = Math.abs(bubbles[i].x - bubble.x);
            var distY = Math.abs(bubbles[i].y - bubble.y);

            if(distX < (radius + pushbackPx) && bubbles[i].x > minX + pushbackPx && bubbles[i].xmax < maxX - pushbackPx){
                console.log(distX);
                return true;
            }

            if(distY < (radius + pushbackPx) && bubbles[i].y > minY + pushbackPx && bubbles[i].ymax < maxY - pushbackPx){
                console.log(distY);
                return true;

            }

    }
    console.log(hasHit);
    return false;
}


function moveBubbles(){
    console.log('in move bubbles');
    for(var i = 0; i < bubbles.length; i++){
        $('div#canvas div.socialBubble').each(function(){
            if($(this).attr('data-id') == bubbles[i].id){
            //     var rndx = getRandomInt(0, moveDis);
            //     var rndy = getRandomInt(0, moveDis);
            //     var mltpl = 10;
            //
            //
            //
            //     if(Math.random() > .5){
            //         var bubbleTemp = bubbles[i];
            //         bubbleTemp.x -= rndx;
            //         bubbleTemp.y -= rndy;
            //         if(!hasCollision(bubbleTemp)){
            //             bubbles[i] = bubbleTemp;
            //         }
            //         else{
            //             bubbleTemp.x += rndx;
            //             bubbleTemp.y += rndy;
            //             bubbles[i] = bubbleTemp;
            //         }
            //     }
            //     else{
            //         var bubbleTemp = bubbles[i];
            //         bubbleTemp.x += rndx;
            //         bubbleTemp.y += rndy;
            //         if(!hasCollision(bubbleTemp)){
            //             bubbles[i] = bubbleTemp;
            //         }
            //         else{
            //             bubbleTemp.x -= rndx;
            //             bubbleTemp.y -= rndy;
            //             bubbles[i] = bubbleTemp;
            //         }
            //     }

                $(this).css({'top': bubbles[i].x, 'left': bubbles[i].y});
            }
        })
    }
}
