import axios from "axios";
import crypto from "crypto";

import { MOMO_TEST_2 } from "../baseApi";

export default {
  async createMomoPaymentRequest(amount, orderInfo) {
    var accessKey = process.env.VUE_APP_MOMO_ACCESS_KEY;
    var secretKey = process.env.VUE_APP_MOMO_SECRET_KEY;
    // var orderInfo = "pay with MoMo";
    var partnerCode = process.env.VUE_APP_MOMO_PARTNER_CODE;
    var redirectUrl =
      "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    var ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    // var amount = "50000";
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = "";
    var paymentCode =
      "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&paymentCode=" +
      paymentCode +
      "&requestId=" +
      requestId;
    console.log("raw", rawSignature);
    console.log(process.env.VUE_APP_MOMO_SECRET_KEY);
    const signedStr = `accessKey=${process.env.VUE_APP_MOMO_ACCESS_KEY}&amount=${amount}&extraData=eyJ1c2VybmFtZSI6ICJtb21vIn0=&ipnUrl=${process.env.VUE_APP_MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${process.env.VUE_APP_MOMO_PARTNER_CODE}&redirectUrl=${process.env.VUE_APP_MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=captureWallet`;
    // const temp = `accessKey=${process.env.VUE_APP_MOMO_ACCESS_KEY}&amount=${amount}&extraData=eyJ1c2VybmFtZSI6ICJtb21vIn0&ipnUrl=${process.env.VUE_APP_MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${process.env.VUE_APP_MOMO_PARTNER_CODE}&redirectUrl=${process.env.VUE_APP_MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=captureWallet`;
    // console.log(signedStr);
    const signature = crypto
      .createHmac("sha256", process.env.VUE_APP_MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest("hex");
    const requestObj = {
      partnerCode: process.env.VUE_APP_MOMO_PARTNER_CODE,
      requestType: "captureWallet",
      ipnUrl: process.env.VUE_APP_MOMO_IPN_URL,
      redirectUrl: process.env.VUE_APP_MOMO_REDIRECT_URL,
      orderId: orderId,
      amount: amount,
      lang: "vi",
      orderInfo: orderInfo,
      requestId: requestId,
      extraData: "",
      signature: signature,
    };
    const res = await axios.post(MOMO_TEST_2, requestObj, {
      headers: {
        "Content-Type": "application/json",
        // "Content-Length": Buffer.byteLength(requestObj),
      },
    });
    console.log(res);
  },
};
