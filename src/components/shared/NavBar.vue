<template>
  <div class="navbar">
    <div class="navbar--search d-flex align-items-center">
      <div class="navbar--logo mr-3">
        <router-link :to="{ name: 'Home' }">
          <img
            :src="require('@/assets/images/wallet@2x.png')"
            width="170"
            height=""
          />
        </router-link>
      </div>
      <div class="searchbar">
        <el-input
          @focus="canToggleSuggestion = true"
          @blur="canToggleSuggestion = false"
          v-model="locationSearch"
          @input="suggestPlace"
          :placeholder="$t('shared.navbar.search')"
        >
          <template #prefix>
            <i class="el-input__icon el-icon-search"></i>
          </template>
        </el-input>
        <div v-if="!checkIsXsScreen" class="divider" />
        <el-date-picker
          v-if="!checkIsXsScreen"
          v-model="dateRangeSearch"
          type="daterange"
          :start-placeholder="$t('shared.navbar.from_date')"
          :end-placeholder="$t('shared.navbar.to_date')"
          format="DD-MM-YYYY"
          value-format="YYYY-MM-DD"
          class="searchbar--datepicker"
        ></el-date-picker>

        <guest-picker v-if="!checkIsXsScreen" @pick-guest="pickGuest" />

        <!-- <button class="btn btn--primary" @click="search">
          <i class="el-input__icon el-icon-search btn-icon"></i>
        </button> -->
        <el-button
          style="font-weight: bold"
          @click="search"
          type="primary"
          icon="el-icon-search"
        ></el-button>
      </div>
    </div>

    <div
      v-if="checkIsMdOrAboveScreen"
      class="navbar--info d-flex align-items-center"
    >
      <template v-if="!isLoggedIn">
        <router-link
          class="link text-bold navbar--link"
          :to="{ name: 'Login' }"
          >{{ $t("shared.login") }}</router-link
        >
        <router-link
          class="link text-bold navbar--link"
          :to="{ name: 'Signup' }"
          >{{ $t("shared.signup") }}</router-link
        >
      </template>

      <logged-member-picker v-else />
      <setting-picker />
    </div>
    <i
      v-else
      class="el-icon-menu cursor menu-icon"
      @click="$emit('toggle-sidebar')"
    ></i>
    <div class="suggestion-container">
      <el-card
        v-if="
          (suggestionList.city || suggestionList.area) && canToggleSuggestion
        "
        shadow="always"
        class="box-card"
      >
        <div
          v-for="city in suggestionList.city"
          :key="city.id"
          class="text item suggestion-item"
          v-on:mousedown="addToSearchInput(city)"
        >
          <div class="" style="display: flex">
            <div>
              <el-avatar shape="square" :size="50"
                ><i
                  style="color: black; font-size: 20px; margin-top: 17px"
                  class="el-icon-location"
                ></i>
              </el-avatar>
            </div>
            <div>
              <p>{{ `${city.name}, Việt Nam` }}</p>
              <p class="suggestion-description">
                {{ `${city.total} Địa điểm` }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-for="area in suggestionList.area"
          :key="area.id"
          class="text item suggestion-item"
          v-on:mousedown="addToSearchInput(area)"
        >
          <div class="" style="display: flex">
            <div>
              <el-avatar shape="square" :size="50"
                ><i
                  style="color: black; font-size: 20px; margin-top: 17px"
                  class="el-icon-location"
                ></i>
              </el-avatar>
            </div>
            <div>
              <p>{{ `${area.name}, ${area.city.name}, Việt Nam` }}</p>
              <p class="suggestion-description">
                {{ `${area.total} Địa điểm` }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-for="place in suggestionList.place"
          :key="place.id"
          class="text item suggestion-item"
          v-on:mousedown="addToSearchInput(place)"
        >
          <div class="" style="display: flex">
            <div>
              <el-avatar shape="square" :size="50"
                ><i
                  style="color: black; font-size: 20px; margin-top: 17px"
                  class="el-icon-location"
                ></i>
              </el-avatar>
            </div>
            <div>
              <p>{{ `${place.name}` }}</p>
              <p class="suggestion-description">{{ `${place.address}` }}</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ApiHandler from "@/helpers/ApiHandler";
import GuestPicker from "./GuestPicker.vue";
import SettingPicker from "./SettingPicker.vue";
import LoggedMemberPicker from "@/components/shared/LoggedMemberPicker";
import placeApi from "@/api/services/placeApi.js";
import { isMdOrAboveScreen, isXsScreen } from "@/helpers/mediaHelpers";

export default {
  components: {
    GuestPicker,
    SettingPicker,
    LoggedMemberPicker,
  },

  emits: ["toggle-sidebar"],

  setup() {
    let canToggleSuggestion = ref(false);
    let locationSearch = ref("");
    let suggestionList = ref({});
    let dateRangeSearch = ref([]);
    let guestSearch = ref({});

    function pickGuest(guestObj) {
      guestSearch.value = guestObj;
    }

    let checkIsMdOrAboveScreen = computed(() => isMdOrAboveScreen(window));
    let checkIsXsScreen = computed(() => isXsScreen(window));
    const router = useRouter();

    async function suggestPlace() {
      const result = await placeApi.suggestPlace(locationSearch.value);
      suggestionList.value = result.data.result.data;
      console.log(suggestionList.value);
    }

    function addToSearchInput(location) {
      if (location.city) {
        locationSearch.value = `${location.name}, ${location.city.name}`;
      } else {
        locationSearch.value = location.name;
      }
    }

    function search() {
      const searchQuery = {
        ...(locationSearch.value ? { place: locationSearch.value } : {}),
        ...(dateRangeSearch.value
          ? {
              checkin: dateRangeSearch.value[0],
              checkout: dateRangeSearch.value[1],
            }
          : {}),
        ...(guestSearch.value ? guestSearch.value : {}),
      };

      router.push({
        name: "Search",
        query: searchQuery,
      });
    }

    const store = useStore();

    let isLoggedIn = computed(() => store.getters.isLoggedIn);
    let user = computed(() => store.state.user.user);

    onMounted(() => {
      if (!isLoggedIn.value && localStorage.getItem("token")) {
        store.commit("changeToken", localStorage.getItem("token"));
      }

      if (!user.value.id && localStorage.getItem("user")) {
        store.commit("changeUser", JSON.parse(localStorage.getItem("user")));
      }
    });

    return {
      locationSearch,
      dateRangeSearch,
      pickGuest,
      checkIsMdOrAboveScreen,
      checkIsXsScreen,
      search,
      isLoggedIn,
      suggestPlace,
      suggestionList,
      canToggleSuggestion,
      addToSearchInput,
    };
  },
};
</script>
