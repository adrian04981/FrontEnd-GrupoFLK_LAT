<template>
  <button class="custom-button" @click="onClick">
    <slot></slot>
    <span class="button__icon" v-if="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="svg">
        <slot name="icon"></slot>
      </svg>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
.custom-button {
  position: relative;
  width: 150px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #34974d;
  background-color: #3aa856;
  transition: all 0.3s;
  border-radius: 0.5em;
  color: white;
  font-weight: 600;
  box-shadow: 4px 8px 10px -3px rgba(0, 0, 0, 0.356);
}

.custom-button:hover {
  background: #34974d;
}

.custom-button:active {
  background-color: #2e8644;
  border: 1px solid #2e8644;
}

.custom-button .button__icon {
  margin-left: 10px;
}

.svg {
  stroke: white;
}
</style>