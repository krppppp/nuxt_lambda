<template>
  <div>
    <div v-for="pass in passes" :key="`pass-${pass.id}`" class="ticket-card">
      <div class="title">{{ pass.name }}</div>
      <div class="description" v-html="pass.comment"></div>
    </div>
    <div v-for="sheet in sheets" :key="`sheet-${sheet.id}`" class="ticket-card">
      <div class="title">{{ sheet.name }}</div>
      <div class="description" v-html="sheet.comment"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    passes: Array,
    sheets: Array
  }
};
</script>

<style lang="scss" scoped>
dd {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
