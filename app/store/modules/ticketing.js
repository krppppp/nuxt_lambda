import Axios from "axios";
import Vuex from 'vuex'

const ticketing = () => {
  return new Vuex.Store({
  namespaced: true,
  state: {
    masterBooks: [], // GET /master_books マスターブック全体
    masterBook: [], // GET /master_books/:id 特定のマスターブック
    bookGroups: [], // GET /book_groups ユーザーの所有するブックグループ全体
    bookGroup: [], // GET /book_groups/:id 特定のブックグループ
    book: [], // GET /books/:id 特定のブック
    masterPass: [], // GET /master_passes/:id 特定のマスターパス
    pass: [], // GET /passes/:id 特定のパス
    masterSheet: [], // GET /master_sheets/:id 特定のマスターシート
    sheet: [], // GET /sheets/:id 特定のシート
    authAPIRequest: {}
  },
  getters: {
    masterBooks(state) {
      return state.masterBooks;
    },
    masterBook(state) {
      return state.masterBook;
    },
    bookGroups(state) {
      return state.bookGroups;
    },
    bookGroup(state) {
      return state.bookGroup;
    },
    book(state) {
      return state.book;
    },
    masterPass(state) {
      return state.masterPass;
    },
    pass(state) {
      return state.pass;
    },
    masterSheet(state) {
      return state.masterSheet;
    },
    sheet(state) {
      return state.sheet;
    }
  },
  mutations: {
    setMasterBooks(state, masterBooks) {
      state.masterBooks = masterBooks;
    },
    setMasterBook(state, masterBook) {
      state.masterBook = masterBook;
    },
    setbookGroups(state, bookGroups) {
      state.bookGroups = bookGroups;
    },
    setbookGroup(state, bookGroup) {
      state.bookGroup = bookGroup;
    },
    setBook(state, book) {
      state.book = book;
    },
    setMasterPass(state, masterPass) {
      state.masterPass = masterPass;
    },
    setPass(state, pass) {
      state.pass = pass;
    },
    setMasterSheet(state, masterSheet) {
      state.masterSheet = masterSheet;
    },
    setSheet(state, sheet) {
      state.sheet = sheet;
    }
  },
  actions: {
    async getRequest(_context, { path, bodyParams }) {
      try {
        return await Axios.get(
          `${process.env.VUE_APP_TICKETING_API_URL}${path}`,
          _context.rootGetters["common/APIGetRequest"],
          {
            params: bodyParams
          }
        );
      } catch (err) {
        throw new Error("UnhandlableError");
      }
    },

    async postRequest(_context, { path, bodyParams }) {
      try {
        return await Axios.post(
          `${process.env.VUE_APP_TICKETING_API_URL}${path}`,
          bodyParams,
          _context.rootGetters["common/APIGetRequest"],
          {}
        );
      } catch (err) {
        throw new Error("UnhandlableError");
      }
    },

    async putRequest(_context, { path, bodyParams }) {
      try {
        await Axios.put(
          `${process.env.VUE_APP_TICKETING_API_URL}${path}`,
          bodyParams,
          _context.rootGetters["common/APIGetRequest"]
        );
      } catch (err) {
        throw new Error("UnhandlableError");
      }
    },

    async deleteRequest(_context, { path, bodyParams }) {
      try {
        await Axios.delete(
          `${process.env.VUE_APP_TICKETING_API_URL}${path}`,
          _context.rootGetters["common/APIGetRequest"],
          bodyParams
        );
      } catch (err) {
        throw new Error("UnhandlableError");
      }
    },

    // Master_book情報取得
    async getMasterBook(context, { id }) {
      var params = {};
      const resp = await context.dispatch("getRequest", {
        path: `master_books/${id}`,
        bodyParams: params
      });
      context.commit("setMasterBook", resp.data);
    },

    async getbookGroup(context, { id }) {
      var params = {};
      const resp = await context.dispatch("getRequest", {
        path: `book_groups/${id}`,
        bodyParams: params
      });
      context.commit("setbookGroup", resp.data);
    },

    async refundBookGroup(context, { id, apiParams }) {
      await context.dispatch("putRequest", {
        path: `book_groups/${id}/payment_status`,
        bodyParams: apiParams
      });
    },

    // BookGroupを取り消しする
    async cancelBookGroup(context, { id }) {
      var params = {};
      await context.dispatch("deleteRequest", {
        bodyParams: params,
        path: `book_groups/${id}`
      });
    },

    // MyticketのBook情報取得
    async getBook(context, { id }) {
      var params = {};
      const resp = await context.dispatch("getRequest", {
        path: `books/${id}`,
        bodyParams: params
      });
      context.commit("setBook", resp.data);
    },

    // MasterPass情報取得
    async getMasterPass(context, { id }) {
      var params = {};
      const resp = await context.dispatch("getRequest", {
        path: `master_passes/${id}`,
        bodyParams: params
      });
      context.commit("setMasterPass", resp.data);
    },

    // MyticketのPass情報取得
    async getPass(context, { id }) {
      var params = {};
      const resp = await context.dispatch("getRequest", {
        path: `passes/${id}`,
        bodyParams: params
      });
      context.commit("setPass", resp.data);
    },

    // MasterSheet情報取得
    async getMasterSheet(context, { id }) {
      var params = {};
      const resp = await context.dispatch("getRequest", {
        path: `master_sheets/${id}`,
        bodyParams: params
      });
      context.commit("setMasterSheet", resp.data);
    },

    // MyticketのSheet情報取得
    async getSheet(context, { id }) {
      var params = {};
      const resp = await context.dispatch("getRequest", {
        path: `sheets/${id}`,
        bodyParams: params
      });
      context.commit("setSheet", resp.data);
    },

    // BookGroup作成API エラーが出たらブラウザに未ログインのダイアログ表示
    async createBookGroup(context, { apiParams }) {
      const resp = await context.dispatch("postRequest", {
        path: `book_groups`,
        bodyParams: apiParams
      });
      context.commit("setbookGroup", resp.data);
    },

    async validBooks(context, { apiParams }) {
      await context.dispatch("postRequest", {
        path: `valid_books`,
        bodyParams: apiParams
      });
    },

    async validPasses(context, { apiParams }) {
      await context.dispatch("postRequest", {
        path: `valid_passes`,
        bodyParams: apiParams
      });
    },
    async usedPasses(context, { apiParams }) {
      await context.dispatch("postRequest", {
        path: `used_passes`,
        bodyParams: apiParams
      });
    },

    // 単品フレームの場合
    async validFrameWithCode(context, { id, emergencyCode, apiParams }) {
      await context.dispatch("putRequest", {
        path: `frames/${id}/emergency_code?code=${emergencyCode}`,
        bodyParams: apiParams
      });
    },

    async validFrameWithQr(
      context,
      { id, masterLocationId, securitySession, apiParams }
    ) {
      console.log("masterLocationId :", masterLocationId);
      await context.dispatch("putRequest", {
        path: `frames/${id}/qrcode?master_location_id=${masterLocationId}&security_session=${securitySession}`,
        bodyParams: apiParams
      });
    },

    // 複数のフレームの場合
    async validFramesWithCode(context, { emergencyCode, apiParams }) {
      await context.dispatch("postRequest", {
        path: `emergency_code_frames?code=${emergencyCode}`,
        bodyParams: apiParams
      });
    },

    async validFramesWithQr(
      context,
      { masterLocationId, securitySession, apiParams }
    ) {
      console.log("masterLocationId :", masterLocationId);
      await context.dispatch("postRequest", {
        path: `qrcode_frames?master_location_id=${masterLocationId}&security_session=${securitySession}`,
        bodyParams: apiParams
      });
    },

    // BookGroup作成とともに発着駅を収集するためのAPI MasterBookID:45のみ適用
    async collectStation(context, { station, book_group_id, env }) {
      await Axios.get(
        `https://2wk7fet2tk.execute-api.ap-northeast-1.amazonaws.com/v1/kintetsu?station=${station}&book_group_id=${book_group_id}&env=${env}`
      );
    }
  }
})
}

export default ticketing

