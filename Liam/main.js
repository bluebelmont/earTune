// var element = document.querySelector("#greeting");
// element.innerText = "Let's try EQing a kick drum.";

var fucker = get
var play = document.querySelector('.play');
var stop = document.querySelector('.stop');


var context = new AudioContext();
var source;


//fetch .wav file
function getData()
{  
var request = new XMLHttpRequest();
request.open('GET', '11 Prince Minikid.mp3', true);
request.responseType = 'arraybuffer';
request.send();



//create AudioBufferSourceNode
source = context.createBufferSource();
//load .wav 
request.onload = function () {
    var undecodedAudio = request.response;
    context.decodeAudioData(undecodedAudio, function (buffer) {
        source.buffer = buffer;
        source.connect(context.destination);
    });
};
 
}

play.onclick = function() {
  getData();
  source.start(context.currentTime);
  console.log("Start");
};

stop.onclick = function() {
  source.stop();
  console.log("Stop");
};