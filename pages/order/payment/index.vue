<template>
	<view class="app">

		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{orderInfo.payAmount}}</text>
		</view>

		<!-- #ifdef H5 -->
		<payments-by-h5
				:orderId="orderId"
				:recharge="recharge"
				:type="type"
				:uid="userInfo.id"
		></payments-by-h5>
		<!-- #endif -->

		<!-- #ifdef MP-WEIXIN -->
		<payments-by-wx
				:orderId="orderId"
				:recharge="recharge"
				:type="type"
				:uid="userInfo.id"
		></payments-by-wx>
		<!-- #endif -->

		<!-- #ifdef MP-ALIPAY -->
		<payments-by-ali
				:orderId="orderId"
				:recharge="recharge"
				:type="type"
				:uid="userInfo.id"
		></payments-by-ali>
		<!-- #endif -->

		<!-- #ifdef APP-PLUS||APP-PLUS-NVUE -->
		<payments-by-app
				:orderId="orderId"
				:recharge="recharge"
				:type="type"
				:uid="userInfo.id"
		></payments-by-app>
		<!-- #endif -->
	</view>
</template>



<script>
    // #ifdef H5
    import paymentsByH5 from '@/components/payments/paymentsByH5.vue'
    // #endif

    // #ifdef MP-WEIXIN
    import paymentsByWx from '@/components/payments/paymentsByWx.vue'
    // #endif

    // #ifdef MP-ALIPAY
    import paymentsByAli from '@/components/payments/paymentsByAli.vue'
    // #endif

    // #ifdef APP-PLUS||APP-PLUS-NVUE
    import paymentsByApp from '@/components/payments/paymentsByApp.vue'
    // #endif
	import Api from '@/common/api';

    export default {

        data () {
            return {
                orderId: 0,
                recharge: 0,
                type: 1,	// 订单类型 1商品订单 2充值订单
                orderInfo: {}, // 订单详情
                userInfo: {},	// 用户信息
				form_id:0
            }
        },

        components: {
            // #ifdef H5
            paymentsByH5,
            // #endif
            // #ifdef MP-WEIXIN
            paymentsByWx,
            // #endif
            // #ifdef MP-ALIPAY
            paymentsByAli,
            // #endif
            // #ifdef APP-PLUS||APP-PLUS-NVUE
            paymentsByApp,
            // #endif
        },

        onLoad (options) {
            this.orderId = options.order_id
            this.recharge = Number(options.recharge)
            this.type = Number(options.type)
			this.form_id =  Number(options.form_id)

            if (this.orderId && this.type == 1) {
                // 商品订单
                this.getOrderInfo()
            } else if (this.recharge && this.type == 2) {
                // 充值订单 获取用户id
                this.getUserInfo()
            } else if (this.form_id && (this.type == 5 || this.type == 6)) {
				// 表单订单 id传到订单上
				this.orderId = ''+this.form_id;
			} else {
                this.$common.errorToShow('订单支付参数错误', () => {
                    uni.navigateBack({
                        delta: 1
                    })
                })
            }
        },
        methods: {
            // 获取订单详情
			async getOrderInfo () {

				let params = {'id':this.orderId};
				let orderInfos = await Api.apiCall('get',Api.order.orderDetail,params);
				this.orderInfo = orderInfos.data;
				if(this.orderInfo.pay_status == 2){
					this.$common.redirectTo(
							'/pages/order/payment/result?order_id=' + this.orderInfo.id
					)
				}
            },
            // 获取用户信息
            getUserInfo () {
                this.$api.userInfo({}, res => {
                    if (res.code == 200) {
                        this.userInfo = res.data

                    } else {
                        this.$common.errorToShow(res.msg)
                    }
                })
            },
            // 跳转我的余额页面
            toRecharge () {
                this.$common.navigateTo('/pages/member/balance/index')
            }
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
