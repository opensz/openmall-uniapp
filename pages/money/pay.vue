<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{orderInfo.payAmount}}</text>
		</view>

		<view class="pay-type-list">

			<view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(1)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view class="type-item" @click="changePayType(3)">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">预存款支付</text>
					<text>可用余额 ¥{{orderInfo.blance}}</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label>
			</view>
		</view>
		
		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
    import { mapState } from 'vuex';
    import Api from '@/common/api';

     let userInfo = uni.getStorageSync('userInfo');
	export default {
		data() {
			return {
				payType: 1,
				orderInfo: {}
			};
		},

        async onLoad(options) {
            let params = {'id':options.id};
            let orderInfo1 = await Api.apiCall('get',Api.order.orderDetail,params);
             this.orderInfo = orderInfo1.data;
		},

		methods: {
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
            async  confirm() {

                if (this.payType ==2){
                    /**
                     * 微信小程序支付,仅支持微信支付(后续可能集成网页支付宝支付web-view)
                     *
                     * @param : provider(String) ->付款商家
                     * @param : timeStamp(String) ->时间戳(当前支付时间)
                     * @param : nonceStr(String) ->支付密匙
                     * @param : packages(String) ->支付id
                     * @param : signType(String) ->加密方式(默认MD5)
                     * @param : paySign(String)
                     *
                     *
                     *
                     * 小程序支付调用
                     *
                     * wePay(provider, timeStamp, nonceStr, packages, signType, paySign,res=>{},fail=>{})
                     */


                    let params = {'orderId':this.orderInfo.id};
                    let res1 = await Api.apiCall('get',Api.order.weixinAppletPay,params);
                    let res = res1.data;
                    if (res) {
                        uni.requestPayment({
                            timeStamp: res.timeStamp,
                            nonceStr: res.nonceStr,
                            package: res.package,
                            signType: res.signType,
                            paySign: res.paySign,
                            success(datas) {
                                console.log(datas);
                                uni.redirectTo({
                                    url: '/pages/money/paySuccess'
                                })
                            },
                            fail(err) {
                                fail(JSON.stringify(err))
                            }
                        });

                    }else {
                        this.$api.msg(res1.msg);
                    }
                }else if (this.payType ==3){
                    let params1 = {'payAmount':this.orderInfo.payAmount,'balance':userInfo.blance,'orderId':this.orderInfo.id};
                    let data1 = await Api.apiCall('post',Api.order.balancePay,params1);
                    if (data1.data) {
                        uni.redirectTo({
                            url: '/pages/money/paySuccess'
                        })
                    }else {
                        this.$api.msg(data1.msg);
                    }
                }

			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
