export const common = {
  namespaced: true,
  state: {
    lang: "ja", // 言語
    device: null, // 使用端末
    idToken: null, // MaaS Japan IDトークン
    accessToken: null, // MaaS Japanアクセストークン
    isCreditAvailable: null, // クレジットカード登録有無
    isPaymentDone: null // ISAO決済完了フラグ
  },
  getters: {
    lang(state) {
      return state.lang;
    },
    device(state) {
      return state.device;
    },
    idToken(state) {
      return state.idToken;
    },
    APIidToken(state) {
      return "Bearer " + state.idToken;
    },
    accessToken(state) {
      return state.accessToken;
    },
    APIGetRequest(state) {
      return {
        params: { language: state.lang },
        headers: {
          Authorization: "Bearer " + state.idToken
        }
      };
    },
    isCreditAvailable(state) {
      return state.isCreditAvailable;
    },
    isPaymentDone(state) {
      return state.isPaymentDone;
    }
  },
  mutations: {
    setLang(state, lang) {
      state.lang = lang;
    },
    setDevice(state, device) {
      state.device = device;
    },
    setIdToken(state, idToken) {
      state.idToken = idToken;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    setIsCreditAvailable(state, isCreditAvailable) {
      state.isCreditAvailable = isCreditAvailable;
    },
    setIsPaymentDone(state, isPaymentDone) {
      state.isPaymentDone = isPaymentDone;
    }
  }
};
