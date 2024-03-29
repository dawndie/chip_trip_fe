<template>
  <div class="slick-slider d-flex align-items-center">
    <button
      class="arrow-btn arrow-btn--left cursor"
      :disabled="isReachedHead"
      @click="prev"
    >
      <i class="el-icon-arrow-left"></i>
    </button>
    <div class="items-container">
      <div class="slick-slider--items d-flex align-items-center">
        <img
          class="slide-img"
          v-for="(img, i) in imgArray"
          :key="i"
          :src="img"
          alt=""
        />
      </div>
    </div>
    <button
      class="arrow-btn arrow-btn--right cursor"
      :disabled="isReachedTail"
      @click="next"
    >
      <i class="el-icon-arrow-right"></i>
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, nextTick } from "vue";

export default {
  props: {
    imgArray: {
      type: Array,
      required: true,
    },
    slickId: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      default: 300,
    },
    width: {
      type: [String, Number],
      default: "100%",
    },
  },

  setup(props) {
    const IMAGE_MARGIN = 5;

    let xPosition = ref(0);

    let imgArrayWidths = ref([]);
    let totalSlickItemsLength = ref(0);
    let totalOnScreenItemsLength = ref(0);
    let lastImgWidth = ref(0);

    function getImgWidth(imgs) {
      // Only get img width when all images are loaded
      Promise.all(
        imgs
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = img.onerror = resolve;
              }),
          ),
      ).then(() => {
        // Get image width
        imgArrayWidths.value = imgs.map((e) => {
          return e.width;
        });
        lastImgWidth.value =
          imgArrayWidths.value[imgArrayWidths.value.length - 1];
        getLengthLeftToLastImg();
      });
    }

    function getTotalScreenLength() {
      if (typeof props.width === "number") {
        return props.width;
      } else {
        const windowWidth = window.screen.width;
        const sliderWidth = Number(props.width.replace("%", ""));

        if (isNaN(sliderWidth)) {
          throw new Error("Expression is not supported.");
        } else {
          return (windowWidth * sliderWidth) / 100;
        }
      }
    }

    function convertWidthProp() {
      if (typeof props.width === "number") {
        return `${props.width}px`;
      } else {
        return props.width;
      }
    }

    watch(
      () => props.imgArray,
      () => {
        init();
      },
    );

    onMounted(() => {
      init();
    });

    async function init() {
      if (!props.imgArray.length) return;

      const sliderWidth = convertWidthProp();

      const slick = document.getElementById(`${props.slickId}`);
      slick.style.width = sliderWidth;
      slick.style.height = `${props.height}px`;

      totalSlickItemsLength.value = slick.width;
      totalOnScreenItemsLength.value = getTotalScreenLength();

      const sliderItems = document.getElementsByClassName(
        "slick-slider--items",
      )[0];
      await nextTick();
      const images = sliderItems.children;
      getImgWidth([...images]);
    }

    let lengthLeftToLastImg = ref(0);

    function getLengthLeftToLastImg() {
      const leftImg = imgArrayWidths.value.filter(
        (e, i) => i >= currentImg.value,
      );
      const length = leftImg.reduce((sum, w) => sum + w, 0);
      lengthLeftToLastImg.value =
        length + (leftImg.length - 1) * IMAGE_MARGIN * 2;
    }

    let currentImg = ref(0);

    let isReachedHead = computed(() => currentImg.value == 0);
    let isReachedTail = computed(() => {
      if (lengthLeftToLastImg.value < totalOnScreenItemsLength.value)
        return true;
      return false;
    });

    function prev() {
      const slickItems = document
        .getElementById(`${props.slickId}`)
        .getElementsByClassName("slick-slider--items")[0];
      xPosition.value +=
        imgArrayWidths.value[currentImg.value - 1] + 2 * IMAGE_MARGIN;
      slickItems.style.transform = `translateX(${xPosition.value}px)`;
      currentImg.value -= 1;
      getLengthLeftToLastImg();
    }

    function next() {
      const slickItems = document
        .getElementById(`${props.slickId}`)
        .getElementsByClassName("slick-slider--items")[0];
      xPosition.value -=
        imgArrayWidths.value[currentImg.value] + 2 * IMAGE_MARGIN;
      slickItems.style.transform = `translateX(${xPosition.value}px)`;
      currentImg.value += 1;
      getLengthLeftToLastImg();
    }

    return {
      isReachedHead,
      isReachedTail,
      prev,
      next,
    };
  },
};
</script>

<style scoped>
.slide-img {
  /* padding-left: 150px; */
}
</style>