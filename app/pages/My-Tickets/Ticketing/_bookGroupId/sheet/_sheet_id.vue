<template>
  <!---全体を囲む--->
  <div class="content-wrapper">
    <template v-if="isReadyToDraw">
      <the-header
        :headerTitle="masterSheet.name"
        :transparentThreshold="316"
        :initialTranparent="true"
        :clickBackButtonEvent="returnNativeApp"
      />

      <!---メイン画像 -->
      <div
        class="heading-image"
        :style="
          backgroundImageFromApi(masterSheet.content.sheet_detail_image_url)
        "
      ></div>

      <section class="section-top section-bg-white">
        <h1 class="title">
          {{ masterSheet.name }}
        </h1>
        <div class="description">
          <p>
            {{ masterSheet.comment }}
          </p>
        </div>
      </section>

      <!-- チケット情報 -->
      <section>
        <h2 class="ribbon">{{ $t("common.Tickets") }}</h2>
        <section class=" section-bg-white">
          <div class="columns">
            <div class="label">{{ $t("common.validPeriod") }}</div>

            <div class="value">
              <span class="datetime">
                {{ displayDate(book.user_started_at) }} -
                {{ displayDateMinus1D(book.user_limited_at) }}
              </span>
              <small>
                ({{ masterBook.valid_period.replace(/[^0-9]/g, "") }}
                {{ $t("common.effectiveDays") }})
              </small>
            </div>
          </div>

          <!-- 購入総枚数のみでいい-->
          <div class="columns">
            <div class="label">
              利用可能回数
            </div>
            <div class="value" v-if="masterBook.id != (1 || 2)">
              <span style="margin:0 2px;">{{ unused_frames.length }}回 </span>
            </div>
          </div>
        </section>
        <a
          @click="goToExternalLink($t(masterBook.content.terms_url))"
          class="button"
        >
          <div class="title">{{ $t("common.availableplace") }}</div>
        </a>

        <a
          @click="goToExternalLink($t(masterBook.content.terms_url))"
          class="button"
        >
          <div class="title">{{ $t("common.terms") }}</div>
        </a>
        <a @click="goToEmergencyCode()" class="button">
          <div class="title">
            {{ $t("MyTicketTicketing.entryThePasscode") }}
          </div>
        </a>
      </section>
      このシートが持ってるフレーム数{{ sheet.frames.length }}<br /><br />
      使用済みのフレーム{{ used_frames.length }}<br /><br />
      未使用フレーム{{ unused_frames.length }}<br /><br />
      これからvalidされる予定のフレーム もしくは
      すでに有効かされ、かつ有効期限内のフレーム{{ frames }}<br /><br />

      <div class="actions">
        <item-button
          v-if="book.is_valid && canUse"
          :label="$t('MyTicketTicketing.UseTicket')"
          actionType="btn-primary"
          @clicked="goToQR"
        />
        <item-button
          v-else-if="!book.is_valid && canUse"
          :label="$t('MyTicketTicketing.UseTicket')"
          actionType="btn-primary"
          @clicked="openDialog"
        />
        <item-button
          v-else
          :label="$t('MyTicketTicketing.UseTicket')"
          actionType="btn-primary"
          @clicked="goToSheetUsed"
        />
      </div>
    </template>

    <!-- 描画ローディング -->
    <dialog-loading v-else />

    <ItemDialog ref="validFramesLoadingDialog" imageType="loader"> </ItemDialog>
    <!-- ローディングダイアログ -->

    <!-- 認証成功 -->
    <ItemDialog ref="validFramesComplete" imageType="done">
      <div slot="content-area">
        <h2>
          {{ $t("MyTicketTicketing.QRSuccess.title") }}
        </h2>
        <p class="text-center">
          {{ $t("MyTicketTicketing.QRSuccess.description") }}
        </p>
      </div>
      <div slot="button-area">
        <button class="btn btn-primary" @click="OK(2)">
          <span>OK</span>
        </button>
      </div>
    </ItemDialog>
    <!-- 認証成功 -->

    <!-- 認証失敗 -->
    <ItemDialog ref="validFramesFails" imageType="alert">
      <div slot="content-area">
        <h2>
          {{ $t("MyTicketTicketing.QRFailed.title") }}
        </h2>
        <p class="text-center">
          {{ $t("MyTicketTicketing.QRFailed.description") }}
        </p>
      </div>
      <div slot="button-area">
        <button class="btn btn-primary" @click="goToEmergencyCode(frames)">
          <span>
            {{ $t("MyTicketTicketing.QRFailed.buttonLabel1") }}
          </span>
        </button>
        <button class="btn button-cancel" @click="OK(3)">
          <span>
            {{ $t("MyTicketTicketing.QRFailed.buttonLabel2") }}
          </span>
        </button>
      </div>
    </ItemDialog>
    <!-- 認証失敗 -->

    <!-- ブックが未使用だったら出るダイアログ-->
    <ItemDialog ref="validBook" imageType="alert">
      <div slot="content-area">
        <h2>
          {{ $t("MyTicketTicketing.validBooks.title") }}
        </h2>
        <p class="text-center">
          {{ $t("MyTicketTicketing.validBooks.description1") }}
          {{ book.name }}
          {{ $t("MyTicketTicketing.validBooks.description2") }}
        </p>
      </div>
      <div slot="button-area">
        <button class="btn btn-primary" @click="agreeTrue(goToQR())">
          <span>
            {{ $t("MyTicketTicketing.validBooks.buttonLabel1") }}
          </span>
        </button>
        <button class="btn button-cancel" @click="OK(1)">
          <span>
            {{ $t("MyTicketTicketing.validBooks.buttonLabel2") }}
          </span>
        </button>
      </div>
    </ItemDialog>
    <!-- ブックが未使用だったら出るダイアログ-->
  </div>
  <!---全体を囲む--->
