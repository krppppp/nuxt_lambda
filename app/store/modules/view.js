export const view = {
  namespaced: true,
  state: {
    pageStack: [], // ページスタック
    loadingModal: {
      visible: false,
      message: ""
    } // ローディング用モーダル
  },
  getters: {
    pageStack(state) {
      return state.pageStack;
    },
    loadingModal(state) {
      return state.loadingModal;
    }
  },
  mutations: {
    syncPageStack(state, page) {
      state.pageStack = Array.isArray(page)
        ? page
        : [page || state.pageStack[0]];
    },
    // モーダル表示
    openModal(state, payload) {
      state[payload.modalName].visible = true;
      if (payload.message) {
        state[payload.modalName].message = payload.message;
      }
    },
    // モーダル非表示
    closeModal(state, payload) {
      state[payload.modalName].visible = false;
    }
  }
};
