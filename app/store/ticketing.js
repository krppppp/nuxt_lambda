import Axios from "axios";

export const state = () => ({
  masterBooks: [], // GET /master_books マスターブック全体
  masterBook: [], // GET /master_books/:id 特定のマスターブック
  bookGroups: [], // GET /book_groups ユーザーの所有するブックグループ全体
  bookGroup: [], // GET /book_groups/:id 特定のブックグループ
  book: [], // GET /books/:id 特定のブック
})

export const getters = {
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
}

export const mutations = {
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
}

export const actions = {
  async getRequest(_context, { path, bodyParams }) {
    console.log('_context :>> ', _context);
    try {
      return await Axios.get(
        `https://api-development.maasjapan.net/${path}`,
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

    // MyticketのBook情報取得
    async getBook(context, { id }) {
      var params = {};
      const resp = await context.dispatch("getRequest", {
        path: `books/${id}`,
        bodyParams: params
      });
      context.commit("setBook", resp.data);
    },
}

