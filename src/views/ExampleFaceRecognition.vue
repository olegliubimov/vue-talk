<template>
  <div class="container">
    <video ref="input_video" width="100%" height="100%"></video>
    <canvas
      class="output_canvas"
      ref="output_canvas"
      :width="width"
      :height="height"
    ></canvas>
  </div>
</template>
<script>
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
// from: https://stackoverflow.com/questions/69009153/mediapipe-javascript-to-vue-component

export default {
  name: 'HandModel',
  data() {
    return {
      number: null,
      ctx: null,
      width: null,
      height: null,
    };
  },
  computed: {
    inputVideo() {
      return this.$refs.input_video;
    },
  },
  mounted() {
    this.ctx = this.$refs.output_canvas.getContext('2d');
    this.init();
  },
  methods: {
    init() {
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });
      hands.setOptions({
        maxNumHands: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      hands.onResults(this.onResults);

      const camera = new Camera(this.inputVideo, {
        onFrame: async () => {
          await hands.send({ image: this.inputVideo });
        },
      });
      camera.start();
    },
    onResults(results) {
      this.width = results.image.width;
      this.height = results.image.height;
      this.ctx.save();
      this.ctx.clearRect(0, 0, results.image.width, results.image.height);
      this.ctx.drawImage(
        results.image,
        0,
        0,
        results.image.width,
        results.image.height
      );
      this.findHands(results);
      this.ctx.restore();
    },
    findHands(results, draw = true) {
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 5,
          });
          if (draw) {
            drawLandmarks(this.ctx, landmarks, {
              color: '#FF0000',
              lineWidth: 2,
            });
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.output_canvas {
  width: 100%;
  height: 100%;
}
</style>
