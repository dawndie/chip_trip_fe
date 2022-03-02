<template>
  <div class="authentication-page">
      <welcome-banner></welcome-banner>
      <detail-banner>
        <signup-form/>
      </detail-banner>
  </div>
</template>

<script>
import WelcomeBanner from '@/components/authentication/WelcomeBanner'
import DetailBanner from '@/components/authentication/DetailBanner'
import SignupForm from '@/components/authentication/SignupForm'

export default {
    components: { WelcomeBanner, DetailBanner, SignupForm }
}
</script>
