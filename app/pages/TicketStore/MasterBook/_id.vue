<template>
  <div>
    <template v-if="isReadyToDraw">
      <TheHeader
        :headerTitle="masterBook.name"
        :transparentThreshold="316"
        :initialTranparent="false"
      />
      <div
        class="heading-image"
        :style="
          backgroundImageFromApi(masterBook.content.ticket_detail_image_url)
        "
      />
      <section class="section-top section-bg-white">
        <h1 class="title">
          {{ masterBook.name }}
        </h1>
        <div class="description">
          <p>
            {{ masterBook.comment }}
          </p>
        </div>
        <hr />
        <div class="columns columns-price" style="margin-bottom: 0;">
          <div class="label label-price">料金</div>
          <div class="price" style="white-space: pre-line;line-height: 1.5rem;">
            {{ masterBook.display_price }}
          </div>
        </div>
      </section>


      <!-- 注意 -->
      <section
        v-if="masterBook.id != 3 && masterBook.id != 4"
        class=" section-bg-white"
      >
        <div class="title">値段に関する注意</div>
        <div class="description">
          <p>
            {{ masterBook.display_price_comment }}
          </p>
        </div>
      </section>

        <!-- 特徴・メニュー -->
      <TheFeatureAndOther :masterBook="masterBook" />

      <!-- 含まれるチケット -->
      <section class="included-ticktes-index">
        <h2 class="ribbon">含まれるチケット</h2>
        <item-ticket-card
          :passes="sort(masterBook.passes)"
          :sheets="sort(masterBook.sheets)"
        />
      </section>

      <!-- その他 -->
      <section>
        <h2 class="ribbon">その他</h2>

        <!-- チケット規約 -->
        <a
          @click="goToExternalLink($t(masterBook.content.terms_url))"
          class="button"
        >
          <div class="title">利用規約</div>
        </a>
        <!-- 利用できる場所 -->
        <a
          v-if="masterBook.id == 3 || masterBook.id == 4"
          @click="goToTargetStore"
          class="button"
        >
          <div class="title">利用可能箇所</div>
        </a>
      </section>

      <!-- 購入手続きボタン -->
      <button class="buy-button" @click="goToBooksBooking()">
        <div class="icon">
          <img :src="require(`@/assets/img/icon/svg/icon-cart-white.svg`)" />
        </div>
        <div class="label">購入手続きへ</div>
      </button>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CommonTools from "@/components/mixins/CommonTools.vue";
export default {
  mixins: [CommonTools],
  async mounted() {
    await this.getInformations();
    this.addClassToBody("ticket-detail");
  },
  methods: {
    async getInformations() {
      try {
        await this.$store.dispatch("ticketing/getMasterBook", {
          id: this.$route.params.id
        });
      } catch (err) {
        this.$refs.invalidPageAccess.open();
        console.log("だめ :");
      }
    },
    // 販売期間については,purchase_〇〇_at に値があればそれを、なければ
    // purchase_periodの値を元にswitch文を作成して返す 現在1ヶ月前で固定 12/3
    purchasePeriodStartDatetime() {
      this.$moment(new Date(`${this.masterBook.started_at}`)).subtract(1, "M");
    },
    purchasePeriodEndDatetime() {
      this.$moment(new Date(`${this.masterBook.limited_at}`)).subtract(1, "M");
    },

    goToBooksBooking() {
      console.log("object :");
      // 未ログインの時ダイアログ
      if (this.idToken.length < 100) {
        this.$refs.unauthorizedAccount.open();
      } else {
        document.body.classList.remove("ticket-detail");
        this.$router.push({
          name: "BookBooking",
          params: { id: this.$route.params.id },
          query: { language: this.$store.getters["common/lang"] }
        });
      }
    },
    goToTargetStore() {
      this.$router.push({
        name: "BookTargetStore",
        params: { id: this.$route.params.id },
        query: { language: this.$store.getters["common/lang"] }
      });
    }
  },
  computed: {
    is_date_purchase_limited_in() {
      // isBefore のメソッドの仕様上、販売期間のケツに1日プラス
      var limit = this.$moment(
        new Date(this.masterBook.purchase_limited_at)
      ).add(1, "d");
      var current = this.$moment(new Date());

      // チケット購入可能期間(このページへユーザーがたどり着ける期間であり、前売り期間なども含む) == チケット購入掲載期間(ネイティブでの制御)
      // 販売期間 == purchase の頭〜ケツ
      // 「購入手続きへ」ボタンは、purchase_atを越えると非表示
      return current.isBefore(limit) ? true : false;
    },
    isReadyToDraw() {
      return this.masterBook.content;
    },
    ...mapGetters("ticketing", ["masterBook"]),
    ...mapGetters("common", ["idToken"])
  }
};
</script>

<style  scoped>
.content-wrapper {
  padding-bottom: var(--sticky-height);
}

p {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
