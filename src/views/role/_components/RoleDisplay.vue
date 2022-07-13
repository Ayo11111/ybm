<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-14 02:56:36
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-14 15:15:11
-->
<template>
  <div class="routes-box">
    <div class="title">角色权限</div>
    <el-scrollbar style="height: 575px">
      <template v-for="i in routes">
        <div v-show="!i.hidden" :key="i.id">
          <div class="routes-title">
            <el-checkbox @change="handlerChecked(null, i, $event)">
              <span style="font-size: 16px;font-weight: 600;">
                {{ i.meta.title }}
              </span>
            </el-checkbox>
          </div>
          <template v-for="j in i.children">
            <div v-show="!j.hidden" :key="j.id" class="routes-item">
              <el-checkbox :key="j.id" @change="handlerChecked(i, j, $event)">
                <span>
                  {{ j.meta.title }}
                </span>
              </el-checkbox>
            </div>
          </template>
          <a-divider />
        </div>
      </template>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'RoleDisplay',
  props: {
    routes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkedNodes: new Map(),
      halfCheckedNodes: new Map(),
      children: {}
    }
  },
  watch: {
    routes: {
      handler(v) {
        console.log('debug', v)
        if (v) {
          for (let i = 0; i < v.length; i++) {
            this.children[v[i].id] = []
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    /**
     * 处理选中的事件
     * flag {String} true 选中 false 不选中
     */
    handlerChecked(parent, children, flag) {
      const { checkedNodes } = this
      const { id: cId } = children
      if (parent) {
        const { id } = parent
        // 已经存储了
        const temp = checkedNodes.get(id)
        const tempParent = temp || parent
        const node = temp || new Map()
        const { childrenMap } = tempParent
        const cNode = childrenMap || new Map()
        tempParent.childrenMap = cNode.set(cId, children)
        node.set(id, tempParent)
        this.checkedNodes = node
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.routes-box {
  height: 100%;
  flex: 1;
  .title {
    font-size: 18px;
    font-weight: 600;
    padding: 12px;
  }
  .routes-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 12px 12px;
  }
  .routes-item {
    margin: 0 12px;
    display: inline;
  }
}
</style>
