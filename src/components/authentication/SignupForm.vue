<template>
  <div class="authen-form card">
    <h2 class="mb-3">{{ $t("pages.authen.signup") }}</h2>
    <form>
      <div class="authen-form--input">
        <label for="email" class="required">{{
          $t("pages.authen.email")
        }}</label>
        <el-input
          name="email"
          v-model="email"
          placeholder=""
          @input="changeEmail"
        >
          <template #suffix>
            <font-awesome-icon icon="envelope" class="mr-1" />
          </template>
        </el-input>
        <small class="text-danger">{{
          notValidEmail ? $t("errors.not_valid_email") : ""
        }}</small>
      </div>

      <div class="authen-form--input">
        <label for="phone" class="required">{{
          $t("pages.authen.phone")
        }}</label>
        <el-input
          v-model="phoneNumber.number"
          placeholder="Phone number"
          class="input-with-select"
        >
          <template #prepend>
            <el-select
              name="phone"
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

      <div class="authen-form--input">
        <label for="first-name" class="required">{{
          $t("pages.authen.first_name")
        }}</label>
        <el-input
          name="first-name"
          v-model="first_name"
          placeholder=""
        ></el-input>
      </div>

      <div class="authen-form--input">
        <label for="last-name" class="required">{{
          $t("pages.authen.last_name")
        }}</label>
        <el-input
          name="last-name"
          v-model="last_name"
          placeholder=""
        ></el-input>
      </div>

      <div class="authen-form--input">
        <label for="password" class="required">{{
          $t("pages.authen.password")
        }}</label>
        <small class="info_small ml-2"
          >({{ $t("pages.authen.password_rule") }})</small
        >
        <el-input
          name="password"
          v-model="password"
          placeholder=""
          show-password
          @input="changePassword"
        ></el-input>
        <small class="text-danger">{{
          notValidPassword ? $t("errors.not_valid_password") : ""
        }}</small>
      </div>
      <p>Upload avatar</p>

      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <el-button
        round
        :disabled="notValidForm"
        class="el-button--active block-btn mt-6"
        @click="signUp"
      >
        {{ $t("pages.authen.signup_btn") }}
      </el-button>
    </form>

    <div class="mt-3 d-flex justify-content-center">
      {{ $t("pages.authen.had_account") }}
      <router-link to="#" class="link link--highlight ml-1">{{
        $t("pages.authen.login_btn")
      }}</router-link>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { ElNotification } from "element-plus";

import useAuthenForm from "@/composables/useAuthenForm";

import { COUNTRIES, COUNTRY_PHONE_CODE } from "@/consts/sharedConsts";

import authApi from "@/api/services/authApi.js";
import ApiHandler from "@/helpers/ApiHandler";
import ResponseHelper from "@/helpers/ResponseHelper";

export default {
  setup() {
    // const store = useStore();
    let imageUrl = ref("");
    let {
      email,
      password,
      notValidEmail,
      notValidPassword,
      changeEmail,
      changePassword,
    } = useAuthenForm();

    let phoneNumber = reactive({
      code: "+84",
      number: "",
    });
    let first_name = ref("");
    let last_name = ref("");

    const router = useRouter();

    const beforeAvatarUpload = (file) => {
      console.log("comming");
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("Avatar picture must be JPG format!");
      }
      if (!isLt2M) {
        this.$message.error("Avatar picture size can not exceed 2MB!");
      }
      return isJPG && isLt2M;
    };

    const handleAvatarSuccess = (res, file) => {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(this.imageUrl);
    };

    const signUp = async () => {
      const reqBody = {
        firstName: first_name.value,
        lastName: last_name.value,
        email: email.value,
        password: password.value,
        // password_confirmation: password.value,
        phoneNumber: phoneNumber.number,
      };

      const handler = new ApiHandler()
        .setData(reqBody)
        .setOnResponse((rawData) => {
          const data = new ResponseHelper(rawData);
          console.log(data);
          if (data.isSuccess()) {
            ElNotification({
              title: "Signed up successfully!",
              message: "Please log in to continue",
              type: "success",
            });

            router.push({
              name: "Login",
            });
          } else {
            ElNotification({
              title: "Can't sign up",
              message: data.error,
              type: "error",
            });
          }
        })
        .setOnFinally(() => {});

      const onRequest = async () => {
        return authApi.postSignUp(handler.data);
      };

      await handler.setOnRequest(onRequest).execute();
    };

    const notValidForm = computed(() => {
      return (
        !email.value ||
        !phoneNumber.code ||
        !phoneNumber.number ||
        !first_name.value ||
        !last_name.value ||
        !password.value
      );
    });

    return {
      email,
      phoneNumber,
      first_name,
      last_name,
      password,
      signUp,
      notValidForm,
      notValidEmail,
      notValidPassword,
      changeEmail,
      changePassword,
      COUNTRIES,
      COUNTRY_PHONE_CODE,
    };
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
