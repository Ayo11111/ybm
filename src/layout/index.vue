<!--
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 09:49:47
 * @LastEditors: cjh
 * @LastEditTime: 2022-01-12 15:11:04
-->
<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <a-alert
          style="position: relative;z-index: 999999"
          v-if="showTips"
          type="warning"
          banner
          closable
          @close="close"
        >
          <div slot="message">
            新商家需要先进行支付进件，
            <router-link :to="{ path: '/pay/binary' }">
              <a-button style="padding: 0; height: auto" type="link">
                前往进件
              </a-button>
            </router-link>
          </div>
        </a-alert>
        <title-box />
      </div>
      <app-main />
      <div class="occupy"></div>
      <div class="app-footer">京ICP备16009305号-2</div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TitleBox } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { fhGetApplyments } from '@/api/finance'
import { getUserInfo } from '@/utils/auth'
import { getStoreId } from '@/utils/auth'
import { fhGetStoreRingsSetting } from '@/api/stores'
import { countField, audioSrc } from './audio'
import { getMerchantManagerType } from '@/utils/auth'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TitleBox
  },
  mixins: [ResizeMixin],
  data() {
    return {
      play: false,
      wait: [],
      merchantManagerType: ''
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    showTips() {
      return this.$store.state.binary.showTips
    },
    playCount() {
      return this.$store.state.audio.count
    }
  },
  created() {
    this.getManagerType()
    this.getStoreRingsSetting()
    this.storeId()
  },
  mounted() {
    this.userInfo()
  },
  methods: {
    async getManagerType() {
      try {
        const results = await getMerchantManagerType()
        this.merchantManagerType = results
      } catch (err) {
        console.log(err)
      }
    },
    async getStoreRingsSetting() {
      this.loading = true
      try {
        const { results } = await fhGetStoreRingsSetting()
        this.$store.commit('audio/setCount', results)
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async storeId() {
      try {
        const storeId = await getStoreId()
        this.getSubscribe(storeId)
      } catch (err) {
        console.log(err)
      }
    },
    // 接收websocket信息
    getSubscribe(storeId) {
      this.$goEasy.subscribe({
        channel: `ybm_store_${storeId}`,
        // eslint-disable-next-line space-before-function-paren
        onMessage: message => {
          const { content } = message
          const msg = JSON.parse(content)
          msg.forEach(i => {
            const { eventType, body } = i
            this.compoutedAngleThe(eventType, body)
            if (body === 1) {
              if (this.wait.indexOf(eventType) === -1 && audioSrc[eventType]) {
                this.wait.push(eventType)
              }
              if (!this.play) {
                this.play = true
                setTimeout(() => {
                  this.playAudio(eventType)
                }, 1000)
              }
            }
          })
        }
      })
    },
    compoutedAngleThe(id, body, setNum) {
      if (['retail', 'restaurant'].includes(this.merchantManagerType)) {
        switch (id) {
          case '2':
          case '1':
          case 2:
          case 1:
            this.$store.commit('order/setMenuCount', { id: 1, count: body })
            break
          case '8':
          case 8:
            this.$store.commit('order/setMenuCount', { id, count: body })
            break
        }
      } else {
        this.$store.commit('order/setMenuCount', { id, count: body })
      }
    },
    async userInfo() {
      try {
        const userInfo = await getUserInfo()
        const results = await this.$store.dispatch(
          'user/getUserInfo',
          userInfo.backUserId
        )
        const { router } = results
        let payStatus = false
        let settingRouter = router.filter(item => {
          return item.path === '/setting'
        })
        if (settingRouter.length > 0) {
          const { children } = settingRouter[0]
          let payRouter = children.filter(i => {
            return i.name === 'PayBinary'
          })
          if (payRouter.length > 0) payStatus = true
        }
        if (payStatus) {
          this.getApplyments()
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // 查询当前进件情况
    async getApplyments() {
      this.loading = true
      try {
        const { results } = await fhGetApplyments()
        this.$store.commit('binary/setShowTips', !results)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    close() {
      this.$store.commit('binary/setShowTips', false)
    },
    async playAudio(eventType) {
      this.play = true
      let count = this.playCount[countField[eventType]]
      let src = audioSrc[eventType]
      this.$audio.src = src
      if (Number(count) !== 0) {
        let num = 0
        await this.$audio.play()
        this.$audio.onended = () => {
          num += 1
          if (num < count) {
            this.$audio.play()
          } else {
            this.wait.splice(0, 1)
            if (this.wait.length > 0) {
              setTimeout(() => {
                this.playAudio(this.wait[0])
              }, 1000)
            } else {
              this.play = false
            }
          }
          // if (this.wait.length > 1) {
          //   this.wait.splice(0, 1)
          //   setTimeout(() => {
          //     this.playAudio(this.wait[0])
          //   }, 1000)
          //   this.play = false
          // } else {
          //   num += 1
          //   if (num < count) {
          //     this.$audio.play()
          //   } else {
          //     this.wait.splice(0, 1)
          //     if (this.wait.length > 0) {
          //       setTimeout(() => {
          //         this.playAudio(this.wait[0])
          //       }, 1000)
          //     } else {
          //       this.play = false
          //     }
          //   }
          // }
        }
      } else {
        this.play = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 998;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.main-container {
  background: #eee;
  position: relative;
}

.occupy {
  height: 20px;
}

.app-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  position: absolute;
  bottom: 10px;
  width: 100%;
}
</style>
