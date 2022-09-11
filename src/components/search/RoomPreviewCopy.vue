<template>
  <div class="room-preview mb-5">
    <router-link :to="{ name: 'Room', query: { id: item.id } }">
      <div class="img-wrap">
        <img :src="`${item.photos[1].url}`" alt="" />
      </div>
    </router-link>
    <div
      class="
        room-preview--info
        d-flex
        justify-content-between
        align-items-center
        mt-1
      "
    >
      <small style="font-weight: normal">{{
        `${$t("shared.type." + item.placeType.name)} - ${
          item.roomAttribute.numOfBedroom
        } ${$t("shared.bedroom")}`
      }}</small>
      <!-- <div class="rating" v-if="item.ratings.length">
        <font-awesome-icon icon="star" color="#ffcd3c" />
        {{ item.rating }}
        <small>({{ item.rated_by }})</small>
      </div> -->
    </div>
    <router-link to="#">
      <div style="font-weight: normal" class="room-preview--title">
        <i style="color: red" class="el-icon-s-home"></i>
        {{ item.name }}
      </div>
    </router-link>
    <div>
      <!-- <small style="font-weight: normal">{{ item.address }}</small> -->
    </div>
    <strong class="room-preview--price">
      <small
        >{{
          `${item.schedulePriceAttribute.normalDayPrice}${$t(
            "shared.currency." + item.policyAttribute.currency,
          )}`
        }}
      </small>
    </strong>
    <small style="font-weight: normal">{{ "/" + $t("shared.night") }}</small>
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
  },
};
</script>
