<template>
	<view>
		<swiper class="carousel" indicator-dots="true" circular="true" interval="3000" duration="700">
			<swiper-item v-for="(item, index) in small" :key="index">
				<view class="image-wrapper"><image :src="item" :class="item.loaded" mode="aspectFill" @load="imageOnLoad('small', index)"></image></view>
			</swiper-item>
		</swiper>
		<view class="scroll-view-wrapper">
			<scroll-view class="episode-panel" :class="{ Skeleton: !loaded }" scroll-x>
				<view v-for="(item, index) in episodeList" :key="index" :class="{ current: currentEpd === item }" @click="changeEpd(index)">{{ item }}</view>
			</scroll-view>
		</view>
		<view class="info">
			<view class="title">
				<text :class="{ Skeleton: !loaded }">{{ data.name }}</text>
				<text :class="{ Skeleton: !loaded }">{{ data.subTitle }}</text>
			</view>
			<text class="yticon icon-xia"></text>
		</view>
		<view class="actions">
			<text class="yticon icon-fenxiang2" @click="share"></text>
			<text class="yticon icon-Group-"></text>
			<text class="yticon icon-shoucang" :class="{ active: data.favorite }" @click="favorite"></text>
		</view>

		<!-- 猜你喜欢 -->
		<view class="guess">
			<view class="section-tit">同类产品</view>
			<view class="guess-list">
				<view v-for="(item, index) in typeGoodsList" :key="index" class="guess-item">
					<view class="image-wrapper"><image :src="item.pic" :class="item.loaded" mode="aspectFill" @load="imageOnLoad('typeGoodsList', index)"></image></view>
					<text class="title clamp" :class="{ Skeleton: !loaded }">{{ item.name }}</text>
					<text class="clamp" :class="{ Skeleton: !loaded }">{{ item.subTitle }}</text>
				</view>
			</view>
		</view>
		<!-- 评论 -->
		<view class="evalution">
			<view class="section-tit">评论</view>
			<view class="eva-list" :class="{ Skeleton: !loaded }">
				<view v-for="(item, index) in consultData.list" :key="index" class="eva-item">
					<image :src="item.src" mode="aspectFill"></image>
					<view class="eva-right">
						<text>{{ item.memberName }}</text>
						<text>{{ item.consultAddtime }}</text>
						<view class="zan-box">
							<text>{{ item.storeId }}</text>
							<text class="yticon icon-shoucang"></text>
						</view>
						<text class="content">{{ item.consultContent }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
import Api from '@/common/api';
import share from '@/components/share';
export default {
	components: {
		share
	},
	data() {
		return {
			loaded: false,
			currentEpd: 1,
			consultData: null,
			small: [],
			typeGoodsList: [],
			episodeList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
			data: {
				guessList: [{}, {}, {}, {}]
			},
			shareList: []
		};
	},
	async onLoad(ops) {
		this.logining = true;
		let params = { id: ops.id };
		let data = await Api.apiCall('get', Api.goods.goodsDetail, params);
		this.logining = false;
		if (data) {
			let detailData = data.data;
			this.typeGoodsList = detailData.typeGoodsList;
			var subImages = detailData.albumPics;
			this.small = subImages.split(',');
			//await this.$api.json('detailData');
			let shareList = await this.$api.json('shareList');
			this.loaded = true;
			this.data = detailData;
			this.shareList = shareList;
			uni.setNavigationBarTitle({
				title: detailData.title
			});
		}
	},

	methods: {
		imageOnLoad(key, index) {
			this.$set(this.data[key][index], 'loaded', 'loaded');
		},
		changeEpd(index) {
			let list = this.data.episodeList;
			let epd = list[index];
			this.$api.msg(`切换到第${epd}项`);
			this.currentEpd = epd;
		},
		//分享
		share() {
			this.$refs.share.toggleMask();
		},
		//收藏
		favorite() {
			this.data.favorite = !this.data.favorite;
		}
	},
	//处理遮罩层物理返回键
	onBackPress() {
		if (this.$refs.share.show) {
			this.$refs.share.toggleMask();
			return true;
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}

.carousel {
	height: 200px;
	.image-wrapper {
		display: flex;
		justify-content: center;
		align-content: center;
		width: 100%;
		height: 100%;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}
}
.scroll-view-wrapper {
	display: flex;
	align-items: center;
	height: 90upx;
	padding: 20upx 0 20upx 40upx;
	background: #fff;
}
.episode-panel {
	white-space: nowrap;
	width: 100%;
	view {
		display: inline-block;
		margin-right: 30upx;
		width: 56upx;
		font-size: $font-lg;
		color: $font-color-base;
		&.current {
			color: #07a7a7;
		}
	}
}

.info {
	display: flex;
	align-items: center;
	padding: 10upx 40upx;
	background: #fff;

	.title {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: $font-lg + 4upx;
		color: $font-color-dark;

		text:last-child {
			font-size: $font-sm;
			color: $font-color-light;
			margin-top: 4upx;
			&.Skeleton {
				width: 220upx;
			}
		}
	}
	.yticon {
		font-size: 44upx;
		color: $font-color-base;
		margin: 0 10upx 0 30upx;
	}
}

.actions {
	padding: 10upx 28upx;
	background: #fff;

	.yticon {
		font-size: 46upx;
		color: $font-color-base;
		padding: 10upx 12upx;
		&.active {
			color: #ff4443;
		}
		&:nth-child(2) {
			font-size: 50upx;
		}
	}
}

.section-tit {
	font-size: $font-base + 2upx;
	color: $font-color-dark;
	margin-bottom: 30upx;
	text-align: center;
}

.guess {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 30upx 40upx 10upx;
	margin-top: 16upx;
	background: #fff;
}

.guess-list {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}
.guess-item {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
	min-width: 40%;
	margin-right: 26upx;
	padding-bottom: 40upx;

	&:nth-child(2n) {
		margin-right: 0;
	}

	image {
		width: 100%;
		height: 200upx;
		border-radius: 10upx;
	}

	text {
		font-size: $font-sm;
		color: $font-color-light;
		&.Skeleton {
			width: 180upx;
			&.title {
				width: 140upx;
			}
		}
		&.title {
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-top: 16upx;
			margin-bottom: 8upx;
		}
	}
}
.evalution {
	display: flex;
	flex-direction: column;
	background: #fff;
	margin-top: 16upx;
	padding: 40upx 0;
}

.eva-item {
	display: flex;
	padding: 20upx 40upx;
	image {
		width: 60upx;
		height: 60upx;
		border-radius: 50px;
		flex-shrink: 0;
		margin-right: 24upx;
	}
}
.eva-right {
	display: flex;
	flex-direction: column;
	flex: 1;
	font-size: $font-sm + 2upx;
	color: $font-color-light;
	position: relative;
	.zan-box {
		display: flex;
		align-items: base-line;
		position: absolute;
		top: 10upx;
		right: 10upx;
		.yticon {
			margin-left: 8upx;
		}
	}
	.content {
		font-size: $font-base;
		color: #333;
		padding-top: 20upx;
	}
}
</style>
