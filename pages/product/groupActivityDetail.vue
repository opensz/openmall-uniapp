<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400">
				<swiper-item class="swiper-item" v-for="(item, index) in small" :key="index">
					<view class="image-wrapper"><image :src="item" class="loaded" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{ goods.name }}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{ goods.price }}</text>
				<text class="m-price">¥{{ goods.originalPrice }}</text>
				<text class="coupon-tip">{{10-(goods.price/goods.originalPrice)}}折</text>
			</view>
			<view class="bot-row">
				<text>销量: {{ goods.sale }}</text>
				<text>库存: {{ goods.stock }}</text>
				<text>浏览量: {{ goods.hit }}</text>
			</view>
		</view>

		<!--  分享 -->
		<view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
		</view>
		<view class="eva-section">
        				<view class="e-header" v-for="(item, index) in groupActivity.productList" :key="index">
        					<img  :src="item.pic" width="30upx" height="30upx" alt="" />
        					<text class="title clamp">{{ item.name }}</text>
                            <text class="price">￥{{ item.price }}</text>


        				</view>
        				<text class="title clamp">{{ groupActivity.name }}</text>
                                                    <text class="price">原售价:￥{{ groupActivity.originprice }}</text>
                                                    <text class="price">套装价:￥{{ groupActivity.price }}</text>
                                                    <text class="price">节省价:￥{{ groupActivity.originprice - groupActivity.price }}</text>
                                                    <text class="price">运费价:￥{{ groupActivity.transfee }}</text>
                                                    <button type="primary" class=" action-btn no-border add-cart-btn" @click="buyGroup(groupActivity)">购买套装</button>
        			</view>


		<view class="c-list">
			<view class="c-row b-b" v-if="skuList && skuList.length > 0" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b" v-if="couponList.length > 0" @click="toggleMask('show')">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view>

			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>

		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{ consultCount.all }})</text>
				<text class="tit">好评</text>
				<text>({{ consultCount.goods }})</text>

				<text class="tit">一般</text>
				<text>({{ consultCount.general }})</text>

				<text class="tit">差评</text>
				<text>({{ consultCount.bad }})</text>
				<text class="tip" v-if="consultCount.persent != 200">好评率 {{ consultCount.persent }}%</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box" v-for="(item, index) in consultList" :key="item.id">
				<image :src="item.pic" class="portrait" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{ item.memberName }}</text>
					<text class="con">{{ item.consultContent }}</text>
					<view class="bot">
						<text class="attr">购买类型：{{ item.attr }}</text>
						<text class="time">{{ item.consultAddtime }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="detail-desc">
			<view class="d-header"><text>图文详情</text></view>
			<rich-text :nodes="desc"></rich-text>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite(goods)">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>

			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy(goods)">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addCart(goods)">加入购物车</button>
			</view>
		</view>

<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<view @click="obtainCoupon(item)" class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.name}}</text>
							<text  class="time">在{{item.endTime}}前有效。 可领{{item.perLimit}}张</text>

						</view>
						<view class="right">
							<text class="price">{{item.amount}}</text>
							<text>满{{item.minPoint }}可减{{item.amount }}</text>
						</view>
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">{{item.categoryTitle?'限' + item.categoryTitle + '可用': '全品类可用'}}</text>
				</view>
			</view>
		</view>

		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="sku.pic"></image>
					<view class="right">
						<text class="price">¥{{ sku.price }}</text>
						<text class="stock">库存：{{ sku.stock }}件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">{{ sItem.name }}</text>
						</view>
					</view>
				</view>
				<view v-for="(item, index) in specList" :key="index" class="attr-list">
					<text>{{ item.name }}</text>
					<view class="item-list">
						<text
							v-for="(childItem, childIndex) in specChildList"
							v-if="childItem.pid === item.id"
							:key="childIndex"
							class="tit"
							:class="{ selected: childItem.selected }"
							@click="selectSpec(childIndex, childItem.pid)"
						>
							{{ childItem.name }}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
