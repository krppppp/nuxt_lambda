export default {
  // return用の変数
  seatInformation: {},
  seatCalTotalPrice: 0,
  seatArrangeIsDone: false,

  methods: {
    // 引数に入れたBookGroupから席数計算
    seatArrange(bookGroup, masterBook, boolean) {
      // 初期化しないと、戻るボタンでこの関数を２回踏んだりすると表示が狂う
      this.seatInformation = {};
      // eslint-disable-next-line no-unused-vars
      var that = this;
      // BookGroupに紐づいたBookの数Loopし、振り分けを行なってカウントアップ
      this.sort(bookGroup.books).forEach(book => {
        this.sort(masterBook.master_prices).forEach((price, index) => {
          if (price.division === book.price.division) {
            index++;
            // 新しいdivisionの時に新しいdivision用の連想配列を作成
            if (!eval("that.seatInformation.division" + index)) {
              eval("that.seatInformation.division" + index + "= {}");
              eval(
                "that.seatInformation.division" +
                  index +
                  ".name= '" +
                  price.name +
                  "'"
              );
              eval(
                "that.seatInformation.division" +
                  index +
                  ".dataName= '" +
                  price.division +
                  "'"
              );
              eval(
                "that.seatInformation.division" +
                  index +
                  ".price='" +
                  price.price +
                  "'"
              );
              eval("that.seatInformation.division" + index + ".count = 0");
            }
            eval("that.seatInformation.division" + index + ".count ++");
          }
        });
      });
      boolean ? this.calTotal(bookGroup) : this.isDone();
    },
    calTotal(bookGroup) {
      var total = 0;
      this.sort(bookGroup.books).forEach(book => {
        total = total + book.price.price;
      });
      this.seatCalTotalPrice = total;
      this.isDone();
    },
    isDone() {
      this.seatArrangeIsDone = true;
    }
  }
};
