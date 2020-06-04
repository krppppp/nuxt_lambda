<template>
  <section :class="{ 'none-boxshadow': flag }">
    <a
      @click="goToExternalLink(url)"
      class="button"
      :class="{ 'btn-white': flag }"
    >
      <div class="title">
        {{ sentense }}
      </div>
    </a>
  </section>
  <!-- 特徴やメニュー -->
</template>

<script>

export default {
  name: "TheFeatureAndOther",
  props: {
    masterBook: {
      type: Object,
      required: true
    },
    flag: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mounted() {
    console.log("this.masterBook :>> ", this.masterBook);

    // const param = this.masterBook.id + this.lang;
    const param = this.masterBook.id + "ja";
    console.log("param :>> ", param);
    switch (param.toString()) {
      case "1ja":
        this.url =
          "https://contents-staging.maasjapan.net/odakyu/master_books/digital_hakone_free_pass/feature/index.html";
        // this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        this.sentense = this.masterBook.name + "の特徴";
        break;
      case "1en":
        this.url =
          "https://contents-staging.maasjapan.net/odakyu/master_books/digital_hakone_free_pass/feature/en/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "2ja":
        this.url =
          "https://contents-staging.maasjapan.net/odakyu/master_books/digital_hakone_free_pass/feature/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "2en":
        this.url =
          "https://contents-staging.maasjapan.net/odakyu/master_books/digital_hakone_free_pass/feature/en/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "3ja":
        this.url =
          "https://contents-staging.maasjapan.net/odakyu/master_books/food_subscription/features/index.html";
        this.sentense = this.$i18n.tc("common.IntroductionOfMenu");
        break;
      case "3en":
        this.url =
          "https://contents-staging.maasjapan.net/odakyu/master_books/food_subscription/features/index.html";
        this.sentense = this.$i18n.tc("common.IntroductionOfMenu");
        break;
      case "4ja":
        this.url =
          "https://contents-staging.maasjapan.net/odakyu/master_books/food_subscription/features/index.html";
        this.sentense = this.$i18n.tc("common.IntroductionOfMenu");
        break;
      case "4en":
        this.url =
          "https://contents-staging.maasjapan.net/odakyu/master_books/food_subscription/features/index.html";
        this.sentense = this.$i18n.tc("common.IntroductionOfMenu");
        break;
      case "6ja":
        this.url =
          "https://contents-staging.maasjapan.net/entetsu/master_books/burari_kippu/feature/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "6en":
        this.url =
          "https://contents-staging.maasjapan.net/entetsu/master_books/burari_kippu/feature/en/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "7ja":
        this.url =
          "https://contents-staging.maasjapan.net/entetsu/master_books/akaden_1day/feature/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "7en":
        this.url =
          "https://contents-staging.maasjapan.net/entetsu/master_books/akaden_1day/feature/en/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "8ja":
        this.url =
          "https://contents-staging.maasjapan.net/entetsu/master_books/1day_free_east/feature/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "8en":
        this.url =
          "https://contents-staging.maasjapan.net/entetsu/master_books/1day_free_east/feature/en/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "9ja":
        this.url =
          "https://contents-staging.maasjapan.net/entetsu/master_books/1day_free_west/feature/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
      case "9en":
        this.url =
          "https://contents-staging.maasjapan.net/entetsu/master_books/1day_free_west/feature/en/index.html";
        this.sentense = this.masterBook.name + this.$i18n.tc("common.feature");
        break;
    }
  },
  data() {
    return {
      url: null,
      sentense: null
    };
  }
};
</script>

<style scoped lang="scss">
.none-boxshadow {
  box-shadow: none !important;
}
.btn-white {
  background-color: white;
  margin: 0;
  padding-left: 0px;
}
</style>
