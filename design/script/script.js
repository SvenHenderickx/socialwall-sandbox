var amountOfBubble = 4;
var radius = 100;
var pushbackPx = 20;
var classes = [
    'facebook',
    'twitter',
    'instagram'
];
var bubbles = [];

var maxX;
var maxY;
var minX = 0;
var minY = 0;


$(document).ready(function(){
    var maxX = $("#canvas").width() - (radius * 2);
    var maxY = $('#canvas').height() - (radius * 2);
    for(var i = 0; i < amountOfBubble; i++){
        do {
            newBubble = new Bubble(i, getRandomInt(maxX), getRandomInt(maxY), radius, 'facebook');
            console.log('in new bubble');
            // sleep(10);s
        }
        while(hasCollision(newBubble));

        bubbles.push(newBubble);
    }

    $.each(bubbles, function(k, v){
        createBubble(v);
    })
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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function hasCollision(bubble){
    var hasHit = false;
    for(var i = 0; i < bubbles.length; i++){

            var distX = Math.abs(bubbles[i].x - bubble.x);
            var distY = Math.abs(bubbles[i].y - bubble.y);

            if(distX < (radius + pushbackPx)){
                console.log(distX);
                return true;
            }

            if(distY < (radius + pushbackPx)){
                console.log(distY);
                return true;

            }

    }
    console.log(hasHit);
    return false;
}

setInterval(500, moveBubbles);

function moveBubbles(){
    for(var i = 0; i < bubbles.length; i++){
        bubbles[i].x + 50;
        if(!hasCollision(bubbles[i])){
            $('#canvas').each('.socialBubble', function(v){
                if(v.atr('data-id') == bubbles[i].id){
                    $(this)
                }
            })
        }
    }
}
