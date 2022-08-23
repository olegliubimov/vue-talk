<template>
  <div id="app">
    <h2>Распознаю фразы.</h2>
    <span v-if="isListen">НАЧАТО РАСПОЗНАВАНИЕ ГОЛОСА</span>
    <br />
    <br />
    <button @click="speak">Повторить</button>
    <button v-if="!isRecognitionStarted" @click="startListen">
      Start Listen
    </button>
    <br />
    <p v-if="heardPhrase">Я услышала: {{ heardPhrase }}</p>
    <AppFigures :phrase="heardPhrase.toLowerCase()" />
    <AppNumber :phrase="heardPhrase.toLowerCase()" />
  </div>
</template>

<script>
// from https://mdn.github.io/web-speech-api/speak-easy-synthesis/
import { defineComponent, ref, onMounted, watch } from 'vue';
import AppFigures from '/src/components/AppFigures.vue';
import AppNumber from '/src/components/AppNumber.vue';
import { findAndPerformMath, getAnswer } from '../composables/helpers';
import {
  initSpeechSynth,
  initSpeechRecognition,
} from '/src/composables/services';

export default defineComponent({
  name: 'Home',
  components: {
    AppFigures,
    AppNumber,
  },
  setup() {
    const synth = ref(null);
    const utter = ref(null);

    const recognition = ref(null);
    const heardPhrase = ref('');
    const lastPhrase = ref('');

    const isSpeaking = ref(false);
    const isListen = ref(false);
    const isRecognitionStarted = ref(false);

    function speak() {
      utter.value.text = lastPhrase.value;
      synth.value.speak(utter.value);
    }

    function startListen() {
      isRecognitionStarted.value = true;
      listen();
    }

    function listen() {
      recognition.value.start();
      isListen.value = true;
    }

    function stopListen() {
      recognition.value.stop();
      isListen.value = false;
    }

    onMounted(() => {
      initSpeechSynth(
        isSpeaking,
        stopListen,
        isRecognitionStarted,
        listen,
        synth,
        utter
      );
      initSpeechRecognition(
        recognition,
        heardPhrase,
        isSpeaking,
        stopListen,
        listen
      );
    });

    watch(heardPhrase, async () => {
      const answer = await getAnswer(heardPhrase.value.toLowerCase());
      console.log(answer);
      lastPhrase.value =
        answer.data ||
        findAndPerformMath(heardPhrase.value) ||
        heardPhrase.value;
      lastPhrase.value = lastPhrase.value.toLowerCase();
      speak();
    });

    return {
      isListen,
      speak,
      isRecognitionStarted,
      startListen,
      heardPhrase,
    };
  },
});
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
