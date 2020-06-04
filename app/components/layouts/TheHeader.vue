<template>
  <div :class="headerClasses">
    <div class="left">
      <a class="back-button" @click="backButtonClicked" />
    </div>

    <div class="center" style="overflow: hidden; height: 1rem;">
      <span class="title">{{ headerTitle }}</span>
    </div>

    <div class="right">
      <div class="space" />
    </div>
  </div>
</template>

<script>
/*
ヘッダーコンポーネント
[props]
  * headerTitle: ヘッダーに表示するタイトル(未指定時は非表示)
  * transparentThreshold: 透過閾値。ヘッダー下部がこの高さになると実体化する(未指定の場合は透過させない)
  * clickBackButtonEvent: 戻るボタン押下時に呼ばれる関数(未指定時は一つ前のページに戻る)
[実装例]
<TheHeader
  headerTitle="タイトル"
  :transparentThreshold="100"
  :clickBackButtonEvent="func" => funcは親コンポーネントのmethodsに定義
  />
*/
export default {
  name: "theHeader",
  props: {
    headerTitle: {
      type: String,
      required: false
    },
    transparentThreshold: {
      type: Number,
      required: false,
      defult: null
    },
    initialTranparent: {
      type: Boolean,
      rquired: false,
      default: false
    },
    clickBackButtonEvent: {
      type: Function,
      required: false,
      default: null
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  data() {
    return {
      scrollY: 0
    };
  },
  computed: {
    headerClasses() {
      if (
        !this.transparentThreshold ||
        (!this.initialTranparent && this.scrollY <= 0)
      ) {
        return "header";
      }
      return [
        "header",
        {
          transparent: this.transparentThreshold - 50 > this.scrollY
        }
      ];
    }
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY;
    },
    backButtonClicked() {
      if (this.clickBackButtonEvent) {
        this.clickBackButtonEvent();
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  z-index: 99;
  padding: 5px 11px;
  height: var(--navigation-height);
  background-color: var(--bg-color);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: #fff;
  transition: all 0.3s;

  .left {
    .back-button {
      display: block;
      width: 28px;
      height: 28px;
      background-image: url("~@/assets/img//arrow/svg/arrow-left-blue-14px.svg");
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }
  }

  .center {
    .title {
      font: inherit;
      font-size: 1rem;
      font-weight: bold;
    }
  }

  .right {
    .space {
      width: 28px;
      height: 28px;
    }
  }

  &.transparent {
    background-color: rgba(0, 0, 0, 0%);
    .left {
      .back-button {
        background-image: url("~@/assets/img//arrow/svg/arrow-left-white-14px.svg");
      }
    }

    .center {
      .title {
        color: #fff;
      }
    }
  }
}
</style>
