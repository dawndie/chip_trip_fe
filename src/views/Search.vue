<template>
  <div class="container container--md search">
    <filter-bar :city="place" :page="page" @filter="onGetFilter"> </filter-bar>

    <div class="section-title">
      <h3 class="m-0 mb-3">{{ $t("pages.search.places") }}</h3>
    </div>

    <slick-carousel
      class="place-slick mx-auto"
      id="place-slick"
      slick-id="place-slick"
      :item-size="312"
      :item-number="placeSlickItemNumber"
      :total-item-number="INTERESTING_PLACES.length"
    >
      <router-link
        v-for="item in INTERESTING_PLACES"
        :key="item.name"
        :to="{ name: 'Search', query: { place: item.link } }"
        class="place-link"
      >
        <div class="p-relative h-100">
          <img
            :src="require(`@/assets/images/${item.img}`)"
            alt=""
            class="place-link--img"
          />
          <div class="place--title">{{ $t(`places.${item.name}`) }}</div>
        </div>
      </router-link>
    </slick-carousel>

    <div class="section-title mb-3">
      <el-row :gutter="10" class="d-flex align-items-center">
        <el-col :md="12">
          <h3 class="m-0">{{ $t("pages.search.homestay") }}</h3>
        </el-col>
        <el-col
          :md="12"
          class="d-flex justify-content-end"
          :class="checkIsMdOrAboveScreen ? '' : 'mt-2'"
        >
          <el-select v-model="filterOption" :placeholder="$t('shared.select')">
            <el-option
              v-for="item in FILTER_OPTIONS"
              :key="item.value"
              :label="$t(`shared.${item.label}`)"
              :value="item.value"
            >
            </el-option>

            <template #prefix>
              <p class="m-0">{{ $t("shared.filter") }}:</p>
            </template>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <el-empty
      v-if="!roomList.length"
      :image-size="200"
      :description="$t('shared.no_data')"
    ></el-empty>

    <div class="row" v-loading="loadRoom">
      <div
        v-for="item in roomList"
        :key="item.id"
        class="col-xs-6 col-md-3 col-lg-20"
      >
        <room-preview :item="item" :currency="currency" />
      </div>
    </div>

    <div class="grid-center">
      <el-pagination
        layout="prev, pager, next"
        :page-size="PAGINATION_SIZE"
        :total="totalPage"
        :current-page="page"
        class="d-inline-block"
        @next-click="onNextPage"
        @prev-click="onPrevPage"
        @update:current-page="changePage"
      ></el-pagination>
    </div>
    <template v-if="isLoggedIn">
      <div class="section-title mb-3">
        <el-row :gutter="10" class="d-flex align-items-center">
          <el-col :md="12">
            <h3 class="m-0">{{ $t("shared.recommend") }}</h3>
          </el-col>
        </el-row>
      </div>

      <!-- <div class="row" v-loading="loadRecommendedRoom">
        <div
          v-for="item in recommendedList"
          :key="item.id"
          class="col-xs-6 col-md-3 col-lg-20"
        >
          <room-preview :item="item" :currency="currency" />
        </div>
      </div> -->

      <div class="row" v-loading="loadRoom">
        <div
          v-for="item in recommendedList.data"
          :key="item.id"
          class="col-xs-6 col-md-3 col-lg-20"
        >
          <room-preview :item="item" :currency="currency" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import SlickCarousel from "@/components/shared/SlickCarousel.vue";
import RoomPreview from "@/components/search/RoomPreview.vue";
import RoomPreviewCopy from "@/components/search/RoomPreviewCopy.vue";
import FilterBar from "@/components/search/FilterBar.vue";

import { INTERESTING_PLACES } from "@/consts/mediaConsts.js";
import { FILTER_OPTIONS, PAGINATION_SIZE } from "@/consts/sharedConsts.js";
import {
  isMdOrAboveScreen,
  isLgOrAboveScreen,
  isSmOrAboveScreen,
} from "@/helpers/mediaHelpers.js";

import placeApi from "@/api/services/placeApi.js";
import ApiHandler from "@/helpers/ApiHandler";
import ResponseHelper from "@/helpers/ResponseHelper";

