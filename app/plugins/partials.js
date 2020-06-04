import Vue from 'vue'

import TheHeader from '~/components/layouts/TheHeader'


import TheFeatureAndOther from '~/components/ui/TheFeatureAndOther'
import ItemTicketCard from '~/components/ui/ItemTicketCard'


Vue.mixin({
  components: {
    TheHeader,
    TheFeatureAndOther,
    ItemTicketCard
  }
})