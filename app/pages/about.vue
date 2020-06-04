<template>
  <div>
  a
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  async mounted() {
    await this.getInformations();
  },
  methods: {
    async getInformations() {
      try {
        console.log('this.$store :>> ', this.$store);
        // await this.$store.commit('increment')
// console.log('this.$store.state.masterBook :>> ', this.$store.ticketing);
        await this.$store.dispatch("getMasterBook", {
          id: 1
        });
      } catch (err) {
        console.log('err :>> ', err);
        console.log("だめ :");
      }
    },

  },
  
};
</script>

<style scoped>
.content-wrapper {
  padding-bottom: var(--sticky-height);
}

p {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
