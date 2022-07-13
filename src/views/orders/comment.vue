<template>
  <div class="container">
    <div v-loading="mainLoad" class="condition">
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
        <el-radio-group v-model="content" size="medium" @change="setContent">
          <el-radio-button label="全部" />
          <el-radio-button label="有内容" />
          <el-radio-button label="无内容" />
        </el-radio-group>
        <el-input
          v-model="Json['contentKeyword']"
          placeholder="关键词搜索"
          suffix-icon="el-icon-search"
          style="width: 200px; margin-left: 20px;"
          @blur="search"
          @keyup.enter.native="search"
        />
      </div>
      <div class="radio">
        <span>评价时间</span>
        <el-radio-group v-model="time" size="medium" @change="setDate">
          <el-radio-button label="近一月" />
          <el-radio-button label="近三月" />
          <el-radio-button label="近半年" />
        </el-radio-group>
        <el-date-picker
          v-model="day"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 360px; margin-left: 20px;"
          @change="date"
        />
      </div>
      <el-divider dashed />
      <template>
        <b>共{{ total }}条评价</b>
        <div class="comment">
          <div v-for="item in list" :key="item.id" class="item">
            <div class="top" style="justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <img
                  v-if="item.memberAvatar !== null"
                  :src="item.memberAvatar"
                >
                <img v-else src="@/assets/default.jpg">
                <div class="comInfo">
                  <div>
                    <span style="margin-right: 6px;font-weight:600">{{
                      item.memberNickName
                    }}</span>
                    <span>{{ item.phone }}</span>
                  </div>
                  <div class="numBox">
                    <div class="num">
                      <span>评分</span>
                      <el-rate v-model="item.merchantAvgScore" disabled />
                    </div>
                  </div>
                </div>
              </div>
              <div class="place">
                <span>{{ item.storeName }}</span>
                <span>{{ item.commentTime }}</span>
              </div>
            </div>
            <div class="body" style="margin-bottom: 30px;">
              <b v-if="item.content === null">该用户没有填写评价内容</b>
              <b v-else>{{ item.content }}</b>
              <span>订单详情：{{ item.foodDetail }}</span>
              <div v-if="item.images" class="img">
                <span v-for="(i, j) in item.images.split(',')" :key="j">
                  <el-image
                    style="width: 80px; height: 80px;margin-right:20px"
                    padding
                    :src="i"
                    :preview-src-list="item.images.split(',')"
                  />
                </span>
              </div>
              <div>
                <span v-if="item.foodUp" class="list">
                  <span class="cricle up">赞</span>
                  <span class="food">{{ item.foodUp }}</span>
                </span>
                <span v-if="item.foodDown" class="list">
                  <span class="cricle down">踩</span>
                  <span class="food">{{ item.foodDown }}</span>
                </span>
              </div>

              <el-button
                v-if="false"
                type="primary"
                icon="el-icon-chat-line-round"
                style="width: 90px;"
                :loading="btnLoad"
                @click="replyBtn(item.id, item.merchantReply)"
              >
                回复
              </el-button>
              <el-button
                v-if="false"
                type="primary"
                icon="el-icon-chat-line-round"
                style="width: 115px;"
                :loading="btnLoad"
                @click="replyBtn(item.id, item.merchantReply)"
              >
                修改回复
              </el-button>
              <div
                v-show="!showJson[item.id]"
                v-if="item.merchantReply !== null"
                class="answerText"
              >
                <span style="color: #999999;">
                  商家回复 {{ item.replyTime }}
                </span>
                <p style="margin-top: 4px;">{{ item.merchantReply }}</p>
              </div>
              <div v-show="showJson[item.id]" class="answer">
                <el-input
                  v-model="value"
                  type="textarea"
                  :rows="4"
                  clearable
                  placeholder="请输入内容"
                  style="margin-bottom: 12px;"
                  @keyup.enter.native="onSubmit(item)"
                />
                <div>
                  <el-button
                    type="primary"
                    :loading="btnLoad"
                    @click="Comment(item)"
                  >
                    回复
                  </el-button>
                  <el-button @click="cancel(item.id)">取消</el-button>
                </div>
              </div>
            </div>
            <el-divider />
          </div>
          <a-empty v-show="list.length === 0" class="empty_margin" />
        </div>
      </template>
    </div>
    <Pagination :total="total" @pagination="updataPageList" />
  </div>
</template>

<script>
import { fhGetCommentList } from '@/api/customer'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { getStoreId } from '@/utils/auth'

export default {
  components: {
    Pagination
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
      value: '',
      disabled: false,
      loading: null,
      btnLoad: false,
      branch: {},
      storBranch: [],
      branchToal: 0,
      mainLoad: false,
      infoLoad: false
    }
  },
  async created() {
    window.app = this
    this.Json.storeId = await getStoreId()
  },
  mounted() {
    this.getCommentList(this.Json)
  },
  methods: {
    hide() {
      this.show = true
    },
    async getCommentList(params) {
      this.mainLoad = true
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
      this.mainLoad = false
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
        this.getCommentList(this.Json)
      }
    },
    search() {
      this.getCommentList(this.Json)
    },
    setStoreId(value) {
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
      if (from.name === 'Home' && to.query.level === 'bad') {
        // 差评按钮
        vm.score = '差评(1-2)'
        // 时间格式化
        const date = parseTime(+new Date(), '{y}-{m}-{d}')
        const start = `${date} 00:00:00`
        const end = `${date} 23:59:59`
        vm.day = [start, end]
        vm.Json.startTime = date
        vm.Json.endTime = date
        vm.Json.scoreOption = 3
        vm.getCommentList(vm.Json)
        // 请求
      }
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
    margin-bottom: 80px;
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
  display: flex;
  flex-flow: column;
  margin-left: 65px;
  margin-top: 16px;
  b {
    font-size: 16px;
  }
  span {
    margin: 10px 0;
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
  .list {
    margin-right: 20px;
    .cricle {
      display: inline-block;
      width: 22px;
      height: 22px;
      text-align: center;
      line-height: 22px;
      border-radius: 100%;
      color: #fff;
      margin-right: 4px;
    }
    .up {
      background: #cfa978;
    }
    .down {
      background: #b1b1b1;
    }
    .food {
      color: rgb(150, 148, 148);
    }
  }
}
</style>
