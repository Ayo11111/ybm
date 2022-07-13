<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-18 12:08:19
 * @LastEditors: HJ
 * @LastEditTime: 2021-04-22 15:51:12
-->
<template>
  <div>
    <el-form inline label-width="7em">
      <el-form-item label="参考范围">
        <div class="flex">
          <span style="flex: none">以店铺为中心半径</span>
          <el-input
            v-model="radius"
            style="width: 4em"
            placeholder="请输入数字"
          />
          <span>千米</span>
          <el-button @click="changeCircleRadius">修改参考范围</el-button>
        </div>
      </el-form-item>
      <el-form-item label="外卖起送价">
        <div class="flex">
          <el-input-number
            v-model="inputPrice"
            :controls="false"
            :min="0"
            placeholder="请输入数字"
          />
          <span class="ml-12">元</span>
        </div>
      </el-form-item>
    </el-form>
    <div>
      <g-map ref="gdMap" @load-end="mapLoadEnd" />
    </div>
  </div>
</template>

<script>
import GMap from '@/components/Gmap'
import { polygonEvent } from './_utils'
export default {
  name: 'DeliveryArea',
  components: {
    GMap
  },
  props: {
    center: {
      type: [Array, Object, String],
      default: null
    },
    price: {
      type: [Number, String],
      default: 0
    },
    path: {
      type: [Array, Object, String],
      default: () => null
    },
    polygonPath: {
      type: String,
      default: null
    },
    passProp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radius: 1,
      inputPrice: this.price,
      polyPath: null,
      valueLoadCount: 0,
      isMapLoadEnd: false,
      isValueEnd: false,
      isMounted: false
    }
  },
  computed: {
    // 确定是否全部内容都加载好了
    allLoadEnd() {
      return this.isMounted && this.isMapLoadEnd
    }
  },
  watch: {
    inputPrice(v) {
      this.$emit('update:price', v)
    },
    price(v) {
      this.inputPrice = v
    },
    center: {
      handler() {
        !this.valueInitEnd && this.initValue()
      },
      immediate: true,
      deep: true
    },
    polygonPath: {
      handler(polyPath) {
        if (!polyPath) return
        const strln = polyPath.length
        if (polyPath.substring(strln - 1) === ';') {
          polyPath = polyPath.slice(0, -1)
        }
        polyPath = polyPath.split(';').map(i => i.split(','))
        const ln = polyPath.length - 1
        if (!polyPath[ln]) polyPath.pop()

        this.polyPath = polyPath
        this.$nextTick(() => {
          this.valueInitEnd ? this.updatePolygon(polyPath) : this.initValue()
        })
      },
      immediate: true,
      deep: true
    },
    allLoadEnd(v) {
      if (v) {
        this.initMap()
      }
    }
  },
  created() {
    this.prevCenter = []
  },
  mounted() {
    window.app = this
    // 这里需要给一个参数表明vue加载完成
    this.isMounted = true
  },
  methods: {
    mapLoadEnd(v) {
      const { success } = v
      if (success) {
        const { gdMap } = this.$refs
        this.gdMap = gdMap
        this.isMapLoadEnd = true
      }
    },
    // 初始化地图覆盖物
    initMap() {
      const { gdMap } = this
      const { initPolygonEditor, initCircle, getCenter } = gdMap

      // 初始化可编辑覆盖物
      const { polyEditor: polyEdit, polygon } = initPolygonEditor()
      this.polyEdit = polyEdit
      this.polygon = polygon

      // 初始化圆形覆盖物
      const center = getCenter()
      this.circle = initCircle({ center })
      // this.initPath(this.prevCenter)
      // 标明地图初始化成功
      this.mapInitEnd = true
      // 监听变化事件
      this.$nextTick(() => {
        !this.valueInitEnd && this.initValue()
        polyEdit.open()
        polyEdit.on('adjust', ev => {
          this.updatePath(ev)
        })
        polyEdit.on('addnode', ev => {
          this.updatePath(ev)
        })
      })
    },
    // 初始化中心点和可编辑覆盖物范围
    initValue() {
      if (!this.center || !this.polyPath || !this.mapInitEnd) return
      this.setCenter(this.center)
      this.updatePolygon(this.polyPath)
      this.prevCenter = this.center
      this.valueInitEnd = true
    },
    // 点被移动的时候更新path
    updatePath(ev) {
      const resPath = polygonEvent(ev)
      this.polyPath = resPath
      const returnPath = resPath.map(i => i.join(',')).join(';')
      this.$emit('update:path', returnPath)
    },
    // 计算中心位置切换的偏差
    offsetPath(center) {
      const lng = +center[0] || 0
      const lat = +center[1] || 0
      const prevLng = +this.prevCenter[0] || 0
      const prevLat = +this.prevCenter[1] || 0
      const offsetLng = prevLng - lng
      const offsetLat = prevLat - lat
      let resPath = null
      const { polyPath } = this
      if (Array.isArray(polyPath)) {
        resPath = polyPath.map(i => {
          return [+i[0] - offsetLng, +i[1] - offsetLat]
        })
      }
      return resPath
    },
    // 初始化path
    initPath(location) {
      const { centerPolygon } = this.gdMap
      const path = centerPolygon(location)
      this.$emit('update:path', path.join(';'))
      return path
    },
    // 设置地图中心
    setCenter(location) {
      if (location) {
        const { setCenter } = this.gdMap
        setCenter(location)
        this.circle.setCenter(location)
      }
    },
    updateCenter(location) {
      this.setCenter(location)
      // 计算中心位置
      const path = this.polyPath
        ? this.offsetPath(location)
        : this.initPath(location)
      this.polyPath = path
      this.$nextTick(() => {
        this.updatePolygon(path)
        this.prevCenter = location
      })
    },
    // 更新编辑覆盖物
    updatePolygon(path) {
      this.polygon.setPath(path)
      this.polyEdit.clearAdsorbPolygons()
      this.polyEdit.setTarget(this.polygon)
      this.polyEdit.open()
      this.$emit('update:path', path.map(i => i.join(',')).join(';'))
    },
    // 修改范围的大小
    changeCircleRadius() {
      const { circle } = this
      circle.setRadius(this.radius * 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
