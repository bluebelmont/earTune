var context = new AudioContext();
var source = null;
var id = 0;

function process_audio(buffer, id) {
  if (source) source.stop();
  source = context.createBufferSource();

  var undecodedAudio = buffer;
  context.decodeAudioData(undecodedAudio, function (buffer) {
    source.buffer = buffer;
    var biquadFilter = context.createBiquadFilter();
    source.connect(biquadFilter);
    if (id == 1) {
      biquadFilter.type = "highpass";
      biquadFilter.frequency.value = 0;
    } else if(id == 2) {
      biquadFilter.type = "lowpass";
      biquadFilter.frequency.value = 1000;
    } else if(id == 3) {
      biquadFilter.type = "highpass";
      biquadFilter.frequency.value = 80;
    }
    else if(id == 4) {
      biquadFilter.type = "bandpass";
      biquadFilter.frequency.value = 500;
      biquadFilter.Q.value = 2;
    }
    else if(id == 5) {
      biquadFilter.type = "lowshelf";
      biquadFilter.frequency.value = 1000;
      biquadFilter.gain.value = 10;
    }
    else if(id == 6) {
      biquadFilter.type = "highshelf";
      biquadFilter.frequency.value = 80;
      biquadFilter.gain.value = 10;
    }
    else if(id == 7) {
      biquadFilter.type = "allpass";
      biquadFilter.frequency.value = 500;
      biquadFilter.Q.value = 2;
    }
    biquadFilter.connect(context.destination);
  });
  source.start(context.currentTime);
}



$(function() {
  $("#go").click(function() {
    var fileObj = $("#file");
    var files = fileObj[0].files;
    if (files.length === 0) return;
    var file = files[0];
    var fr = new FileReader();
    fr.onload = function() {
        process_audio(fr.result, 1);
    };
    fr.readAsArrayBuffer(file);
  });
  $("#play").click(function() {
    var fileObj = $("#file");
    var files = fileObj[0].files;
    if (files.length === 0) return;
    var file = files[0];
    var fr = new FileReader();
    id = Math.floor((Math.random() * 7) + 1);
    fr.onload = function() {
        process_audio(fr.result, id);
    };
    fr.readAsArrayBuffer(file);
  });
  $("#stop").click(function() {
    if (source) source.stop();
  });
  $("#check").click(function() {
    if (source) source.stop();
    
    if (document.getElementById('original').checked && id == 1) {
      alert("Correct! No change!");
    } else if(document.getElementById('lowpass').checked && id == 2) {
      alert("Correct! lowpass!");
    } else if(document.getElementById('highpass').checked && id == 3) {
      alert("Correct! highpass!");
    }
    else if(document.getElementById('bandpass').checked && id == 4) {
      alert("Correct! bandpass!");
    }
    else if(document.getElementById('lowshelf').checked && id == 5) {
      alert("Correct! lowshelf!");
    }
    else if(document.getElementById('highshelf').checked && id == 6) {
      alert("Correct! highshelf!");
    }
    else if(document.getElementById('allpass').checked && id == 7) {
      alert("Correct! allpass!");
    } else {
      if (id == 1) {alert("sorry! the correct answer was no change");}
      else if (id == 2) {alert("sorry! the correct answer was lowpass");}
      else if (id == 3) {alert("sorry! the correct answer was highpass");}
      else if (id == 4) {alert("sorry! the correct answer was bandpass");}
      else if (id == 5) {alert("sorry! the correct answer was lowshelf");}
      else if (id == 6) {alert("sorry! the correct answer was highshelf");}
      else if (id == 7) {alert("sorry! the correct answer was allpass");}
    }
  });
});