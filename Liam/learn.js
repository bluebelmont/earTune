var context = new AudioContext();
var source = null;

function process_audio(buffer) {
  if (source) source.stop();
  source = context.createBufferSource();

  var undecodedAudio = buffer;
  context.decodeAudioData(undecodedAudio, function (buffer) {
    source.buffer = buffer;
    var biquadFilter = context.createBiquadFilter();
    source.connect(biquadFilter);
    if (document.getElementById('original').checked) {
      biquadFilter.type = "highpass";
      biquadFilter.frequency.value = 0;
    } else if(document.getElementById('lowpass').checked) {
      biquadFilter.type = "lowpass";
      biquadFilter.frequency.value = 1000;
    } else if(document.getElementById('highpass').checked) {
      biquadFilter.type = "highpass";
      biquadFilter.frequency.value = 80;
    }
    else if(document.getElementById('bandpass').checked) {
      biquadFilter.type = "bandpass";
      biquadFilter.frequency.value = 500;
      biquadFilter.Q.value = 2;
    }
    else if(document.getElementById('lowshelf').checked) {
      biquadFilter.type = "lowshelf";
      biquadFilter.frequency.value = 1000;
      biquadFilter.gain.value = 10;
    }
    else if(document.getElementById('highshelf').checked) {
      biquadFilter.type = "highshelf";
      biquadFilter.frequency.value = 80;
      biquadFilter.gain.value = 10;
    }
    else if(document.getElementById('allpass').checked) {
      biquadFilter.type = "allpass";
      biquadFilter.frequency.value = 500;
      biquadFilter.Q.value = 2;
    }
    biquadFilter.connect(context.destination);
  });
  source.start(context.currentTime);
}



$(function() {
  $("#play").click(function() {
    var fileObj = $("#file");
    var files = fileObj[0].files;
    if (files.length === 0) return;
    var file = files[0];
    var fr = new FileReader();
    fr.onload = function() {
        process_audio(fr.result);
    };
    fr.readAsArrayBuffer(file);
  });
  $("#stop").click(function() {
    if (source) source.stop();
  });
});