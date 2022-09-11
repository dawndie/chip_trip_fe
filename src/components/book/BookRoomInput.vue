<template>
  <div class="mb-5">
    <h3 class="mb-5">{{ $t("pages.book.book_info") }}</h3>

    <div class="mb-4">
      <label class="required mb-2">{{ $t("pages.book.guest_number") }}</label>
      <el-input
        v-model="totalGuestsText"
        placeholder="Guest number"
        readonly
        class="mt-2"
      />
    </div>

    <div class="mb-4">
      <label class="mb-2"
        >{{ dateDiff + 1 }} {{ $t("pages.book.night_at") }}
        {{ currentRoomName }}</label
      >
      <div class="d-flex mt-2">
        <el-card class="box-card w-50 mr-3">
          <hr class="decor-line decor-line--green" />
          <p class="mb-1">{{ $t("pages.book.checkin") }}</p>
          <h3 class="mt-1">{{ checkin }}</h3>
          <small>{{}}</small>
        </el-card>

        <el-card class="box-card w-50">
          <hr class="decor-line decor-line--yellow" />
          <p class="mb-1">{{ $t("pages.book.checkout") }}</p>
          <h3 class="mt-1">{{ checkout }}</h3>
          <small>{{}}</small>
        </el-card>
      </div>
    </div>

    <div class="mb-4">
      <label class="mb-2">{{ $t("pages.book.responsibility") }}</label>
      <p>{{ $t("pages.book.all_responsibility") }}</p>
    </div>

    <div class="mb-4">
      <label class="mb-2">{{ $t("pages.book.rules") }}</label>
      <p>{{ $t("pages.book.making_noise_rule") }}</p>
    </div>
  </div>

  <div class="mb-5">
    <h3 class="mb-5">{{ $t("pages.book.guest_info") }}</h3>

    <div class="mb-4">
      <label class="required mb-2">{{ $t("pages.book.guest_name") }}</label>
      <div>
        <small>{{ $t("pages.book.name_on_card") }}</small>
      </div>
      <el-input v-model="guestName" class="mt-2" />
    </div>

    <div class="input-group d-flex align-items-center mb-4">
      <div class="mr-3 w-50">
        <label class="required mb-2">{{ $t("pages.book.guest_phone") }}</label>
        <div class="mb-2">
          <small>{{ $t("pages.book.phone_code") }}</small>
        </div>
        <el-input
          v-model="phoneNumber.number"
          placeholder="Phone number"
          class="input-with-select"
        >
          <template #prepend>
            <el-select
              v-model="phoneNumber.code"
              placeholder="+84"
              style="width: 110px"
            >
              <el-option
                v-for="item in COUNTRY_PHONE_CODE"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-input>
      </div>

      <div class="w-50">
        <label class="required mb-2">{{ $t("pages.book.email") }}</label>
        <div>
          <small>{{ $t("pages.book.example") }}: abc@example.com</small>
        </div>
        <el-input v-model="email" class="mt-2" />
      </div>
    </div>

    <div class="mb-2">
      <label class="required mb-2">{{ $t("pages.book.country") }}</label>
      <div class="mb-2">
        <small>{{ $t("pages.book.country_notice") }}</small>
      </div>
      <el-select v-model="country" placeholder="Select">
        <el-option
          v-for="item in COUNTRIES"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <div class="mb-2">
      <label class="required mb-2">{{ $t("pages.room.coupon") }}</label>
      <el-input v-model="coupon_code" class="mt-2" />
      <div>
        <small
          v-if="notifCoupon != ''"
          :class="couponErr ? 'text-danger' : 'text-success'"
          >{{ notifCoupon }}</small
        >
      </div>
      <el-button
        class="el-button--active mt-3"
        size="small"
        @click="onApplyCoupon"
      >
        {{ $t("pages.room.apply_coupon") }}
      </el-button>
    </div>

    <el-button class="mt-6" @click="onBookRoom">
      {{ $t("pages.room.book_now") }}
    </el-button>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
const querystring = require("qs");
import { computed } from "vue";
import useBookRouteQuery from "@/composables/useBookRouteQuery";
import { convertDate, getBusinessDatesCount } from "@/helpers/sharedHelpers";
import { COUNTRIES, COUNTRY_PHONE_CODE } from "@/consts/sharedConsts";
import { sortObject } from "@/helpers/sharedHelpers";
import bookApi from "@/api/services/bookApi.js";
import ApiHandler from "@/helpers/ApiHandler";
import ResponseHelper from "@/helpers/ResponseHelper";
import dateFormat from "dateformat";
import { useRouter } from "vue-router";

