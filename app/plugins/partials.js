import Vue from 'vue'

import TheHeader from '~/components/layouts/TheHeader'

Vue.mixin({
  components: {
    TheHeader,
  }
})
console.log('TheHeader :>> ', TheHeader);