import Api from '@/common/api';
import share from '@/components/share';
import { mapState } from 'vuex';
export default {
	components: {
		share
	},
	data() {
		return {
		maskState: 0, //优惠券面板显示状态
			specClass: 'none',
			specSelected: [],
			small: null,
			sku: [],
			detailData: [],
			goods: [],
			groupActivity:[],
			favorite: true,
			shareList: [],
			consultList: [],
			couponList:[],
			consultCount: {
				all: 0,
				bad: 0,
				general: 0,
				goods: 0
			},
			imgList: [
				{
					src: 'https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg'
				},
				{
					src: 'https://gd3.alicdn.com/imgextra/i3/TB1RPFPPFXXXXcNXpXXXXXXXXXX_!!0-item_pic.jpg_400x400.jpg'
				},
				{
					src: 'https://gd2.alicdn.com/imgextra/i2/38832490/O1CN01IYq7gu1UGShvbEFnd_!!38832490.jpg_400x400.jpg'
				}
			],
			desc: `

				`,
			skuList: [],
			specList: [],
			specChildList: []
		};
	},
	async onLoad(ops) {
		//接收传值,id里面放的是标题，因为测试数据并没写id
		let id = ops.id;
		if (id) {
			this.logining = true;
			let params = { id: ops.id };
			let data = await Api.apiCall('get', Api.index.groupActivityDetail, params);
			this.logining = false;

			if (data) {
				let detailData = data.goods;
				let goods = detailData.goods;
				this.goods = goods;
				this.favorite = data.favorite;
				this.groupActivity =data.groupActivity;
				this.typeGoodsList = detailData.typeGoodsList;
				var subImages = goods.albumPics;
				this.desc = goods.detailHtml;
				this.small = subImages.split(',');
				//await this.$api.json('detailData');
				let shareList = await this.$api.json('shareList');
				this.loaded = true;

				this.shareList = shareList;
				this.specList = detailData.productAttributeValueList;
				this.skuList = detailData.skuStockList;
				if (this.specList) {
					this.specList.forEach(item => {
						let valuesA = item.value.split(',');
						if (valuesA) {
							for (let cItem of valuesA) {
								let att = {};
								att.pid = item.id;
								att.name = cItem;
								this.specChildList.push(att);
							}
						}
					});
				}

				uni.setNavigationBarTitle({
					title: goods.name
				});
			}
			if (userInfo && userInfo.id) {
				let params = { goodsId: ops.id, memberId: this.userInfo.userInfo.id };
				await Api.apiCall('post', Api.goods.addView, params,true);
			}
			let params1 = { goodsId: ops.id };
			let consoltL = await Api.apiCall('get', Api.goods.consultList, params1,true);
			this.consultList = consoltL.list;
			this.consultCount = consoltL.count;

			let params3 = { };
            let couponList1 = await Api.apiCall('get', Api.index.couponList, params3,true);
            this.couponList = couponList1;
            console.log(this.couponList);
		}

		//规格 默认选中第一条
		if (this.specList) {
			var specs = '';
			this.specList.forEach(item => {
				for (let cItem of this.specChildList) {
					if (cItem.pid === item.id) {
						this.$set(cItem, 'selected', true);
						this.specSelected.push(cItem);
						specs = cItem.name + ',' + specs;
						break; //forEach不能使用break
					}
				}
			});
			let valuesA = specs.substr(0, specs.length - 1).split(',');

			this.skuList.forEach(item => {
				if (valuesA.length == 1 && item.sp1 == valuesA[0]) {
					this.sku = item;
				}
				if (valuesA.length == 2 && item.sp2 == valuesA[0] && item.sp1 == valuesA[1]) {
					this.sku = item;
				}
				if (valuesA.length == 3 && item.sp3 == valuesA[0] && item.sp2 == valuesA[1] && item.sp1 == valuesA[2]) {
					this.sku = item;
				}
				if (!this.sku.pic) {
					this.sku.pic = this.goods.pic;
				}
				if (!this.sku.stock) {
					this.sku.stock = 0;
				}
				if (!this.sku.price) {
					this.sku.price = this.goods.price;
				}
			});
		}

	},
	computed: {
		...mapState(['hasLogin', 'userInfo'])
	},
	methods: {
	toggleMask(type) {
    				let timer = type === 'show' ? 10 : 300;
    				let state = type === 'show' ? 1 : 0;
    				this.maskState = 2;
    				setTimeout(() => {
    					this.maskState = state;
    				}, timer)
    			},
    			//领取优惠券
    		async	obtainCoupon(index) {
    			if (!this.hasLogin) {
    			this.$api.msg('请先登录');
    			}
    			             uni.showLoading({
                        				title: '请稍后'
                        			});

                        			let params = { couponId: index.id };
                        			let data = await Api.apiCall('post', Api.index.acceptCoupon, params);
                                        console.log(data);
                        			if (data) {
                        				this.$api.msg(data);
                        				this.toggleMask()
                        			}
                        			uni.hideLoading();


    			},
		//规格弹窗开关
		toggleSpec() {
			if (this.specClass === 'show') {
				this.specClass = 'hide';
				setTimeout(() => {
					this.specClass = 'none';
				}, 250);
			} else if (this.specClass === 'none') {
				this.specClass = 'show';
			}
		},
		//选择规格
		selectSpec(index, pid) {
			let list = this.specChildList;
			list.forEach(item => {
				if (item.pid === pid) {
					this.$set(item, 'selected', false);
				}
			});

			this.$set(list[index], 'selected', true);
			//存储已选择
			/**
			 * 修复选择规格存储错误
			 * 将这几行代码替换即可
			 * 选择的规格存放在specSelected中
			 */
			var specs = '';
			this.specSelected = [];
			list.forEach(item => {
				if (item.selected === true) {
					this.specSelected.push(item);
					specs = item.name + ',' + specs;
				}
			});
			let valuesA = specs.substr(0, specs.length - 1).split(',');

			this.skuList.forEach(item => {
				if (valuesA.length == 1 && item.sp1 == valuesA[0]) {
					this.sku = item;
				}
				if (valuesA.length == 2 && item.sp2 == valuesA[0] && item.sp1 == valuesA[1]) {
					this.sku = item;
				}
				if (valuesA.length == 3 && item.sp3 == valuesA[0] && item.sp2 == valuesA[1] && item.sp1 == valuesA[2]) {
					this.sku = item;
				}
				if (!this.sku.pic) {
					this.sku.pic = this.goods.pic;
				}
				if (!this.sku.stock) {
					this.sku.stock = 0;
				}
				if (!this.sku.price) {
					this.sku.price = this.goods.price;
				}
			});
		},
		//分享
		share() {
			this.$refs.share.toggleMask();
		},
		//收藏
		toFavorite(item) {
			if (userInfo && userInfo.id) {
				this.favorite = !this.favorite;
				let params = { objId: item.id, type: 1, memberId: this.userInfo.userInfo.id, name: item.name, meno1: item.pic, meno2: item.price, meno3: item.sale };
				Api.apiCall('post', Api.goods.favoriteSave, params);


			} else {
				let url = '/pages/public/login';
				uni.navigateTo({
					url
				});
			}
		},

		async buyGroup(item) {
			if (userInfo && userInfo.id) {
				uni.navigateTo({
					url: `/pages/order/createOrder?groupActivityId=`+item.id
				});


        			}else {
				let url = '/pages/public/login';
				uni.navigateTo({
					url
				});
			}




        		},
		async buy(item) {
			if (userInfo && userInfo.id) {
				let data;
				let id = item.id;

				if (this.sku && this.sku.id) {
					if(this.sku.stock<1){
						uni.showToast({title:"库存不够！"});
						return;
					}

					let params = { goodsId: id, skuId: this.sku.id, memberId: this.userInfo.userInfo.id };
					data = await Api.apiCall('post', Api.order.addCart, params);
					uni.navigateTo({
						url: `/pages/order/createOrder?id=${data.id}&&type=1&&skuId=${this.sku.id}&&memberId=${this.userInfo.userInfo.id}`
					});
				} else {
					if(this.goods.stock<1){
						uni.showToast({title:"库存不够！"});
						return;
					}
					let params = { goodsId: id, memberId: this.userInfo.userInfo.id };
					data = await Api.apiCall('post', Api.order.addCart, params);

					uni.navigateTo({
						url: `/pages/order/createOrder?id=${data.id}&&type=1&&memberId=${this.userInfo.userInfo.id}`
					});
				}
			}else{
				let url = '/pages/public/login';
				uni.navigateTo({
					url
				});
			}

		},
		async addCart(item) {
			if (userInfo && userInfo.id) {
				let id = item.id;
				let data;

				if (this.sku && this.sku.id) {
					if(this.sku.stock<1){
						uni.showToast({title:"库存不够！"});
						return;
					}
					let params = { goodsId: id, skuId: this.sku.id, memberId: this.userInfo.userInfo.id };
					data = await Api.apiCall('post', Api.order.addCart, params);
				} else {
					if(this.goods.stock<1){
						uni.showToast({title:"库存不够！"});
						return;
					}
					let params = { goodsId: id, memberId: this.userInfo.userInfo.id };
					data = await Api.apiCall('post', Api.order.addCart, params);
				}

				if (data) {
					this.$api.msg('添加购物车成功!');
				} else {
					this.$api.msg('加入购物车错误');
				}
			}else {
				let url = '/pages/public/login';
				uni.navigateTo({
					url
				});
				return false;
			}


		},
		stopPrevent() {}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
	padding-bottom: 160upx;
}
.icon-you {
	font-size: $font-base + 2upx;
	color: #888;
}
.carousel {
	height: 722upx;
	position: relative;
	swiper {
		height: 100%;
	}
	.image-wrapper {
		width: 100%;
		height: 100%;
	}
	.swiper-item {
		display: flex;
		justify-content: center;
		align-content: center;
		height: 750upx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
	}
}

/* 标题简介 */
.introduce-section {
	background: #fff;
	padding: 20upx 30upx;

	.title {
		font-size: 32upx;
		color: $font-color-dark;
		height: 50upx;
		line-height: 50upx;
	}
	.price-box {
		display: flex;
		align-items: baseline;
		height: 64upx;
		padding: 10upx 0;
		font-size: 26upx;
		color: $uni-color-primary;
	}
	.price {
		font-size: $font-lg + 2upx;
	}
	.m-price {
		margin: 0 12upx;
		color: $font-color-light;
		text-decoration: line-through;
	}
	.coupon-tip {
		align-items: center;
		padding: 4upx 10upx;
		background: $uni-color-primary;
		font-size: $font-sm;
		color: #fff;
		border-radius: 6upx;
		line-height: 1;
		transform: translateY(-4upx);
	}
	.bot-row {
		display: flex;
		align-items: center;
		height: 50upx;
		font-size: $font-sm;
		color: $font-color-light;
		text {
			flex: 1;
		}
	}
}
/* 分享 */
.share-section {
	display: flex;
	align-items: center;
	color: $font-color-base;
	background: linear-gradient(left, #fdf5f6, #fbebf6);
	padding: 12upx 30upx;
	.share-icon {
		display: flex;
		align-items: center;
		width: 70upx;
		height: 30upx;
		line-height: 1;
		border: 1px solid $uni-color-primary;
		border-radius: 4upx;
		position: relative;
		overflow: hidden;
		font-size: 22upx;
		color: $uni-color-primary;
		&:after {
			content: '';
			width: 50upx;
			height: 50upx;
			border-radius: 50%;
			left: -20upx;
			top: -12upx;
			position: absolute;
			background: $uni-color-primary;
		}
	}
	.icon-xingxing {
		position: relative;
		z-index: 1;
		font-size: 24upx;
		margin-left: 2upx;
		margin-right: 10upx;
		color: #fff;
		line-height: 1;
	}
	.tit {
		font-size: $font-base;
		margin-left: 10upx;
	}
	.icon-bangzhu1 {
		padding: 10upx;
		font-size: 30upx;
		line-height: 1;
	}
	.share-btn {
		flex: 1;
		text-align: right;
		font-size: $font-sm;
		color: $uni-color-primary;
	}
	.icon-you {
		font-size: $font-sm;
		margin-left: 4upx;
		color: $uni-color-primary;
	}
}

.c-list {
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	background: #fff;
	.c-row {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		position: relative;
	}
	.tit {
		width: 140upx;
	}
	.con {
		flex: 1;
		color: $font-color-dark;
		.selected-text {
			margin-right: 10upx;
		}
	}
	.bz-list {
		height: 40upx;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		text {
			display: inline-block;
			margin-right: 30upx;
		}
	}
	.con-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		color: $font-color-dark;
		line-height: 40upx;
	}
	.red {
		color: $uni-color-primary;
	}
}

/* 评价 */
.eva-section {
	display: flex;
	flex-direction: column;
	padding: 20upx 30upx;
	background: #fff;
	margin-top: 16upx;
	.e-header {
		display: flex;
		align-items: center;
		height: 70upx;
		font-size: $font-sm + 2upx;
		color: $font-color-light;
		.tit {
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 4upx;
		}
		.tip {
			flex: 1;
			text-align: right;
		}
		.icon-you {
			margin-left: 10upx;
		}
	}
}
.eva-box {
	display: flex;
	padding: 20upx 0;
	.portrait {
		flex-shrink: 0;
		width: 80upx;
		height: 80upx;
		border-radius: 100px;
	}
	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: $font-base;
		color: $font-color-base;
		padding-left: 26upx;
		.con {
			font-size: $font-base;
			color: $font-color-dark;
			padding: 20upx 0;
		}
		.bot {
			display: flex;
			justify-content: space-between;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
}
/*  详情 */
.detail-desc {
	background: #fff;
	margin-top: 16upx;
	.d-header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		position: relative;

		text {
			padding: 0 20upx;
			background: #fff;
			position: relative;
			z-index: 1;
		}
		&:after {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%);
			width: 300upx;
			height: 0;
			content: '';
			border-bottom: 1px solid #ccc;
		}
	}
}

