var amountOfBubble = 4;
var radius = 200;
var pushbackPx = 100;
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
var moveDis = 50;
var moveSpeed = 1000;


$(document).ready(function(){
    maxX = $("#canvas").width();
    maxY = $('#canvas').height();
    for(var i = 0; i < types.length; i++){
        do {
            newBubble = new Bubble(i, getRandomInt(minX + pushbackPx, maxX - pushbackPx), getRandomInt(minX + pushbackPx, maxY - pushbackPx), radius, types[i]);
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
    if(!(bubble.x > (minX + pushbackPx))){
        return true;
    }

    if(!(bubble.xmax < (maxX - pushbackPx))){
        return true;
    }

    if(!(bubble.y > (minY + pushbackPx))){
        return true;
    }

    if(!(bubble.ymax < (maxY - pushbackPx))){
        return true;
    }


    for(var i = 0; i < bubbles.length; i++){
        if(bubbles[i].id != bubble.id){
            var distX = Math.abs(bubbles[i].x - bubble.x);
            var distY = Math.abs(bubbles[i].y - bubble.y);

            if(distX < (radius)){
                return true;
            }

            if(distY < (radius)){
                return true;

            }
        }


    }

    console.log('correct');
    return false;
}


function moveBubbles(){
    console.log('in move bubbles');
    for(var i = 0; i < bubbles.length; i++){
        $('div#canvas div.socialBubble').each(function(){
            if($(this).attr('data-id') == bubbles[i].id){
                var rndx = getRandomInt(0, moveDis);
                var rndy = getRandomInt(0, moveDis);
                var mltpl = 5;
                var rnd = Math.random();

                var bubbleTemp = bubbles[i];
                console.log(bubbleTemp);

                if(rnd > .75){

                    bubbleTemp.x -= rndx;

                    if(!hasCollision(bubbleTemp)){
                        bubbles[i] = bubbleTemp;
                        $(this).css({'top': bubbles[i].x, 'left': bubbles[i].y});
                    }

                }
                else if(rnd > .5){
                    bubbleTemp.x += rndx;
                    if(!hasCollision(bubbleTemp)){
                        bubbles[i] = bubbleTemp;
                        $(this).css({'top': bubbles[i].x, 'left': bubbles[i].y});
                    }
                }
                else if(rnd > .25){
                    bubbleTemp.y -= rndy;
                    if(!hasCollision(bubbleTemp)){
                        bubbles[i] = bubbleTemp;
                        $(this).css({'top': bubbles[i].x, 'left': bubbles[i].y});
                    }
                }
                else{

                    bubbleTemp.y += rndy;
                    if(!hasCollision(bubbleTemp)){
                        bubbles[i] = bubbleTemp;
                        $(this).css({'top': bubbles[i].x, 'left': bubbles[i].y});
                    }
                }


            }
        })
    }
}
