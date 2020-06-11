import Vue from 'vue'

import TheHeader from '~/components/layouts/TheHeader'


import TheFeatureAndOther from '~/components/ui/TheFeatureAndOther'
import ItemTicketCard from '~/components/ui/ItemTicketCard'
import ItemButton from '~/components/ui/ItemButton'




Vue.mixin({
  components: {
    TheHeader,
    TheFeatureAndOther,
    ItemTicketCard,
    ItemButton
  }
})