<template>
  <div
    v-if="figureName"
    :class="[figureName, size || 'md']"
    :style="{ 'background-color': color }"
  ></div>
</template>

<script>
const figureData = {
  квадрат: 'square',
  круг: 'circle',
  треугольник: 'triangle-top',
  прямоугольник: 'rect',
  шестиугольник: 'hexagon',
};
const sizeData = {
  маленьк: 'sm',
  средн: 'md',
  больш: 'lg',
  огромн: 'xl',
};
const colorData = {
  красный: 'red',
  синий: 'blue',
  зелёный: 'green',
  жёлтый: 'yellow',
  оранжевый: 'orange',
};

export default {
  name: 'AppFigures',
  props: {
    phrase: {
      required: true,
      type: String,
    },
  },
  data: function () {
    return {
      isFigure: false,
    };
  },
  computed: {
    size() {
      const key = Object.keys(sizeData).find((skey) =>
        this.phrase.includes(skey)
      );
      return sizeData[key];
    },
    color() {
      const key = Object.keys(colorData).find((key) =>
        this.phrase.includes(key)
      );
      return colorData[key];
    },
    figureName() {
      const key = Object.keys(figureData).find((fkey) =>
        this.phrase.includes(fkey)
      );
      return figureData[key];
    },
  },
};
</script>

<style lang="scss" scoped>
.square {
  width: 100px;
  height: 100px;
  background-color: rgb(178, 178, 185);
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 250px;
  background-color: rgb(209, 208, 201);
}

.triangle-top {
  width: 0;
  height: 0;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
  border-bottom: 200px solid #a88b8b;
}

.rect {
  width: 300px;
  height: 100px;
  background-color: rgb(134, 156, 142);
}

.hexagon {
  width: 90px;
  height: 50px;
  background: #93a3ad;
  position: relative;
}
.hexagon:before,
.hexagon:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #839daf;
  top: 0;
  left: 0;
}
.hexagon:before {
  transform: rotate(60deg);
}
.hexagon:after {
  transform: rotate(-60deg);
}

.sm {
  width: 50px;
  height: 50px;
}
.md {
  width: 120px;
  height: 120px;
}
.lg {
  width: 250px;
  height: 250px;
}
.xl {
  width: 500px;
  height: 500px;
}
</style>
