<template>
  <div class="room-preview bookmark-preview mb-5">
    <router-link
      v-if="item.place_id"
      :to="{ name: 'Room', query: { id: item.place_id.id } }"
    >
      <div class="img-wrap">
        <img v-if="item.photo" :src="`${item.photo.url}`" alt="" />
      </div>
    </router-link>

    <router-link
      v-if="item.place_id"
      :to="{ name: 'Room', query: { id: item.place_id.id } }"
    >
      <div class="room-preview--title mt-1">{{ item.place_id.name }}</div>
    </router-link>
    <div>
      <small v-if="item.place_id">
        {{ item.place_id.address }}
      </small>
    </div>
    <strong class="room-preview--price">
      <small v-if="item.price"
        >{{
          `${item.price.normalDayPrice} ${$t(
            "shared.currency." + currency,
          )}/${$t("shared.night")}`
        }}
      </small>
    </strong>
    <el-button
      v-if="item.place_id"
      class="mt-2"
      round
      @click="removeBookmark(item.place_id.id)"
    >
      {{ $t("shared.rmv_bookmark") }}
      <font-awesome-icon icon="heart" class="ml-1" />
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    removeBookmark: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
