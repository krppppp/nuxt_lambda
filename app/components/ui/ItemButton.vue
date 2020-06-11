<template>
  <button
    modifier="large--quiet"
    ripple="true"
    v-bind:class="['btn', actionType]"
    v-bind:disabled="isDisabled"
    @click="handleClick"
  >
    <i v-if="icon" v-bind:class="icon"></i> {{ label }}
    <img v-if="imgSrc" :src="imgSrc" alt="" />
  </button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    icon: String,
    isDisabled: {
      type: Boolean,
      default: false
    },
    imgSrc: String,
    actionType: {
      validator(value) {
        return (
          [
            "btn-primary",
            "submit",
            "button-negative",
            "button-cancel",
            "btn-refund",
            "disabled"
          ].indexOf(value) !== -1
        );
      },
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit("clicked");
    }
  }
};
</script>

<style lang="scss" scoped></style>