</template>

<script>
import { mapGetters } from "vuex";
import CommonTools from "@/components/mixins/CommonTools.vue";
import TicketingTools from "@/components/mixins/TicketingTools";

if (process.browser) {

// QRコード結果受信→Vue内のvalidメソッドを実行
window.returnQRCode = function(qrCodeText) {
  document.querySelector("#app").__vue__.$children[0].validFrames(qrCodeText);
};

window.onload = function() {};
}
export default {
  mixins: [CommonTools, TicketingTools],
  created() {
    // デフォルトデータ設定
    this.masterSheet.content = { description_json: "" };
  },
  async mounted() {
    this.addClassToBody("ticket-detail");

    await this.getInformations();
    if (this.masterBook.id == 3 || this.masterBook.id == 4) {
      await this.setSubscriptionFrame();
    } else {
      await this.setFrames();
    }
    console.log("this.framesaa  :>> ", this.frames);

    // sheetが使われていたらその時点でUsedの方にリダイレクト
    console.log("使われている？ ", this.frames.stamped_at);
    console.log(
      "this.book.is_valid && this.validTime(this.frames.stamped_at) :>> ",
      this.book.is_valid && this.validTime(this.frames.stamped_at)
    );
    // if (this.book.is_valid && this.validTime(this.frames.stamped_at)) {
    //   this.goToSheetUsed();
    // }

    await this.seatArrange(this.bookGroup, this.masterBook, false);
    await this.displayOtherEle();
  },
  data() {
    return {
      // 席種・席数まとめ用
      seatInformation: TicketingTools.seatInformation,
      // 席種・席数・合計金額の計算終了フラグ
      seatArrangeIsDone: TicketingTools.seatArrangeIsDone,
      // 使うフレームの特定用
      frames: {},
      unused_frames: {},
      used_frames: {}
    };
  },
  methods: {
    async getInformations() {
      await this.$store.dispatch("ticketing/getSheet", {
        id: this.$route.params.sheet_id
      });
      await this.$store.dispatch("ticketing/getMasterSheet", {
        id: this.sheet.master_sheet_id
      });
      await this.$store.dispatch("ticketing/getbookGroup", {
        id: this.$route.params.book_group_id
      });
      await this.$store.dispatch("ticketing/getMasterBook", {
        id: this.bookGroup.books[0].master_book_id
      });
      await this.$store.dispatch("ticketing/getBook", {
        id: this.bookGroup.books[0].id
      });
    },
    // APIに指定するFrameのあぶり出し関数
    setFrames() {
      var sheets = [];
      var frames = [];
      var that = this;

      this.bookGroup.books.forEach(function(bookEach) {
        bookEach.sheets.forEach(function(sheetEach) {
          if (that.sheet.master_sheet_id == sheetEach.master_sheet_id) {
            sheets.push(sheetEach);
            sheetEach.frames.forEach(function(frameEach) {
              frames.push(frameEach);
            });
          }
        });
      });
      this.frames = frames;
    },
    // APIに指定するFrameのあぶり出し関数
    setSubscriptionFrame() {
      this.used_frames = this.sheet.frames.filter(function(value) {
        return value.stamped_at;
      });
      this.unused_frames = this.sheet.frames.filter(function(value) {
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
    openDialog() {
      this.$refs.validBook.open();
    },
    async agreeTrue(nextMethod) {
      await this.$refs.validBook.close();
      await nextMethod;
    },
    async validBooks() {
      var apiParams = [];
      this.bookGroup.books.forEach(function(bookEach) {
        apiParams.push({ id: bookEach.id });
      });
      await this.$store.dispatch("ticketing/validBooks", {
        apiParams: apiParams
      });
    },
    async validFrames(qrCodeText) {
      try {
        this.$refs.validFramesLoadingDialog.open();

        // QRで読み込んだ文字列より数字を抽出する簡単な処理
        var masterLocationID = qrCodeText.replace(/[^0-9]/g, "");

        // 現在時刻+指定の文字列をBase64でエンコードしPOST API
        var currentTime = this.$moment(new Date()).format();
if (process.browser) {

        var securitySession = window.btoa(
          currentTime + "IXOYs2jMqCaymwbvsRw5QPGmecYUhggl"
        );
}
        var apiParams = [];
        console.log("this.frames :>> ", this.frames);
        if (this.masterBook.id == 3) {
          await this.$store.dispatch("ticketing/validFrameWithQr", {
            id: this.unused_frames[0].id,
            masterLocationId: masterLocationID,
            securitySession: securitySession,
            apiParams: apiParams
          });
        } else {
          this.frames.forEach(function(frameEach) {
            apiParams.push({ id: Number(frameEach.id) });
          });
          await this.$store.dispatch("ticketing/validFramesWithQr", {
            id: this.unused_frames[0].id,
            masterLocationId: masterLocationID,
            securitySession: securitySession,
            apiParams: apiParams
          });
        }

        // ブック自体を初めて使う場合はブックをvalidにする処理を挟む
        if (!this.book.is_valid) {
          await this.validBooks();
        }

        // 最新のbook_groupを取得
        await this.$store.dispatch("ticketing/getbookGroup", {
          id: this.$route.params.book_group_id
        });

        // 最新のFrame情報にアップデート
        await this.setFrames();

        this.$refs.validFramesLoadingDialog.close();
        this.$refs.validFramesComplete.open();
      } catch (err) {
        console.log(err);
        this.$refs.validFramesLoadingDialog.close();
        this.$refs.validFramesFails.open();
      }
    },
    // その他欄にて子要素に中身がなければ、非表示
    displayOtherEle() {
      var element1 = document.getElementById("other1");
      var element2 = document.getElementById("other2");
      if (!element1 && !element2) {
        var removeElem = document.getElementById("other");
        removeElem.parentNode.removeChild(removeElem);
      }
    },
    // 現在のフレームを使用した時間
    validTime(time) {
      return this.$moment(new Date(`${time}`)).format("YYYY.MM.DD HH:mm:ss");
    },
    // ダイアログの削除関数
    OK(dialog) {
      switch (dialog) {
        case 1:
          this.$refs.validBook.close();
          return;
        case 2:
          this.$refs.validFramesComplete.close();
          this.goToSheetUsed();

          return;
        case 3:
          this.$refs.validFramesFails.close();
          return;
      }
    },
    // ネイティブQRへの関数
    goToQR() {
      const device =
        this.$store.getters["common/device"] || this.$parent.getDevice();
      switch (device) {
        case "IOS":
          // eslint-disable-next-line no-undef
          webkit.messageHandlers.loadQRCode.postMessage("");
          return;
        case "ANDROID":
          // eslint-disable-next-line no-undef
          android.loadQRCode();
          return;
        default:
if (process.browser) {

          window.returnQRCode("/frames/:id/qrcode?master_location_id=71");
}
          return;
      }
    },
    goToSheetUsed() {
      this.$router.push({
        name: "SheetUsed",
        params: {
          book_group_id: this.$route.params.book_group_id,
          book_id: this.book.id,
          sheet_id: this.sheet.id
        },
        query: { language: this.$store.getters["common/lang"] }
      });
    },
    goToEmergencyCode() {
      this.$router.push({
        name: "EmergencyCode",
        params: {
          book_group_id: this.$route.params.book_group_id,
          sheet_id: this.$route.params.sheet_id,
          frame_id: String(this.frames.id)
        },
        query: { language: this.$store.getters["common/lang"] }
      });
    },
    goToSheetTargetStore() {
      this.$router.push({
        name: "SheetTargetStore",
        params: {
          book_group_id: this.$route.params.book_group_id,
          sheet_id: this.$route.params.sheet_id
        },
        query: { language: this.$store.getters["common/lang"] }
      });
    }
  },

  computed: {
    // フレームが使える条件のまとめ関数
    canUse() {
      return (
        !this.is_validFramesExist &&
        this.is_valid_pereod &&
        this.bookGroup.payment_status == "paid"
      );
    },
    is_validFramesExist() {
      return this.frames.stamped_at;
    },
    // ブックの期限内かどうかのチェック演算
    is_valid_pereod() {
      var start = this.book.user_started_at;
      var limit = this.book.user_limited_at;
      var now = this.$moment(new Date());
      var boolean = now.isAfter(start) && now.isBefore(limit) ? true : false;
      return boolean;
    },
    isReadyToDraw() {
      console.log("this.frames.length :>> ", this.frames.length);
      return (
        this.book.id &&
        this.sheet.id &&
        this.bookGroup.id &&
        this.masterSheet.id &&
        this.frames &&
        this.seatArrangeIsDone
      );
    },
    ...mapGetters("ticketing", [
      "masterBook",
      "sheet",
      "masterSheet",
      "bookGroup",
      "book"
    ])
  }
};
</script>

<style lang="scss" scoped>
.content-wrapper {
  padding-bottom: var(--sticky-height--withoutCheckbox);
}
</style>
