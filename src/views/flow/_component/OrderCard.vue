<template>
  <div>
    <div class="card">
      <div class="title">
        <div class="text">{{ text }}</div>
        <div class="info">
          {{ info }}
        </div>
      </div>
      <Tag v-loading="loadingTag" :tag-list="$attrs['tag-list']" :tag-data="$attrs['tag-data']" />
    </div>
  </div>
</template>

<script>
import Tag from './Tag'
export default {
  components: {
    Tag
  },
  props: {
    loading: {
      type: Boolean, default() {}
    },
    text: {
      type: [String, Object], default() {}
    },
    info: {
      type: [String, Object], default() {}
    }
  },
  data() {
    return {
      loadingTag: this.loading
    }
  },
  watch: {
    loading(v) {
      this.loadingTag = v
    }
  },
  mounted() {
    window.oc = this
  },

  methods: {
  }

}
</script>

<style lang="scss" scoped>
.card {
  padding: 30px;
  border: 3px dashed #ebebeb;
  .title {
    margin-bottom: 30px;
    .text {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .info {
      color: #999;
    }
  }
}
</style>
