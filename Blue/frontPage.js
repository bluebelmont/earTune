var context = new AudioContext();
var source = null;

var request = new XMLHttpRequest();
request.open('GET', 'drums/full_without_eq.wav', true);
request.responseType = 'arraybuffer';
request.send();


request.onload = function() {
  $(function() {
    $("#play").prop('disabled', false);
  });
}

function processAudio(buffer) {
  if (source) source.stop();
  source = context.createBufferSource();
  var undecodedAudio = buffer;
  context.decodeAudioData(undecodedAudio, function (buffer) {
    source.buffer = buffer;
    source.connect(context.destination);
  });
  source.start(context.currentTime);

}

$(function() {
  $("#play").click(function() {
    processAudio(request.response);
    $("#play").prop('disabled', true);
    $("#stop").prop('disabled', false);
  });
  $("#stop").click(function() {
    source.stop();
    $("#play").prop('disabled', false);
  });
});



