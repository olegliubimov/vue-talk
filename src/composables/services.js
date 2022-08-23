export function initSpeechSynth(
  isSpeaking,
  stopListen,
  isRecognitionStarted,
  listen,
  synth,
  utter
) {
  synth.value = window.speechSynthesis;
  utter.value = new SpeechSynthesisUtterance('');
  const id = setInterval(() => {
    if (synth.value.getVoices().length !== 0) {
      utter.value.voice = synth.value.getVoices()[15];
      console.log(utter.value.voice);
      clearInterval(id);
    }
  }, 10);

  utter.value.onstart = () => {
    isSpeaking.value = true;
    stopListen();
  };
  utter.value.onend = () => {
    isSpeaking.value = false;
    if (isRecognitionStarted.value) listen();
  };
}

export function initSpeechRecognition(
  recognition,
  heardPhrase,
  isSpeaking,
  stopListen,
  listen
) {
  const SpeechRecognition =
    window.speechRecognition || window.webkitSpeechRecognition;
  recognition.value = new SpeechRecognition();
  // recognition.continuous = true;
  recognition.value.lang = 'ru-RU';

  recognition.value.onresult = (event) => {
    heardPhrase.value = event.results[0][0].transcript;
  };
  recognition.value.onend = () => {
    stopListen();
    if (isSpeaking.value) return;
    listen();
  };
}