export default {
  props: {
    bookRoom: {
      type: Function,
      default: () => () => {},
    },
  },

  setup(props) {
    const store = useStore();
    const router = useRouter();
    let guestName = ref("");
    let phoneNumber = reactive({
      code: "+84",
      number: "",
    });
    let email = ref("");
    let country = ref("");
    let coupon_code = ref("");

    function onBookRoom() {
      const reqBody = {
        start_date: checkin.value,
        end_date: checkout.value,
        num_of_people: totalGuests.value,
        place_id: roomId.value,
        coupon_code: coupon_code.value,
        total_price: detailPrice.value.totalPriceAfterDiscount,
      };

      props.bookRoom(reqBody);
      const tmnCode = process.env.VUE_APP_VN_PAY_TMN_CODE;
      const secretKey = process.env.VUE_APP_VN_PAY_HASH_SECRET;
      let vnpUrl = process.env.VUE_APP_VN_PAY_URL;
      const returnUrl = process.env.VUE_APP_VN_PAY_RETURN_URL;
      const date = new Date();
      const createDate = dateFormat(date, "yyyymmddHHmmss");
      const orderId = dateFormat(date, "HHmmss");
      const amount = detailPrice.value.totalPriceAfterDiscount;
      const bankCode = "";
      const orderInfo = "Thanh toán đặt phòng";
      const orderType = "billpayment";
      const locale = "vn";
      const currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = orderInfo;
      vnp_Params["vnp_OrderType"] = orderType;
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }
      vnp_Params = sortObject(vnp_Params);
      const signData = querystring.stringify(vnp_Params, { encode: false });
      const crypto = require("crypto");
      const hmac = crypto.createHmac("sha512", secretKey);
      const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
      location.replace(vnpUrl);
    }

    let notifCoupon = ref("");
    let couponErr = ref("false");

    async function onApplyCoupon() {
      const reqBody = {
        code_name: coupon_code.value,
      };

      const handler = new ApiHandler()
        .setData(reqBody)
        .setOnResponse((rawData) => {
          if (rawData.status == 200) {
            notifCoupon.value =
              "Success! Price is reduced by " +
              rawData.data.result.data.discount +
              "%";
            couponErr.value = false;
            store.commit("changeCoupon", rawData.data.result.data.discount);
          }
        })
        .setOnError(() => {
          notifCoupon.value = "Oh no! Coupon doesn't exist or is used up";
          couponErr.value = true;
        })
        .setOnFinally(() => {});

      const onRequest = async () => {
        return bookApi.postApplyCoupon(handler.data);
      };

      await handler.setOnRequest(onRequest).execute();
    }

    let {
      totalGuestsText,
      checkin,
      checkout,
      dateDiff,
      grownupGuests,
      kidGuests,
      babyGuests,
      totalGuests,
      roomId,
    } = useBookRouteQuery();

    let currentRoomName = store.state.currentRoom.name;
    let discount = computed(() => store.state.payment.coupon);

    let detailPrice = computed(() => {
      if (!store.state.currentRoom.name) return {};

      const defaultDayPrice =
        store.state.currentRoom.schedulePriceAttribute.normalDayPrice;
      const defaultWeekendPrice =
        store.state.currentRoom.schedulePriceAttribute.weekendPrice;

      const totalDays = dateDiff.value + 1;
      const workDays = getBusinessDatesCount(
        new Date(checkin.value),
        new Date(checkout.value),
      );
      console.log(checkin.value, new Date(checkin.value).getTime());

      const totalPrice =
        workDays * defaultDayPrice +
        (totalDays - workDays) * defaultWeekendPrice;
      const totalPriceAfterDiscount =
        Math.round((totalPrice - (totalPrice * discount.value) / 100) * 100) /
        100;

      console.log(totalDays, workDays, totalDays - workDays, totalPrice);

      return {
        totalDays,
        workDays,
        weekendDays: totalDays - workDays,
        totalPrice,
        totalPriceAfterDiscount,
      };
    });

    return {
      guestName,
      phoneNumber,
      email,
      country,
      coupon_code,
      currentRoomName,
      totalGuestsText,
      checkin,
      checkout,
      dateDiff,
      grownupGuests,
      kidGuests,
      babyGuests,
      notifCoupon,
      couponErr,
      onApplyCoupon,
      onBookRoom,
      COUNTRIES,
      COUNTRY_PHONE_CODE,
      discount,
      detailPrice,
    };
  },
};
</script>
