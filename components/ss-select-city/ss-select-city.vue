<template>
  <view class="select-city-wrap">
    <view class="select-city">
      <view class="index">
        <view class="index-item" @click="scrollTo('#')">#</view>
        <view class="index-item" v-for="item in citys" :key="item.letter" @click="scrollTo(item.letter)">{{item.letter}}</view>
      </view>
      <scroll-view :scroll-into-view="scrollIntoId" :scroll-y="true" :scroll-with-animation="true" :style="{height:windowHeight}">
        <view class="content">
          <view class="section" id="current">
            <view class="city-title">当前城市</view>
            <view class="city-list">
              <view class="city-item">{{current}}</view>
            </view>
          </view>
          <view class="section" id="hot" v-if="hotCitys.length">
            <view class="city-title">热门城市</view>
            <view class="city-list">
              <view class="city-item" :class="{active: current === city}" v-for="(city, i) in hotCitys" :key="i" @click="onSelect(city)">{{city}}</view>
            </view>
          </view>
          <view class="section" :id="item.letter" v-for="item in citys" :key="item.letter">
            <view class="letter">{{item.letter}}</view>
            <view class="city-list">
              <view class="city-item" :class="{active: current === city}" v-for="(city,itemIndex) in item.list" :key="itemIndex" @click="onSelect(city)">{{city}}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
  import Citys from './citys'
  export default {
    props: {
      hotCitys: {
        type: Array,
        default () {
          return []
        }
      },
      value: {
        type: String,
        default: '未设置'
      }
    },
    data() {
      return {
        citys: Citys,
        windowHeight: '',
        scrollIntoId: 'F',
        current: this.value
      }
    },
    mounted() {
      this.getSystemInfo()
    },
    methods: {
      getSystemInfo() {
        uni.getSystemInfo().then(res => {
          let [error, data] = res
          this.windowHeight = `${data.windowHeight}px`
        })
      },
      scrollTo(letter) {
        this.scrollIntoId = letter === '#' ? 'current' : letter
      },
      onSelect(city) {
        this.current = city
        this.$emit('input', city)
        this.$emit('on-select', city)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .select-city-wrap {
    position: relative;
    padding: 0 30upx;
    background-color: #fff;
  }
  .select-city {
    .index {
      position: absolute;
      right: 0;
      bottom: 20upx;
      z-index: 999;
      color: #2f9bfe;
      font-size: 32upx;
      .index-item {
        width: 40upx;
        height: 42upx;
        line-height: 42upx;
        text-align: center;
      }
    }
    .section {
      margin-bottom: 19upx;
      .city-title {
        color: #333;
        font-size: 28upx;
        margin-bottom: 28upx;
      }
      .letter {
        width: 44upx;
        height: 44upx;
        color: #fff;
        border-radius: 100%;
        background-color: #2f9bfe;
        font-size: 28upx;
        line-height: 44upx;
        text-align: center;
        margin-bottom: 30upx;
      }
      .city-list {
        display: flex;
        flex-wrap: wrap;
        .city-item {
          width: 190upx;
          height: 55upx;
          margin-right: 36upx;
          margin-bottom: 28upx;
          line-height: 55upx;
          text-align: center;
          border: 1px solid #dcdcdc;
          border-radius: 6upx;
          color: #999;
          font-size: 28upx;
          &.active {
            background-color: #d5ebff;
            border-color: #2f9bfe;
            color: #2f9bfe;
          }
        }
      }
    }
  }
</style>