/* 规格选择弹窗 */
.attr-content {
	padding: 10upx 30upx;
	.a-t {
		display: flex;
		image {
			width: 170upx;
			height: 170upx;
			flex-shrink: 0;
			margin-top: -40upx;
			border-radius: 8upx;
		}
		.right {
			display: flex;
			flex-direction: column;
			padding-left: 24upx;
			font-size: $font-sm + 2upx;
			color: $font-color-base;
			line-height: 42upx;
			.price {
				font-size: $font-lg;
				color: $uni-color-primary;
				margin-bottom: 10upx;
			}
			.selected-text {
				margin-right: 10upx;
			}
		}
	}
	.attr-list {
		display: flex;
		flex-direction: column;
		font-size: $font-base + 2upx;
		color: $font-color-base;
		padding-top: 30upx;
		padding-left: 10upx;
	}
	.item-list {
		padding: 20upx 0 0;
		display: flex;
		flex-wrap: wrap;
		text {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #eee;
			margin-right: 20upx;
			margin-bottom: 20upx;
			border-radius: 100upx;
			min-width: 60upx;
			height: 60upx;
			padding: 0 20upx;
			font-size: $font-base;
			color: $font-color-dark;
		}
		.selected {
			background: #fbebee;
			color: $uni-color-primary;
		}
	}
}

