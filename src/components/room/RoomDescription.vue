<template>
  <div class="d-flex align-items-center justify-content-between">
    <h1>{{ room.name }}</h1>

    <div class="d-flex align-items-center">
      <div v-loading="loadBookmark">
        <el-button
          style="background-color: #f65e39; color: white"
          round
          v-if="!isLoggedIn"
        >
          <router-link style="text-decoration: none; color: white" to="/login">
            {{ $t("shared.bookmark") }}
            <font-awesome-icon icon="heart" class="ml-1" />
          </router-link>
        </el-button>
        <el-button
          style="background-color: #f65e39; color: white"
          round
          v-if="!isBookmarked && isLoggedIn"
          @click="$emit('createBookmark')"
        >
          {{ $t("shared.bookmark") }}
          <font-awesome-icon icon="heart" class="ml-1" />
        </el-button>
        <el-button
          round
          v-if="isBookmarked && isLoggedIn"
          @click="removeBookmark"
        >
          {{ $t("shared.rmv_bookmark") }}
          <font-awesome-icon icon="heart" class="ml-1" />
        </el-button>
      </div>

      <div class="room-page--host ml-3">
        <router-link to="/">
          <i class="el-icon-user"></i>
        </router-link>
      </div>
    </div>
  </div>
  <div class="d-flex align-items-center mb-1">
    <font-awesome-icon icon="map-marker-alt" class="mr-1" />
    <span style="text-decoration-line: underline">{{ room.address }}</span>
    <router-link to="/" class="link link--highlight ml-1">{{
      $t("pages.room.go_to_map")
    }}</router-link>
  </div>
  <div class="d-flex align-items-center mb-1">
    <font-awesome-icon icon="building" class="mr-1" />
    <span>{{ $t("shared.type." + room.placeType.name) }}</span>
    <span style="font-weight: normal" class="m-0 ml-1"
      >{{ room.roomAttribute.square }} m<sup>2</sup></span
    >
  </div>
  <span style="font-weight: normal" class="room-page--general-description">
    {{ $t("shared.type." + room.placeType.name) }} ·
    {{ room.roomAttribute.numOfBedroom }} {{ $t("shared.bedrooms") }} ·
    {{ room.roomAttribute.numOfBed }} {{ $t("shared.beds") }} ·
    {{ room.roomAttribute.numOfBathroom }} {{ $t("shared.bathrooms") }} ({{
      $t("shared.maximum")
    }}
    {{ room.policyAttribute.maxNumOfPeople }} {{ $t("shared.guest_name") }} )
  </span>
  <div
    style="font-weight: normal; padding-top: 30px"
    class="hideable-text"
    id="hideable-text"
  >
    <div class="hideable-text--text" v-html="room.detail"></div>
    <div class="hideable-text--toggle">
      <button class="text-btn text-btn--highlight" @click="showText">
        {{ isTextShown ? $t("shared.collapse") : $t("shared.read_more") }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  emits: ["createBookmark"],
  props: {
    room: {
      type: Object,
      required: true,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    bookmark: {
      type: Function,
      default: () => {},
    },
    removeBookmark: {
      type: Function,
      default: () => {},
    },
    loadBookmark: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    // const address = computed(() => {
    //   const addObj = props.room.address.data;
    //   return `${addObj.city}, ${addObj.state}, ${addObj.country}`;
    // });

    const isTextShown = ref(false);

    function showText() {
      isTextShown.value = !isTextShown.value;
      const hideableText = document.getElementById("hideable-text");
      if (isTextShown.value) {
        hideableText.classList.add("hideable-text--shown");
      } else {
        hideableText.classList.remove("hideable-text--shown");
      }
    }

    return {
      // address,
      isTextShown,
      showText,
    };
  },
};
</script>
