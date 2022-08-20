<template>
  <div id="app">
    <h2>Распознаю фразы.</h2>
    <input v-model="ticketKey" />
    <span v-if="isListen">НАЧАТО РАСПОЗНАВАНИЕ ГОЛОСА</span>
    <br />
    <br />
    <button @click="speak">Повторить</button>
    <button v-if="!isRecognitionStarted" @click="startListen">
      Start Listen
    </button>
    <br />
    <p v-if="heardPhrase">Я услышала: {{ heardPhrase }}</p>
    <div v-if="heardPhrase.includes('квадрат')" class="square"></div>
    <div v-if="heardPhrase.includes('Круг')" class="circle"></div>
    <div v-if="heardPhrase.includes('треугольник')" class="triangle-top"></div>
    <div v-if="heardPhrase.includes('прямоугольник')" class="rect"></div>
    <div v-if="heardPhrase.includes('шестиугольник')" class="hexagon"></div>
    <div v-if="heardPhrase.match(/\d+ ?(\+?-?\*?\/?)? ?/g)" class="number">
      {{ heardPhrase.match(/\d+ ?(\+?-?\*?\/?)? ?/g) }}
    </div>
  </div>
</template>

<script>
// from https://mdn.github.io/web-speech-api/speak-easy-synthesis/
import phrases from "../constants";
import commands from "../constants/commands";
import {
  getKeyByValue,
  removeAllSpaces,
  findAndPerformMath,
  getAnswer,
} from "../helpers";

export default {
  name: "Home",
  data: function () {
    return {
      synth: null,
      speaking: false,
      utter: null,
      isListen: false,
      isRecognitionStarted: false,
      ticketKey: "",
      lastPhrase: "",
      heardPhrase: "",
      heardTheNumbers: false,
    };
  },
  methods: {
    speak() {
      this.utter.text = this.lastPhrase;
      this.synth.speak(this.utter);
    },
    stopListen() {
      this.recognition.stop();
      this.isListen = false;
    },
    listen() {
      this.recognition.start();
      this.isListen = true;
    },
    startListen() {
      this.isRecognitionStarted = true;
      this.listen();
    },
    runCommandIfExist(lastPhrase) {
      switch (getKeyByValue(commands, lastPhrase)) {
        case "stoprecognition":
          this.speaking = false;
          this.isRecognitionStarted = false;
          this.stopListen();
          break;
      }
    },
    setSyntVoice() {
      const id = setInterval(() => {
        if (this.synth.getVoices().length !== 0) {
          this.utter.voice = this.synth.getVoices()[15];
          // console.log(this.utter.voice);
          clearInterval(id);
        }
      }, 10);
    },
    initSpeechSynth() {
      this.synth = window.speechSynthesis;
      this.utter = new SpeechSynthesisUtterance(this.lastPhrase);
      this.setSyntVoice();

      this.utter.onstart = () => {
        this.speaking = true;
        this.stopListen();
      };
      this.utter.onend = () => {
        this.speaking = false;
        if (this.isRecognitionStarted) this.listen();
      };
    },
    initSpeechRecognition() {
      const SpeechRecognition =
        window.speechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      // this.recognition.continuous = true;
      this.recognition.lang = "ru-RU";

      this.recognition.onresult = (event) => {
        this.heardPhrase = event.results[0][0].transcript;
        this.runCommandIfExist(this.heardPhrase);
      };
      this.recognition.onend = () => {
        this.stopListen();
        if (this.speaking) return;
        this.listen();
      };
    },
  },
  mounted() {
    this.initSpeechSynth();
    this.initSpeechRecognition();
  },
  watch: {
    ticketKey() {
      const key = this.ticketKey.trim().toLowerCase();
      if (
        this.ticketKey.length > 4 ||
        ["hi", "no"].includes(key) ||
        this.heardTheNumbers
      ) {
        if (key in phrases) {
          this.lastPhrase = phrases[key];
        } else {
          this.lastPhrase = phrases.no;
        }
        this.speak();
        this.ticketKey = "";
        this.heardTheNumbers = false;
      }
    },
    heardPhrase() {
      const heardPhrase = removeAllSpaces(this.heardPhrase);
      // console.log(this.heardPhrase, heardPhrase);
      if (!isNaN(heardPhrase)) {
        this.ticketKey = heardPhrase;
        this.heardTheNumbers = true;
      } else {
        this.lastPhrase =
          getAnswer(this.heardPhrase.toLowerCase()) ||
          findAndPerformMath(this.heardPhrase) ||
          this.heardPhrase;
        this.lastPhrase = this.lastPhrase.toLowerCase();
        this.speak();
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.square {
  width: 100px;
  height: 100px;
  background-color: blue;
}
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: rgb(202, 177, 35);
}
.triangle-top {
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 200px solid #f95959;
}
.rect {
  width: 300px;
  height: 100px;
  background-color: rgb(60, 161, 94);
}
.hexagon {
  width: 90px;
  height: 50px;
  background: #3e92cc;
  position: relative;
}
.hexagon:before,
.hexagon:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: #3e92cc;
  top: 0;
  left: 0;
}
.hexagon:before {
  transform: rotate(60deg);
}

.hexagon:after {
  transform: rotate(-60deg);
}

.number {
  font-size: 45px;
}
</style>
