<script>
export default {
  methods: {
    addClassToBody(addClass) {
      if (document.body.classList.length > 0) {
        document.body.classList = "";
      }
      document.body.classList.add(addClass);
    },
    // v-for内でvalue に当て込むため必要
    optionValue(n) {
      return n;
    },
    // 前の画面に戻る
    backToPreviousPage() {
      this.$router.go(-1);
    },
    // 画像URLをCSSで背景に設定する(APIから取得した画像)
    backgroundImageFromApi(url) {
      return "background-image: url(" + url + ")";
    },
    // 並び順をidで降順並び替え
    sort(element) {
      if (element) {
        return element.slice().sort(function(a, b) {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        });
      }
    },
    // ファーマット化した時間表示
    displayDatetime(time) {
      return this.$moment(new Date(`${time}`)).format("YYYY.MM.DD HH:mm:ss");
    },
    displayDate(time) {
      return this.$moment(new Date(`${time}`)).format("YYYY.MM.DD");
    },
    displayDateMinus1D(time) {
      return this.$moment(new Date(`${time}`))
        .subtract(1, "d")
        .format("YYYY.MM.DD");
    }
  }
};
</script>
