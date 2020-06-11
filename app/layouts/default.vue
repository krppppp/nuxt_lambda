<template>
  <div id="app">
    <!-- 描画開始 -->
    <template v-if="state === 'rendering'">
      ロード中
    </template>

    <!-- 認証情報取得成功 -->
    <template v-else-if="state === 'mounted'">
      <nuxt />
    </template>

    <!-- 認証情報取得失敗 -->
    <template v-else>
    認証失敗
    </template>
  </div>
</template>

<script>
import '@/assets/scss/base.scss'

import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import CommonTools from "@/components/mixins/CommonTools.vue";
// import EventPrevent from "@/components/mixins/EventPrevent";


/* Callback from Native */
// Nativeからの呼び出しに対応するため,window関数で定義
// idTokenの取得
if (process.browser) {
window.returnIDToken = function(token, store) {
    console.log(3);

  store.commit("common/setIdToken", token);
    console.log(5);

};

// accessTokenの取得
window.returnAccessToken = function(token, store) {
  store.commit("common/setAccessToken", token);
};

// ISAO与信確保成功時のCallback
window.returnPaymentSuccess = function() {
  $store.commit("common/setIsPaymentDone", true);
};

// ISAO与信確保失敗時のCallback
window.returnPaymentCancel = function() {
  store.commit("common/setIsPaymentDone", false);
};
}

