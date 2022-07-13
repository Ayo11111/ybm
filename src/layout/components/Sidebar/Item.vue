<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-23 17:30:30
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-27 12:03:10
-->
<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    }
  },
  computed: {
    count() {
      return this.$store.state.order.newCount
    }
  },
  render(h, context) {
    const { icon, title, count } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      if (title === '待处理订单' && count > 0) {
        vnodes.push(
          <span slot='title'>
            {title}
            <a-badge
              style='margin-left: 8px; margin-top: -3px'
              count={count}></a-badge>
          </span>
        )
      } else {
        vnodes.push(<span slot='title'>{title}</span>)
      }
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
