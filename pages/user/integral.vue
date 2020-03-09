<template>
	<view class="content">
		<view class="status-contents">
			<view class="status top-view"></view>
		</view>
	<!-- 	#ifdef APP-PLUS || H5 -->
		<view class="title-box" @click="back">
			<uni-icon class="icon" type="arrowleft" size="28" color="#fff"></uni-icon>
			<text class="title">库存积分</text>
		</view>
		<!-- #endif -->
		<view class="integral-box">
			<view class="toUse">
				<text class="price" v-if="!integral">0</text>
				<text class="price" v-else="">{{integral/100}}</text>
				<text class="text">可支配积分</text>
			</view>
			<view class="integral-items">
				<view class="details-item" @click="billingDetails">
					<text>账单明细</text>
					<uni-icon class="icon" type="arrowright" size="24" color="#333"></uni-icon>
				</view>
				<view class="buy-item" @click="enterToBuy">
					<text>购买积分</text>
					<uni-icon class="icon" type="arrowright" size="24" color="#333"></uni-icon>
				</view>
				<view class="given-item" @click="presentIntegral">
					<text>赠送积分</text>
					<uni-icon class="icon" type="arrowright" size="24" color="#333"></uni-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import eonfox from '@/components/eonfox/eonfox.js';
	import fns from '@/components/eonfox/fns.js';
	var ef = new eonfox();
	export default {
		data() {
			return {
				integral:'',
				shopsId:''
			};
		},
	onShow: function () {
		this.load();
	},	
	
		components:{
			uniIcon	
		},
		methods: {
			load(){
				var that=this;
				ef.submit({
					request: {
						sj: ['MERCHANTSELF'],
						jf:['MERCHANTCREDITSELF']
					},
					callback: function(data){
						console.log(data);
						var fns_ = fns.checkError(data,"sj",function(erron, error){
							uni.showToast({
								title:error,
								icon:'none'
							});
							
							//没有数据，说明不是商家
							return;
						});
						if( fns_.jf ){
							that.integral = fns_.jf;
						}
						if(fns_.sj){
							that.shopsId = fns_.sj[0].id;
						}
					},
					 error: function(err){
							 console.log("出错啦", err);
					},
				});
				
			},
			
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			enterToBuy() {
				uni.navigateTo({
					url: '../../pagesA/buyIntegral/buyIntegral'
				})
			},
			presentIntegral() {
				uni.navigateTo({
					url: '../presentIntegral/presentIntegral'
				})
			},
			billingDetails:function(){
				uni.navigateTo({
					url:'../transactionDetail/transactionDetail?method=merchant_integral&mch_id='+this.shopsId
				});
			}
			
		}
	}
</script>


<style>
	.status-contents{
		height: var(--status-bar-height);
		background-color: #FF5252;
	}
	.top-view{
		width: 100%;
		position: fixed;
		top: 0;
	}
	.status{
		height:var(--status-bar-height);
	}
</style>

<style scoped lang="stylus" ref="stylesheet/stylus">
	.content
		width 100%
		overflow hidden
		.title-box
			width 100%
			height 60px
			color #fff
			font-size 18px
			line-height 60px
			background-color #FF5252
			
			.icon
				width 40%
		.integral-box
			width 100%
			// height 165px
			.toUse
				width 100%
				height 140px
				color #fff
				background-color #FF5252
				text
					display block
				.price
					font-size 36px
					text-align center
					margin 0 auto
					width 40%
					background-color #FF5252
				.text
					font-size 18px
					margin 20px auto
					text-align center
					width 90%
			.integral-items
				width 100%
				height 170px
				background-color #f4f3f3
				display flex
				justify-content center
				align-items center
				flex-direction column
				.details-item, .buy-item, .given-item
					width 100%
					height 45px
					background-color #fff
					display flex
					padding-left 15px
					justify-content center
					align-items center
					border-bottom 1px solid #ccc
					text
						width 90%
					.icon 
						width 10%
				.details-item
					margin 15px
				
				
			
</style>
