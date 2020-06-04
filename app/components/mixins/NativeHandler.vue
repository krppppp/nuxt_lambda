<script>
// ブラウザ作業で必要なトークンの取得
import store from "../../store/index";

/* Callback from Native */
// Nativeからの呼び出しに対応するため,window関数で定義
// idTokenの取得
if (process.browser) {
window.returnIDToken = function(token) {
  store.commit("common/setIdToken", token);
};

// accessTokenの取得
window.returnAccessToken = function(token) {
  store.commit("common/setAccessToken", token);
};

// ISAO与信確保成功時のCallback
window.returnPaymentSuccess = function() {
  store.commit("common/setIsPaymentDone", true);
};

// ISAO与信確保失敗時のCallback
window.returnPaymentCancel = function() {
  store.commit("common/setIsPaymentDone", false);
};
}

export default {
  data() {
    return {
      presetIdToken:
        "eyJraWQiOiJUVjVLN2d6VnVRVFpcL1owdVdjUHZ4bXZzZ1AweUJsTlhFaGpWUVJoR2hEMD0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiWFlUaU52SXlYNjZYUktIOEhDQ1BpQSIsInN1YiI6IjZjOGYxNGU0LWE5ZTAtNDc1Mi1iMGI2LTZiMTU4M2IyNjY1MiIsImF1ZCI6IjQxbWUwamFsY2Ixb2ZycHRrNHI3ZWd0cGNuIiwiY29nbml0bzpncm91cHMiOlsiYXAtbm9ydGhlYXN0LTFfVE00UlJYVFNZX0dvb2dsZSJdLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiIxMTI1OTY1NjEyOTUxMjMyOTY5MzQiLCJwcm92aWRlck5hbWUiOiJHb29nbGUiLCJwcm92aWRlclR5cGUiOiJHb29nbGUiLCJpc3N1ZXIiOm51bGwsInByaW1hcnkiOiJ0cnVlIiwiZGF0ZUNyZWF0ZWQiOiIxNTcwMDcxNjMxMzIwIn1dLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU4ODgxNjI5MSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLW5vcnRoZWFzdC0xX1RNNFJSWFRTWSIsImNvZ25pdG86dXNlcm5hbWUiOiJHb29nbGVfMTEyNTk2NTYxMjk1MTIzMjk2OTM0IiwiZXhwIjoxNTkxMjY0NzY2LCJpYXQiOjE1OTEyNjExNjYsImVtYWlsIjoieXV5YV9rdXJvaXdhQHZhbC5jby5qcCJ9.XCMKaGb41XAC5tIwhGk-Q7LuYrZQ1EUmUDY4zlxXsbaqiP6ueq6gDCsKP5Y2vugwNvKYY7gLpS8MMuGpEZGmyO0ii_WFPfF54cT1c7xH2TJoMZs_q9BSDMJ-0nkO1nSGqDE1JSVRhqj-0Ki92l7jVWwkKWJzNlbRp1ymNZI9_Bqhlj08VRbG4JIPCQPpDDDFFE-37ePI9-GDEGZ3uvzBdFVJRIzqXJw6GM6Yo6xaZBkSNyzLJueKM0NdF2ZMZCc1c5nX8BtZ6oR0DA-Ss66EKUkVH_hWVJYjquE3GgvoP9vq7Ub0DaBhkncd5JaEHZnsjMKM_2UqG9nuvib1Fp6_ww",
      presetAccessToken: "a",
      lang: this.$store.getters["common/lang"]
    };
  },
  computed: {
    hasIdToken() {
      const idToken = store.getters["common/idToken"];
      return idToken.length > 0;
    },
    isLogined() {
      const idToken = store.getters["common/idToken"];
      const accessToken = store.getters["common/accessToken"];
      return idToken.length * accessToken.length > 0;
    }
  },
  methods: {
    callNativeMethod(action, message = null) {
      const device = store.getters["common/device"] || this.getDevice();
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
        window.returnIDToken(this.presetIdToken);
      }
    },
    getAccessToken() {
      const done = this.callNativeMethod("getAccessToken");
      if (!done) {
        window.returnAccessToken(this.presetAccessToken);
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
    // ネイティブアプリに新しいAPIトークンを要求する。非同期で新しいAPIトークンを取得したらエラーが発生したAPIコールを再度実行する。
    reGetIDToken() {
      // デバック用
      // const device = store.getters["common/device"] || this.getDevice();
      // switch (device) {
      //   case "IOS":
      //     alert("iphone");
      //     // eslint-disable-next-line no-undef
      //     webkit.messageHandlers.errorWeb.postMessage("E00000002");
      //     alert("送った");
      //     break;
      //   case "ANDROID":
      //     // eslint-disable-next-line no-undef
      //     android.errorWeb("E00000002");
      //     break;
      //   case "BROWSER":
      //     window.location.href = `${process.env.VUE_APP_BETA_NATIVE_APP_URL}my-tickets`;
      //     break;
      // }

      // 正規関数
      const done = this.callNativeMethod("errorWeb", "E00000002");
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

      store.commit("common/setDevice", device);
      return device;
    }
  }
};
</script>
