<template>
  <!---全体を囲む--->
  <div class="content-wrapper">
    <template v-if="isReadyToDraw">
      <the-header
        :transparentThreshold="316"
        :initialTranparent="true"
      />
      <div
        class="heading-image"
        :style="
          backgroundImageFromApi(masterBook.content.ticket_detail_image_url)
        "
      ></div>

      <section class="section-top section-bg-white">
        <h1 class="title">
          {{ masterBook.name }}
        </h1>
        <div class="description">
          <p>
            {{ masterBook.comment }}
          </p>
        </div>
      </section>

      <!-- チケット情報 -->
      <section>
        <h2 class="ribbon">チケット名</h2>
        <section class=" section-bg-white">
          <div class="columns">
            <div class="label">有効期間</div>
            <div v-if="masterBook.valid_period == '1days'" class="value">
              <span class="datetime">
                {{ book.user_started_at }}
              </span>
              <small> (1日有効) </small>
            </div>
            <div v-else class="value">
              <span class="datetime">
                {{ book.user_started_at }} -
                {{ book.user_limited_at }}
              </span>
              <small>
                ({{ masterBook.valid_period.replace(/[^0-9]/g, "") }}
                日間
              </small>
            </div>
          </div>

          <div v-if="masterBook.id == (1 || 2)" class="columns">
            <div class="label">
              発駅
            </div>
            <div class="value">
              {{ book.price.from_station.name }}
            </div>
          </div>

          <div v-if="masterBook.id == (3 || 4)" class="columns">
            <div class="label">
              利用可能回数
            </div>
            <div class="value">
              <span style="margin:0 2px;">{{ unused_frames.length }}回 </span>
            </div>
          </div>

          <!-- 購入総枚数のみでいい-->
          <div class="columns">
            <div class="label">
              人数
            </div>
            <div
              class="value"
              v-if="
                masterBook.id == 1 ||
                  masterBook.id == 2 ||
                  masterBook.id == 3 ||
                  masterBook.id == 4
              "
            >
              <span style="margin:0 2px;">おとな 1</span>
            </div>
            <div class="value" v-else>
              <span
                style="margin:0 2px;"
                v-for="(n, index) in seatInformation"
                :key="index"
              >
                {{ n.name }} {{ n.count }}</span
              >
            </div>
          </div>
        </section>

        <!-- 特徴やメニュー -->
        <a
          v-if="masterBook.id != (3 || 4)"
          @click="goToExternalLink('masterBook.content.ticket_site_url')"
          class="button"
        >
          <div class="title">{{ masterBook.name }}の特徴</div>
        </a>
        <a
          v-else
          @click="
            goToExternalLink('https://contents-staging.maasjapan.net/odakyu/master_books/food_subscription/features/index.html')
          "
          class="button"
        >
          <div class="title">提供メニュー</div>
        </a>
        <!-- 特徴やメニュー -->
        <a
          @click="goToExternalLink('masterBook.content.terms_url')"
          class="button"
        >
          <div class="title">利用規約</div>
        </a>
      </section>

      <div class="actions">
        <item-button
          v-if="bookGroup.payment_status == `refunded`"
          label="払い戻し"
          :isDisabled="true"
          actionType="button-negative"
          @clicked="goToBookRefund"
        />
        <item-button
          v-else-if="
            !bookGroup.books[0].is_valid &&
              
              masterBook.refundable
          "
          label="払い戻し"
          actionType="btn-refund"
          @clicked="goToBookRefund"
        />
      </div>
    </template>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CommonTools from "@/components/mixins/CommonTools.vue";
import TicketingTools from "@/components/mixins/TicketingTools";
// import NativeHandler from "@/components/mixins/NativeHandler.vue";

export default {
  mixins: [CommonTools, TicketingTools],
  async created() {
    // デフォルトデータ設定
    this.masterBook.content = { description_json: "" };
  },
  async mounted() {
    await this.getInformations();
    if (this.masterBook.id == 3 || this.masterBook.id == 4) {
      // await this.setSubscriptionFrame();
    }
    await this.seatArrange(this.bookGroup, this.masterBook, false);
    this.addClassToBody("ticket-detail");
  },
  data() {
    return {
      seatInformation: TicketingTools.seatInformation,
      seatArrangeIsDone: TicketingTools.seatArrangeIsDone,

      // サブスク用の使うフレームの特定用データ
      frames: {},
      unused_frames: {},
      used_frames: {}
    };
  },
  methods: {
    async getInformations() {
      await this.$store.dispatch("ticketing/getbookGroup", {
        id: this.$route.params.book_group_id
      });
      // BookGroupからマスターブックを取得
      await this.$store.dispatch("ticketing/getMasterBook", {
        id: this.bookGroup.books[0].master_book_id
      });
      // BookGroupからブック取得
      await this.$store.dispatch("ticketing/getBook", {
        id: this.bookGroup.books[0].id
      });
    },
    // APIに指定するFrameのあぶり出し関数
    setSubscriptionFrame() {
      this.used_frames = this.book.sheets[0].frames.filter(function(value) {
        return value.stamped_at;
      });
      this.unused_frames = this.book.sheets[0].frames.filter(function(value) {
        return !value.stamped_at;
      });
      this.frames = this.unused_frames[0];

      if (this.used_frames.length > 0) {
        var current_time = this.$moment(new Date());
        if (
          current_time.isSame(
            this.validTime(this.used_frames[0].stamped_at),
            "day"
          )
        ) {
          console.log("本日使用したframeあり");
          this.frames = this.used_frames[0];
        }
      }
    },
    // 現在のフレームを使用した時間
    validTime(time) {
      time
      // return this.$moment(new Date(`${time}`)).format("YYYY.MM.DD HH:mm:ss");
    },
    goToBookRefund() {
      this.$router.push({
        name: "BookRefund",
        params: {
          book_group_id: this.$route.params.book_group_id,
          book_id: this.$route.params.book_id
        },
        query: { language: this.$store.getters["common/lang"] }
      });
    }
  },

  computed: {
    isReadyToDraw() {
      return (
        this.masterBook.content &&
        this.book.id &&
        this.bookGroup.id &&
        this.seatArrangeIsDone
      );
    },
    // // ブックの期限日前かどうかのチェック
    // is_valid_pereod() {
    //   var limit = this.book.user_limited_at;
    //   var now = this.$moment(new Date());
    //   return now.isBefore(limit) ? true : false;
    // },
    ...mapGetters("ticketing", ["masterBook", "book", "bookGroup"])
  }
};
</script>

<style lang="scss" scoped>
p {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
