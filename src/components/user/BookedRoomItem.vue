<template>
  <div class="booked-room-item">
    <div
      :class="
        item.status == 'done'
          ? 'booked-room-item--status'
          : 'booked-room-item--status booked-room-item--status__not-done'
      "
    >
      {{ $t("shared." + item.status) }}
    </div>
    <div class="booked-room-item--date">
      {{ convertDate(item.startDate, "T") }} -
      {{ convertDate(item.endDate, "T") }}
    </div>
    <div class="booked-room-item--description mt-2">
      <router-link
        :to="{ name: 'Room', query: { id: item.place.id } }"
        class="link link--highlight"
        >{{ item.place.name }}</router-link
      >
      <p class="mt-1">
        {{ $t("shared.type." + item.placeType.name) }}
      </p>
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <div class="booked-room-item--price">
        {{ $t("shared.total_price") }}:
        {{
          new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "VND",
          }).format(item.price)
        }}
      </div>
      <el-button
        @click="payBill(item.price)"
        v-if="item.status == 'pendding'"
        round
        class="el-button--active"
      >
        {{ $t("pages.user.pay") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { convertDate } from "@/helpers/sharedHelpers";
import momoApi from "@/api/services/momoApi";
import { sortObject } from "@/helpers/sharedHelpers";
import dateFormat from "dateformat";
const querystring = require("qs");

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup() {
    async function payBill(price) {
      const tmnCode = process.env.VUE_APP_VN_PAY_TMN_CODE;
      const secretKey = process.env.VUE_APP_VN_PAY_HASH_SECRET;
      let vnpUrl = process.env.VUE_APP_VN_PAY_URL;
      const returnUrl = process.env.VUE_APP_VN_PAY_RETURN_URL;
      const date = new Date();
      const createDate = dateFormat(date, "yyyymmddHHmmss");
      const orderId = dateFormat(date, "HHmmss");
      const amount = price;
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
    return {
      convertDate,
      payBill,
    };
  },
};
</script>