export default {
  name: "App",
  mixins: [ CommonTools ],
  created() {
    // 言語設定(クエリパラメータに指定がない、または不正な場合はデフォルトの言語に設定される)
    const availableLanguages = ["ja", "en"];


  },
  async mounted() {
    console.log('this.device :>> ',  this.getDevice());
    this.getDevice();
    console.log('this.device :>> ', this.device);

    // ブラウザ用
    if (this.device === "BROWSER" && this.$route.query.idToken != null) {
      this.setIdToken(this.$route.query.idToken);
    }
    if (this.device === "BROWSER" && this.$route.query.accessToken != null) {
      this.setAccessToken(this.$route.query.accessToken);
    }

    // ブラウザ用
    if (this.idToken === null) {
      await this.getIDToken();
    }
    if (this.accessToken === null) {
      await this.getAccessToken();
    }
    console.log(3);
  },
  data() {
    return {
      state: "rendering",
      dontCheckTokenViewList: ["MasterBook", "BookingMobility"],
      presetIdToken:
        "eyJraWQiOiJUVjVLN2d6VnVRVFpcL1owdVdjUHZ4bXZzZ1AweUJsTlhFaGpWUVJoR2hEMD0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiVzB1V3NjenU4eWdfNDFTV0NvZjhVUSIsInN1YiI6IjZjOGYxNGU0LWE5ZTAtNDc1Mi1iMGI2LTZiMTU4M2IyNjY1MiIsImNvZ25pdG86Z3JvdXBzIjpbImFwLW5vcnRoZWFzdC0xX1RNNFJSWFRTWV9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtbm9ydGhlYXN0LTFfVE00UlJYVFNZIiwiY29nbml0bzp1c2VybmFtZSI6Ikdvb2dsZV8xMTI1OTY1NjEyOTUxMjMyOTY5MzQiLCJhdWQiOiI0MW1lMGphbGNiMW9mcnB0azRyN2VndHBjbiIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjExMjU5NjU2MTI5NTEyMzI5NjkzNCIsInByb3ZpZGVyTmFtZSI6Ikdvb2dsZSIsInByb3ZpZGVyVHlwZSI6Ikdvb2dsZSIsImlzc3VlciI6bnVsbCwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE1NzAwNzE2MzEzMjAifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTkxODU1NDE2LCJleHAiOjE1OTE4NjI2MjgsImlhdCI6MTU5MTg1OTAyOCwiZW1haWwiOiJ5dXlhX2t1cm9pd2FAdmFsLmNvLmpwIn0.dMQtqllbrU3G_85VSQeRou3p6-417JmaVg2QKABihRHwm6RdZj9l4D0b4cyl4MuiCvknwaXq-zpX8QUNIJL-Qo7lTc3XilpYYhBXHFUiupbOHxf30rKEHXTP7ytVMKwsqRdXT_26rXQyKCglzjC9aMuhjfqYxijd_WVDXnAnTqb0h_8Ovoooh_VL_1KIGtLQkFhROwOT3JIFj8LNx81v0ywFtgZJPrUitc-s4iPAWr6R8aEQ2UnPjBrO5TOgXWHaba_7HyDU_OCuBAXB6B8rQHoCCog2OEp23iN2fngolTSJqK7JjHh3DEt32fNTw6-6Aq-5HrerkRN1Jn4B56qONw",
      presetAccessToken: "a",
    };
  },
  computed: {
    hasIdToken() {
      const idToken = this.$store.getters["common/idToken"];
      return idToken.length > 0;
    },
    isLogined() {
      const idToken = this.$store.getters["common/idToken"];
      const accessToken = this.$store.getters["common/accessToken"];
      return idToken.length * accessToken.length > 0;
    },
    ...mapGetters("common", ["device", "idToken", "accessToken"])
  },
  watch: {
    // idTokenとaccessTokenの両方がセットされたタイミングでsetTokenDoneメソッドを発火させる
    idToken(value) {
      if (typeof value === "string" && typeof this.accessToken === "string") {
        this.setTokenDone();
      }
    },
    // idTokenとaccessTokenの両方がセットされたタイミングでsetTokenDoneメソッドを発火させる
    accessToken(value) {
      if (typeof this.idToken === "string" && typeof value === "string") {
        this.setTokenDone();
      }
    }
  },
  methods: {
    setTokenDone() {
      var isGetTokenSuccess = false;
      if (this.dontCheckTokenViewList.includes(this.$route.name)) {
        // ログインをチェックしないViewの場合は必ず返却されるidTokenの値だけ見て返す
        isGetTokenSuccess = this.hasIdToken;
      } else {
        // ログインをチェックするViewの場合は、両トークンに値が入ることを確認する
        isGetTokenSuccess = this.isLogined;
      }
      this.state = isGetTokenSuccess ? "mounted" : "noToken";
    },


    callNativeMethod(action, message = null) {
      const device = this.$store.getters["common/device"] || this.getDevice();
      let postMessage;
      switch (device) {
        case "IOS":
          if (message === null) {
            postMessage = "";
          } else {
            postMessage = message;
          }
          // eslint-disable-next-line no-undef
          webkit.messageHandlers[action].postMessage(postMessage);
          return true;
        case "ANDROID":
          try {
            if (message === null) {
              // eslint-disable-next-line no-undef
              android[action]();
            } else {
              postMessage = message;
              // eslint-disable-next-line no-undef
              android[action](postMessage);
            }
          } catch (err) {
            alert(err);
          }
          return true;
        default:
          return false;
      }
    },
    getIDToken() {
      const done = this.callNativeMethod("getIDToken");
      if (!done) {
        console.log('this.$store :>> ', this.$store);
        window.returnIDToken(this.presetIdToken, this.$store);
      }
    },
    getAccessToken() {
      const done = this.callNativeMethod("getAccessToken");
      if (!done) {
        window.returnAccessToken(this.presetAccessToken, this.$store);
      }
    },
    // 単純にWebview を閉じてネイティブに戻る
    returnNativeApp() {
      const done = this.callNativeMethod("closeWeb");
      if (!done) {
        window.location.href = `${process.env.VUE_APP_BETA_NATIVE_APP_URL}store`;
      }
    },
    // 成功処理のあと、MYチケットページのネイティブがストアページで開いていたタブへ飛ぶ
    returnNativeAppMyticketPage() {
      const done = this.callNativeMethod("returnWeb");
      if (!done) {
        window.location.href = `${process.env.VUE_APP_BETA_NATIVE_APP_URL}my-tickets`;
      }
    },
    // 非同期で新しいAPIトークンを取得したらエラーが発生したAPIコールを再度実行する。
    returnNativeAppToAccountPage() {
      const done = this.callNativeMethod("errorWeb", "E00000001");
      if (!done) {
        window.location.href = `${process.env.VUE_APP_BETA_NATIVE_APP_URL}my-tickets`;
      }
    },
    // ネイティブコールで外部リンクへ
    goToExternalLink(linkURL) {
      const done = this.callNativeMethod("openURL", linkURL);
      if (!done) {
        open(linkURL, "_blank");
      }
    },
    getDevice() {
      const ua = window.navigator.userAgent.toLowerCase();
      let device = null;
      // iOS
      if (ua.indexOf("iphone") !== -1 || ua.indexOf("ipad") !== -1) {
        device = "IOS";
        // Android
      } else if (ua.indexOf("android") !== -1) {
        device = "ANDROID";
        // Other (Error)
      } else {
        device = "BROWSER";
      }

      this.$store.commit("common/setDevice", device);
      return device;
    },



    ...mapMutations("common", ["setIdToken", "setAccessToken", "setLang"])
  }
};
</script>

<style lang="scss"></style>