/*  弹出层 */
.popup {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	z-index: 99;

	&.show {
		display: block;
		.mask {
			animation: showPopup 0.2s linear both;
		}
		.layer {
			animation: showLayer 0.2s linear both;
		}
	}
	&.hide {
		.mask {
			animation: hidePopup 0.2s linear both;
		}
		.layer {
			animation: hideLayer 0.2s linear both;
		}
	}
	&.none {
		display: none;
	}
	.mask {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0.4);
	}
	.layer {
		position: fixed;
		z-index: 99;
		bottom: 0;
		width: 100%;
		min-height: 40vh;
		border-radius: 10upx 10upx 0 0;
		background-color: #fff;
		.btn {
			height: 66upx;
			line-height: 66upx;
			border-radius: 100upx;
			background: $uni-color-primary;
			font-size: $font-base + 2upx;
			color: #fff;
			margin: 30upx auto 20upx;
		}
	}
	@keyframes showPopup {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes hidePopup {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes showLayer {
		0% {
			transform: translateY(120%);
		}
		100% {
			transform: translateY(0%);
		}
	}
	@keyframes hideLayer {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(120%);
		}
	}
}

/* 底部操作菜单 */
.page-bottom {
	position: fixed;
	left: 30upx;
	bottom: 30upx;
	z-index: 95;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 690upx;
	height: 100upx;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
	border-radius: 16upx;

	.p-b-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: $font-sm;
		color: $font-color-base;
		width: 96upx;
		height: 80upx;
		.yticon {
			font-size: 40upx;
			line-height: 48upx;
			color: $font-color-light;
		}
		&.active,
		&.active .yticon {
			color: $uni-color-primary;
		}
		.icon-fenxiang2 {
			font-size: 42upx;
			transform: translateY(-2upx);
		}
		.icon-shoucang {
			font-size: 46upx;
		}
	}
	.action-btn-group {
		display: flex;
		height: 76upx;
		border-radius: 100px;
		overflow: hidden;
		box-shadow: 0 20upx 40upx -16upx #fa436a;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
		background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
		margin-left: 20upx;
		position: relative;
		&:after {
			content: '';
			position: absolute;
			top: 50%;
			right: 50%;
			transform: translateY(-50%);
			height: 28upx;
			width: 0;
			border-right: 1px solid rgba(255, 255, 255, 0.5);
		}
		.action-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 180upx;
			height: 100%;
			font-size: $font-base;
			padding: 0;
			border-radius: 0;
			background: transparent;
		}
	}
}