export default {
  name: "Search",

  components: { SlickCarousel, RoomPreview, FilterBar },

  setup() {
    const store = useStore();
    const route = useRoute();
    let userId = computed(() => store.state.userId);

    let currency = computed(() => store.state.currency);

    let placeSlickItemNumber = computed(() => {
      if (isLgOrAboveScreen(window)) {
        return 5;
      } else if (isMdOrAboveScreen(window)) {
        return 3;
      } else if (isSmOrAboveScreen(window)) {
        return 2;
      } else {
        return 1;
      }
    });

    let checkIsMdOrAboveScreen = computed(() => isMdOrAboveScreen(window));

    let filterOption = ref("");
    // let mock = ref([
    //   {
    //     id: 1,
    //     name: "Căn Hộ Duplex Indochina 1BR View Hà Nội",
    //     photos: [{ url: "../../" }],
    //   },
    // ]);
    let roomList = ref([]);
    let totalPage = ref(1);
    let recommendedList = ref([]);

    let loadRoom = ref(false);
    let loadRecommendedRoom = ref(false);

    let useFilter = ref(false);

    let page = ref(1);
    let place = ref(route.query.place);
    let checkin = ref(route.query.checkin);
    let checkout = ref(route.query.checkout);
    let totalGuests = ref(route.query.totalGuests);

    watch(
      () => route.query.place,
      () => {
        place.value = route.query.place;
        if (!place.value) return;

        page.value = 1;
        onGetTotalNumberOfPlaceInCity();

        if (isLoggedIn.value) {
          onGetRecommendByCity();
        }
      },
    );

    let locationSearch = ref(route.query.place);

    watch(
      () => route.query.place,
      () => {
        locationSearch.value = route.query.place;
        if (!locationSearch.value) return;

        page.value = 1;
        onGetSearchByNameOrAdd();
      },
    );

    async function onGetTotalNumberOfPlaceInCity() {
      const handler = new ApiHandler()
        .setData({ place: place.value })
        .setOnResponse((rawData) => {
          const data = new ResponseHelper(rawData);
          totalPage.value = Math.ceil(data.data / 20);

          onGetPlaceByCity();
        })
        .setOnFinally(() => {});

      const onRequest = async () => {
        // return placeApi.getTotalNumberOfPlaceInCity(handler.data);
      };

      await handler.setOnRequest(onRequest).execute();
    }

    async function onGetPlaceByCity() {
      useFilter.value = false;
      loadRoom.value = true;
      const handler = new ApiHandler()
        .setData({
          place: place.value,
          page: page.value,
        })
        .setOnResponse((rawData) => {
          const data = new ResponseHelper(rawData);
          roomList.value = data.data;
        })
        .setOnFinally(() => {
          loadRoom.value = false;
        });

      const onRequest = async () => {
        return placeApi.getPlaceByCity(handler.data);
      };

      await handler.setOnRequest(onRequest).execute();
    }

    async function onGetSearchByNameOrAdd() {
      if (useFilter.value) page.value = 1;

      useFilter.value = false;
      loadRoom.value = true;

      const handler = new ApiHandler()
        .setData({
          search: locationSearch.value,
          page: page.value,
          checkin: checkin.value,
          checkout: checkout.value,
          totalGuests: totalGuests.value,
        })
        .setOnResponse((rawData) => {
          const data = new ResponseHelper(rawData);
          const outputData = data.data.data;
          roomList.value = outputData.data;
          totalPage.value = outputData.lastPage;
        })
        .setOnFinally(() => {
          loadRoom.value = false;
        });

      const onRequest = async () => {
        return placeApi.getSearchByNameOrAdd(handler.data);
      };

      await handler.setOnRequest(onRequest).execute();
    }

    let isLoggedIn = computed(() => store.getters.isLoggedIn);

    async function onGetRecommendByCity() {
      loadRecommendedRoom.value = true;
      const handler = new ApiHandler()
        .setData({ city: place.value })
        .setOnResponse((rawData) => {
          const data = new ResponseHelper(rawData);
          recommendedList.value = data.data;
          console.log(recommendedList.value);
        })
        .setOnFinally(() => {
          loadRecommendedRoom.value = false;
        });

      const onRequest = async () => {
        console.log(handler.data);
        return placeApi.getRecommendById(handler.data);
      };

      await handler.setOnRequest(onRequest).execute();
    }

    let savedPriceRange = ref([]);
    let savedGeneralFilterOptions = ref({});

    async function onGetFilter({ priceRange, generalFilterOptions }) {
      if (!useFilter.value) page.value = 1;

      loadRoom.value = true;
      useFilter.value = true;
      savedPriceRange.value = priceRange;
      savedGeneralFilterOptions.value = generalFilterOptions;

      const params = {
        ...(priceRange.length == 2
          ? {
              min_price: priceRange[0],
              max_price: priceRange[1],
            }
          : {}),
        ...(generalFilterOptions.bedNumber
          ? { num_of_bed: generalFilterOptions.bedNumber }
          : {}),
        ...(generalFilterOptions.bedroomNumber
          ? { num_of_bedroom: generalFilterOptions.bedroomNumber }
          : {}),
        ...(generalFilterOptions.bathroomNumber
          ? { num_of_bathroom: generalFilterOptions.bathroomNumber }
          : {}),
      };

      if (!Object.keys(params).length) return;

      const handler = new ApiHandler()
        .setData({ params, page: page.value, city: place.value })
        .setOnResponse((rawData) => {
          const data = new ResponseHelper(rawData);
          updateList(data.data);
        })
        .setOnFinally(() => {
          loadRoom.value = false;
        });

      const onRequest = async () => {
        return placeApi.getFilter(handler.data);
      };

      await handler.setOnRequest(onRequest).execute();
    }

    function onNextPage() {
      if (page.value == totalPage.value) return;

      page.value = page.value + 1;
      searchPlaces();
    }

    function onPrevPage() {
      if (page.value == 1) return;

      page.value = page.value - 1;
      searchPlaces();
    }

    function changePage(data) {
      page.value = data;
      searchPlaces();
    }

    function searchPlaces() {
      if (useFilter.value) {
        onGetFilter({
          priceRange: savedPriceRange.value,
          generalFilterOptions: savedGeneralFilterOptions.value,
        });
      } else if (locationSearch.value) {
        onGetSearchByNameOrAdd();
      } else {
        onGetPlaceByCity();
      }
    }

    onMounted(() => {
      if (locationSearch.value) {
        onGetSearchByNameOrAdd();
      } else {
        onGetTotalNumberOfPlaceInCity();
      }
      if (isLoggedIn.value) {
        onGetRecommendByCity();
      }
    });

    function updateList(list) {
      roomList.value = list.data;
      totalPage.value = list.count;
    }

    return {
      currency,
      placeSlickItemNumber,
      checkIsMdOrAboveScreen,
      filterOption,
      roomList,
      totalPage,
      page,
      onNextPage,
      onPrevPage,
      changePage,
      updateList,
      isLoggedIn,
      recommendedList,
      INTERESTING_PLACES,
      FILTER_OPTIONS,
      PAGINATION_SIZE,
      place,
      loadRoom,
      loadRecommendedRoom,
      onGetFilter,
    };
  },
};
</script>
