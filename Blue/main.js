var context = new AudioContext();
var source = null;

var request;
var requestFinal;

function doRequest(filename) {
  request = new XMLHttpRequest();
  request.open('GET', filename, true);
  request.responseType = 'arraybuffer';
  request.send();
  request.onload = function() {
    $("#target").prop('disabled', false);
    $("#eq").prop('disabled', false);
    $("#original").prop('disabled', false);
  };
  if (lesson == "hat")
  {
    requestFinal = new XMLHttpRequest();
    requestFinal.open('GET', "drums/full_with_eq.wav", true);
    requestFinal.responseType = 'arraybuffer';
    requestFinal.send();
    requestFinal.onload = function() {
      $("#final").prop('disabled', false);
    };
  }
}

var cutoffSlider; 
var cutoffValue; 
var lesson;

var filterType;
var targetFrequency;
var freqOptions;
var gain;
var target;

var biquadFilter;

function initializeLesson() {
  var filename;
  if($("body#kick").length > 0){
    lesson = "kick";
    filename = "drums/kick_without_eq.wav";
    filterType = "lowshelf";
    targetFrequency = 80;
    freqOptions = [0, 40, 80, 160, 320];
    gain = 20;
  }
  else if ($("body#snare").length > 0) {
    lesson = "snare";
    filename = "drums/snare_without_eq.wav";
    filterType = "peaking";
    targetFrequency = 4000;
    freqOptions = [100, 500, 1000, 4000, 10000];
    gain = 6.3;
  }
  else {
    lesson = "hat";
    filename = "drums/hat_without_eq.wav";
    filterType = "highshelf";
    targetFrequency = 2500;
    freqOptions = [100, 1000, 2500, 6000, 10000];
    gain = 6;
  }
  doRequest(filename);
}





function processAudio(buffer) {
  if (source) source.stop();
  source = context.createBufferSource();
  var undecodedAudio = buffer;
  context.decodeAudioData(undecodedAudio, function (buffer) {
    source.buffer = buffer;
    if (eq){
      console.log("eq is true");
      biquadFilter = context.createBiquadFilter();
      biquadFilter.type = filterType;
      biquadFilter.gain.value = gain;
      if (!target) {
        biquadFilter.frequency.value = freqOptions[cutoffSlider.value];
      }
      else {
        biquadFilter.frequency.value = targetFrequency;
      }
      source.connect(biquadFilter);
      biquadFilter.connect(context.destination);  
    }
    else {
      source.connect(context.destination);
    }
  });
  source.start(context.currentTime);
}




$(function() {
  initializeLesson();
  cutoffSlider = $( "#cutoff-slider" )[0];
  cutoffValue = $( "#cutoff-value" );
  cutoffValue.text(freqOptions[cutoffSlider.value] + "Hz");
  cutoffSlider.oninput = function() {
    cutoffValue.text(freqOptions[cutoffSlider.value] + "Hz");
    if (!target && eq)
    {
      biquadFilter.frequency.value = freqOptions[cutoffSlider.value];
      console.log(freqOptions[cutoffSlider.value]);
      console.log(biquadFilter.frequency.value);
    }
  }
  $("#target").click(function() {
    target = true;
    eq = true;
    processAudio(request.response);
  });

  $("#eq").click(function() {
    target = false;
    eq = true;
    processAudio(request.response);
  });

  $("#original").click(function() {
    eq = false;
    processAudio(request.response);
  });

  $("#stop").click(function() {
    if (source) source.stop();
  });

  $("#submit").click(function() {
    console.log("submit");
    if(freqOptions[cutoffSlider.value] != targetFrequency){
      $("#incorrect").show();
    }
    else {
      $("#incorrect").hide();
      $("#correct").show();
    }
  });

  $("#final").click(function() {
    eq = false;
    processAudio(requestFinal.response);
  });

});