/* 优惠券面板 */
.mask {
	display: flex;
	align-items: flex-end;
	position: fixed;
	left: 0;
	top: var(--window-top);
	bottom: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0);
	z-index: 9995;
	transition: 0.3s;

	.mask-content {
		width: 100%;
		min-height: 30vh;
		max-height: 70vh;
		background: #f3f3f3;
		transform: translateY(100%);
		transition: 0.3s;
		overflow-y: scroll;
	}
	&.none {
		display: none;
	}
	&.show {
		background: rgba(0, 0, 0, 0.4);

		.mask-content {
			transform: translateY(0);
		}
	}
}

/* 优惠券列表 */
.coupon-item {
	display: flex;
	flex-direction: column;
	margin: 20upx 24upx;
	background: #fff;
	.con {
		display: flex;
		align-items: center;
		position: relative;
		height: 120upx;
		padding: 0 30upx;
		&:after {
			position: absolute;
			left: 0;
			bottom: 0;
			content: '';
			width: 100%;
			height: 0;
			border-bottom: 1px dashed #f3f3f3;
			transform: scaleY(50%);
		}
	}
	.left {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		overflow: hidden;
		height: 100upx;
	}
	.title {
		font-size: 32upx;
		color: $font-color-dark;
		margin-bottom: 10upx;
	}
	.time {
		font-size: 24upx;
		color: $font-color-light;
	}
	.right {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
		color: $font-color-base;
		height: 100upx;
	}
	.price {
		font-size: 44upx;
		color: $base-color;
		&:before {
			content: '￥';
			font-size: 34upx;
		}
	}
	.tips {
		font-size: 24upx;
		color: $font-color-light;
		line-height: 60upx;
		padding-left: 30upx;
	}
	.circle {
		position: absolute;
		left: -6upx;
		bottom: -10upx;
		z-index: 10;
		width: 20upx;
		height: 20upx;
		background: #f3f3f3;
		border-radius: 100px;
		&.r {
			left: auto;
			right: -6upx;
		}
	}

}
</style>
