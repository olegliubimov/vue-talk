<template>
  <div v-if="phrase.match(/\d+ ?(\+?-?\*?\/?)? ?/g)" :class="size">
    {{ phrase.match(/\d+ ?(\+?-?\*?\/?)? ?/g).join('') }}
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

const sizeData = {
  маленьк: 'sm',
  средн: 'md',
  больш: 'lg',
  огромн: 'xl',
};

export default defineComponent({
  name: 'AppNumber',
  props: {
    phrase: {
      required: true,
      type: String,
    },
  },
  setup() {
    const size = computed(() => {
      const key = Object.keys(sizeData).find((skey) =>
        this.phrase.includes(skey)
      );
      return sizeData[key];
    });

    return { size };
  },
});
</script>

<style lang="scss" scoped>
.sm {
  font-size: 25px;
}
.md {
  font-size: 50px;
}
.lg {
  font-size: 100px;
}
.xl {
  font-size: 200px;
}
</style>
