<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-28 15:47:32
 * @LastEditors: HJ
 * @LastEditTime: 2021-04-22 13:48:08
-->
<template>
  <div id="gd-map" ref="gdMap" class="container gd-map" />
</template>

<script>
import AMapJS from 'amap-js'
export default {
  name: 'GMap',
  props: {
    city: {
      type: String,
      default: '全国'
    },
    cen: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      GDMap: null,
      AMap: null,
      keyWord: ''
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      const { VUE_APP_MAP_KEY } = process.env
      const plugins = [
        'AMap.OverView',
        'AMap.MouseTool',
        'AMap.PolyEditor',
        'AMap.RectangleEditor',
        'AMap.PlaceSearch',
        'AMap.DistrictLayer',
        'AMap.CustomLayer',
        'AMap.Geocoder',
        'AMap.AutoComplete'
      ]
      // 创建AMapJSAPI Loader
      const loader = new AMapJS.AMapLoader({
        key: VUE_APP_MAP_KEY,
        version: '2.0',
        plugins
      })

      // 调用 load 方法完成加载并调用执行回调。
      loader
        .load()
        .then(({ AMap }) => {
          // 请求成功
          const { Map } = AMap
          const { gdMap } = this.$refs
          const GDMap = new Map(gdMap, {
            zoom: 15,
            resizeEnable: true,
            zoomToAccuracy: true,
            animateEnable: false
          })
          GDMap.on('complete', () => {
            this.GDMap = GDMap
            this.AMap = AMap
            if (this.cen) {
              GDMap.setCenter(this.cen)
            }
            this.initAutoComplete()
            this.initPlaceSearch()
            this.initMarker()
            this.$emit('load-end', { success: true, GDMap, AMap })
          })
        })
        .catch(e => {
          // 请求失败
          this.$emit('load-end', { success: false })
        })
    },
    initAutoComplete() {
      const { AMap, city } = this
      if (!AMap) return
      const { AutoComplete } = AMap
      this.autoComplete = new AutoComplete({
        city,
        citylimit: true
      })
    },
    initPlaceSearch() {
      const { AMap } = this
      if (!AMap) return
      const { PlaceSearch } = AMap
      this.placeSearch = new PlaceSearch()
    },
    initGeocoder() {
      if (!this.AMap) return
      const { city, AMap } = this
      const { Geocoder } = AMap
      const geocoder = new Geocoder({
        city
      })
      this.geocoder = geocoder
    },
    initMarker() {
      const { AMap, GDMap } = this
      if (!AMap) return
      const { Marker } = AMap
      const position = GDMap.getCenter()
      this.marker = new Marker({ position })
      GDMap.add(this.marker)
    },
    // 计算中心path
    centerPolygon(center) {
      let { lng, lat } = {}
      if (Array.isArray(center)) {
        lng = center[0]
        lat = center[1]
      } else {
        lng = center.lng
        lat = center.lat
      }
      const baseOffset = 0.01
      const path = [
        [lng - baseOffset, lat + baseOffset],
        [lng + baseOffset, lat + baseOffset],
        [lng + baseOffset, lat - baseOffset],
        [lng - baseOffset, lat - baseOffset]
      ]
      return path
    },
    // 初始化覆盖范围
    initPolygon(option) {
      const { AMap } = this
      if (!AMap) return
      const center = this.getCenter()
      const path = this.centerPolygon(center)
      const opt = {
        path,
        strokeColor: 'green',
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 50,
        bubble: true
      }
      const { Polygon } = AMap
      const polygon = new Polygon(Object.assign({}, opt, option))
      this.GDMap.add([polygon])
      return polygon
    },
    initPolygonEditor(option) {
      const { AMap, GDMap } = this
      if (!AMap) return
      const polygon = this.initPolygon(option)
      const { PolyEditor } = AMap
      return { polyEditor: new PolyEditor(GDMap, polygon), polygon }
    },
    initCircle(option) {
      const { AMap } = this
      if (!AMap) return
      const opt = {
        radius: 1000, // 圆半径
        fillColor: 'red', // 圆形填充颜色
        strokeColor: '#fff', // 描边颜色
        strokeWeight: 2 // 描边宽度
      }
      const { Circle } = AMap
      const circle = new Circle(Object.assign({}, opt, option))
      this.GDMap.add(circle)
      return circle
    },
    setAutoCompleteCity(city) {
      this.autoComplete.setCity(city || '全国')
    },
    getCenter() {
      return this.GDMap.getCenter()
    },
    setCenter(location) {
      this.marker.setPosition(location)
      this.GDMap.setCenter(location)
    },
    clickMap() {}
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  height: 70vh;
  min-height: auto;
  width: 100%;
  margin: 0;
}
</style>
