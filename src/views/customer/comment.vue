<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane v-loading="TabLoad" label="评价列表" name="first">
        <div class="condition">
          <div class="radio">
            <span>是否回复</span>
            <el-radio-group v-model="reply" size="medium" @change="setReply">
              <el-radio-button label="全部" />
              <el-radio-button label="未回复" />
              <el-radio-button label="已回复" />
            </el-radio-group>
          </div>
          <div class="radio">
            <span>满意程度</span>
            <el-radio-group v-model="score" size="medium" @change="setScore">
              <el-radio-button label="全部" />
              <el-radio-button label="好评(4-5)" />
              <el-radio-button label="中评(3)" />
              <el-radio-button label="差评(1-2)" />
            </el-radio-group>
          </div>
          <div class="radio">
            <span>有无内容</span>
            <el-radio-group
              v-model="content"
              size="medium"
              @change="setContent"
            >
              <el-radio-button label="全部" />
              <el-radio-button label="有内容" />
              <el-radio-button label="无内容" />
            </el-radio-group>
            <el-input
              v-model="Json['contentKeyword']"
              placeholder="关键词搜索"
              style="width: 200px; margin-left: 20px"
              @blur="search"
            >
              <i
                slot="suffix"
                class="el-icon-search el-input__icon"
                style="cursor: pointer"
                @click="search"
              />
            </el-input>
          </div>
          <div class="radio">
            <span>评价时间</span>
            <el-radio-group v-model="time" size="medium" @change="setDate">
              <el-radio-button label="近一月" />
              <el-radio-button label="近三月" />
              <el-radio-button label="近六月" />
            </el-radio-group>
            <el-date-picker
              v-model="day"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 360px; margin-left: 20px"
              @change="date"
            />
          </div>
          <b>共{{ total }}条评价</b>
          <div class="comment">
            <div v-for="item in list" :key="item.id" class="item">
              <div class="top" style="justify-content: space-between">
                <div style="display: flex; align-items: center">
                  <img
                    v-if="item.memberAvatar !== null"
                    :src="item.memberAvatar"
                  />
                  <img v-else src="@/assets/default.jpg" />
                  <div class="comInfo">
                    <div>
                      <span style="margin-right: 6px">{{
                        item.memberNickName
                      }}</span>
                      <span>评分{{ item.merchantAvgScore }}</span>
                    </div>
                    <div class="numBox">
                      <div class="num">
                        <span>口味</span>
                        <el-rate v-model="item.tasteScore" disabled />
                      </div>
                      <div class="num">
                        <span>包装</span>
                        <el-rate v-model="item.packageScore" disabled />
                      </div>
                      <div class="num">
                        <span>配送</span>
                        <el-rate v-model="item.deliveryScore" disabled />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="place">
                  <span>{{ item.storeName }}</span>
                  <span>{{ item.commentTime }}</span>
                </div>
              </div>
              <div class="body" style="margin-bottom: 30px">
                <b v-if="item.content === null">该用户没有填写评价内容</b>
                <b v-else>{{ item.content }}</b>
                <div v-if="item.images">
                  <el-image
                    v-for="(i, j) in item.images.split(',')"
                    :key="j"
                    style="
                      width: 100px;
                      height: 100px;
                      margin: 10px 10px 10px 0;
                    "
                    :src="i"
                    :preview-src-list="item.images.split(',')"
                  />
                </div>

                <div style="margin: 10px 0 10px 0">
                  订单详情：{{ item.foodDetail }}
                </div>
                <div
                  v-if="item.foodUp !== null || item.foodDown !== null"
                  class="upDown"
                >
                  <div
                    v-if="item.foodUp !== null && item.foodUp !== ''"
                    style="margin-right: 20px; display: flex"
                  >
                    <span class="block">赞</span>
                    <span>{{ item.foodUp }}</span>
                  </div>
                  <div
                    v-if="item.foodDown !== null && item.foodDown !== ''"
                    style="display: flex"
                  >
                    <span class="block">踩</span>
                    <span>{{ item.foodDown }}</span>
                  </div>
                </div>
                <el-button
                  v-if="item.merchantReply === null"
                  type="primary"
                  icon="el-icon-chat-line-round"
                  style="width: 90px; margin-top: 6px"
                  :loading="btnLoad"
                  @click="replyBtn(item.id, item.merchantReply)"
                  >回复</el-button
                >
                <el-button
                  v-else
                  type="primary"
                  icon="el-icon-chat-line-round"
                  style="width: 115px; margin-top: 6px"
                  :loading="btnLoad"
                  @click="replyBtn(item.id, item.merchantReply)"
                  >修改回复</el-button
                >
                <div
                  v-show="!showJson[item.id]"
                  v-if="item.merchantReply !== null"
                  class="answerText"
                >
                  <span style="color: #999999"
                    >商家回复 {{ item.replyTime }}
                  </span>
                  <p style="margin-top: 4px">{{ item.merchantReply }}</p>
                </div>
                <div v-show="showJson[item.id]" class="answer">
                  <el-input
                    v-model="value"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    style="margin-bottom: 12px"
                    @keyup.enter.native="onSubmit(item)"
                  />
                  <div>
                    <el-button
                      type="primary"
                      :loading="btnLoad"
                      @click="Comment(item)"
                      >回复</el-button
                    >
                    <el-button @click="cancel(item.id)">取消</el-button>
                  </div>
                </div>
              </div>
              <el-divider />
            </div>
          </div>
          <a-empty v-show="list.length === 0" />
        </div>
        <Pagination :total="total" @pagination="updataPageList" />
      </el-tab-pane>
      <el-tab-pane label="评价统计" name="second">
        <template v-if="Object.keys(branch).length > 0">
          <div v-loading="loading" class="info">
            <div class="left">
              <span>店铺评分(近30天)</span>
              <div class="rate">
                <span>{{ branch.merchantAvgScore }}</span>
                <el-rate v-model="branch.merchantAvgScore" disabled />
              </div>
            </div>
            <div class="right">
              <div class="single" style="margin-left: 80px">
                <span>口味(近30天)</span>
                <span class="num">{{ branch.tasteScore }}</span>
              </div>
              <div class="single">
                <span>包装(近30天)</span>
                <span class="num">{{ branch.packageScore }}</span>
              </div>
              <div class="single">
                <span>配送评分(近30天)</span>
                <span class="num">{{ branch.deliveryScore }}</span>
              </div>
            </div>
          </div>
          <a-divider dashed />
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <b>店铺近30天评分</b>
            <el-button
              type="primary"
              :loading="downLoad"
              @click="getDownloadComment"
            >
              报表下载
            </el-button>
          </div>
          <Table
            style="margin-top: 25px"
            :data="storBranch"
            :loading.sync="loading"
          />
          <Pagination :total="branchToal" @pagination="getStorecomment" />
        </template>
        <a-empty v-else />
      </el-tab-pane>
      <el-tab-pane label="顾客分析" name="analysis" lazy>
        <analysis />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  fhGetCommentList,
  fhPutComment,
  fhGetMerchantComment,
  fhGetStorecomment,
  fhGetDownloadComment
} from '@/api/customer'
import Table from './_components/table'
import Pagination from '@/components/Pagination'
import analysis from './analysis.vue'
import { downloadFile } from '@/utils/download'
export default {
  components: {
    Table,
    Pagination,
    analysis
  },
  data() {
    return {
      activeName: 'first',
      reply: '全部',
      score: '全部',
      content: '全部',
      time: '近一月',
      day: null,
      list: [],
      total: 0,
      showJson: {},
      Json: {
        replyOption: null,
        scoreOption: null,
        contentOption: null,
        contentKeyword: null,
        startTime: this.$moment(new Date())
          .subtract(1, 'months')
          .format('YYYY-MM-DD'),
        endTime: this.$moment(new Date()).format('YYYY-MM-DD'),
        storeId: null,
        pageSize: null,
        pageNumber: null
      },
      options: [],
      value: '',
      disabled: false,
      btnLoad: false,
      branch: {},
      storBranch: [],
      branchToal: 0,
      loading: false,
      downLoad: false,
      TabLoad: false
    }
  },
  created() {
    const { params } = this.$route
    if (params) {
      this.Json['replyOption'] = 2
      this.Json['scoreOption'] = 3
    }
  },
  computed: {
    ...mapGetters(['storeId'])
  },
  watch: {
    storeId: {
      handler(id) {
        if (id) {
          this.Json.storeId = id
          this.$nextTick(() => {
            this.getCommentList(this.Json)
            this.getMerchantComment()
            this.getStorecomment()
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    hide() {
      this.show = true
    },
    editReply() {},
    async getCommentList(params) {
      this.TabLoad = true
      try {
        const { results, count } = await fhGetCommentList(params)
        results.forEach((item, index) => {
          this.showJson[item.id] = false
        })
        this.Json['pageSize'] = null
        this.Json['pageNumber'] = null
        this.list = results
        this.total = count
        this.disabled = false
      } catch (err) {
        console.log(err)
      }
      this.TabLoad = false
    },
    async putComment(orderId, params) {
      this.btnLoad = true
      try {
        await fhPutComment(orderId, params)
        this.$message({
          message: '回复成功',
          type: 'success'
        })
        this.value = ''
        this.$forceUpdate()
        this.getCommentList(this.Json)
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    async getMerchantComment() {
      try {
        const { results } = await fhGetMerchantComment()
        this.branch = results || {}
      } catch (err) {
        console.log(err)
      }
    },
    async getStorecomment(params) {
      this.loading = true
      try {
        const { results, count } = await fhGetStorecomment(params)
        this.storBranch = results || []
        this.branchToal = count
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async getDownloadComment() {
      this.downLoad = true
      try {
        const results = await fhGetDownloadComment()
        var uint8_msg = new Uint8Array(results)
        var decodedString = String.fromCharCode.apply(null, uint8_msg)
        if (decodedString.indexOf('success') !== -1) {
          var decoded = decodeURIComponent(escape(decodedString))
          var data = JSON.parse(decoded)
          this.$message.error(data.message)
        } else {
          downloadFile(results, '店铺平均分')
          this.$message.success('报表下载成功')
        }
      } catch (err) {
        console.log(err)
      }
      this.downLoad = false
    },
    replyBtn(id, merchantReply) {
      for (const i in this.showJson) {
        this.showJson[i] = false
      }
      this.value = merchantReply
      this.showJson[id] = true
      this.$forceUpdate()
    },
    cancel(id) {
      this.showJson[id] = false
      this.value = null
      this.$forceUpdate()
    },
    setReply(value) {
      switch (value) {
        case '全部':
          this.Json['replyOption'] = null
          break
        case '未回复':
          this.Json['replyOption'] = 2
          break
        case '已回复':
          this.Json['replyOption'] = 1
          break
      }
      this.disabled = true
      this.getCommentList(this.Json)
    },
    setScore(value) {
      switch (value) {
        case '全部':
          this.Json['scoreOption'] = null
          break
        case '好评(4-5)':
          this.Json['scoreOption'] = 1
          break
        case '中评(3)':
          this.Json['scoreOption'] = 2
          break
        case '差评(1-2)':
          this.Json['scoreOption'] = 3
          break
      }
      this.disabled = true
      this.getCommentList(this.Json)
    },
    setContent(value) {
      switch (value) {
        case '全部':
          this.Json['contentOption'] = null
          break
        case '有内容':
          this.Json['contentOption'] = 1
          break
        case '无内容':
          this.Json['contentOption'] = 2
          break
      }
      this.disabled = true
      this.getCommentList(this.Json)
    },
    setDate(value) {
      switch (value) {
        case '近一月':
          this.Json['startTime'] = this.$moment(new Date())
            .subtract(1, 'months')
            .format('YYYY-MM-DD')
          this.Json['endTime'] = this.$moment(new Date()).format('YYYY-MM-DD')
          break
        case '近三月':
          this.Json['startTime'] = this.$moment(new Date())
            .subtract(3, 'months')
            .format('YYYY-MM-DD')
          this.Json['endTime'] = this.$moment(new Date()).format('YYYY-MM-DD')
          break
        case '近六月':
          this.Json['startTime'] = this.$moment(new Date())
            .subtract(6, 'months')
            .format('YYYY-MM-DD')
          this.Json['endTime'] = this.$moment(new Date()).format('YYYY-MM-DD')
          break
      }
      this.disabled = true
      this.getCommentList(this.Json)
    },
    date(value) {
      if (value !== null) {
        this.Json['startTime'] = value[0]
        this.Json['endTime'] = value[1]
        this.getCommentList(this.Json)
      } else {
        switch (this.time) {
          case '近一月':
            this.Json['startTime'] = this.$moment(new Date())
              .subtract(1, 'months')
              .format('YYYY-MM-DD')
            this.Json['endTime'] = this.$moment(new Date()).format('YYYY-MM-DD')
            break
          case '近三月':
            this.Json['startTime'] = this.$moment(new Date())
              .subtract(3, 'months')
              .format('YYYY-MM-DD')
            this.Json['endTime'] = this.$moment(new Date()).format('YYYY-MM-DD')
            break
          case '近六月':
            this.Json['startTime'] = this.$moment(new Date())
              .subtract(6, 'months')
              .format('YYYY-MM-DD')
            this.Json['endTime'] = this.$moment(new Date()).format('YYYY-MM-DD')
            break
        }
        this.disabled = true
        this.getCommentList(this.Json)
      }
    },
    search() {
      this.disabled = true
      this.getCommentList(this.Json)
    },
    setStoreId(value) {
      this.disabled = true
      this.getCommentList(this.Json)
    },
    Comment(data) {
      if (this.value !== '' && this.value !== null) {
        if (this.value.length <= 200) {
          this.putComment(data.orderId, {
            content: this.value
          })
        } else {
          this.$message.error('不能超过200字')
        }
      } else {
        this.$message.error('内容不能为空')
      }
    },
    updataPageList(params) {
      params = Object.assign(this.Json, params)
      this.getCommentList(params)
    },
    onSubmit(item) {
      this.value = this.value.replace(/\s*/g, '')
      this.Comment(item)
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.reply = to.params.reply || '全部'
      vm.Json.replyOption = null
      vm.Json.scoreOption = null
      vm.score = to.params.score || '全部'
    })
  }
}
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  .left {
    border-right: 1px solid #cccccc;
    padding: 5px 3px 5px 0;
  }
  .right {
    flex: 1;
    padding: 5px 0;
    display: flex;
    .single {
      display: flex;
      flex-flow: column;
      margin: 0 40px;
      .num {
        margin-top: 4px;
        color: #333333;
        font-size: 28px;
      }
    }
  }
}
.rate {
  display: flex;
  align-items: center;
  margin-top: 4px;
  color: #333333;
  span {
    margin-right: 5px;
    font-size: 28px;
  }
}
.radio {
  margin: 25px 0;
  display: flex;
  align-items: center;
  span {
    margin-right: 25px;
  }
}
.comment {
  margin-top: 30px;
  .item {
  }
}
.top {
  display: flex;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .comInfo {
    display: flex;
    flex-flow: column;
    .numBox {
      display: flex;
      margin-top: 5px;
      .num {
        display: flex;
        margin-right: 20px;
        span {
          margin-right: 8px;
        }
      }
    }
  }
  .place {
    display: flex;
    flex-flow: column;
    align-items: flex-end;
  }
}
.body {
  margin-left: 65px;
  margin-top: 12px;
  b {
    font-size: 16px;
  }
  .com {
    background: #52acff;
    padding: 10px 20px;
    border-radius: 36px;
    color: #ffffff;
    margin-right: 15px;
  }
  .upDown {
    display: flex;
    margin-bottom: 10px;
    .block {
      display: block;
      width: 22px;
      height: 22px;
      line-height: 22px;
      background: #999999;
      font-size: 12px;
      color: #ffffff;
      border-radius: 50%;
      text-align: center;
      margin-right: 4px;
    }
  }
  .answer {
    width: 100%;
    min-height: 182px;
    background: #f7f8fa;
    padding: 20px 20px;
    margin-top: 20px;
    display: flex;
    flex-flow: column;
    align-items: flex-end;
  }
  .hide {
    display: inline;
  }
  .answerText {
    width: 100%;
    min-height: 83px;
    background: #f7f8fa;
    padding: 15px 20px;
    margin-top: 20px;
  }
}
::v-deep .el-icon-circle-close {
  color: #fff;
}
</style>
