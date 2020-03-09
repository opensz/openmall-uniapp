<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index">
			<view class="wrapper" @click="checkAddress(item)">
				<view class="u-box">
					<text class="name">{{ item.name }}</text>
					<text class="mobile">{{ item.phoneNumber }}</text>
				</view>
				<view class="address-box">
					<text v-if="item.defaultStatus == 1" class="tag">默认</text>
					<text class="address"> {{ item.province }}-{{ item.city }}-{{ item.region }}-{{ item.detailAddress }}</text>
				</view>

			</view>
			<view class="" style="display: flex;flex-direction: row;width: 100%;justify-content: flex-end;">
				<view class="" style="width: 20%;display: flex;align-items: center;justify-content: center;" @click="addAddress('edit', item)">
					<text class="yticon icon-bianji"></text>
					<text style="font-size: 30upx;margin-left: 10upx;">编辑</text>
				</view>
				<view class="" style="width: 20%;display: flex;align-items: center;justify-content: center;" @click="delAddress(item)">
					<text class="yticon icon-iconfontshanchu1"></text>
					<text style="font-size: 30upx;">删除</text>
				</view>
			</view>
		</view>
		<!--<text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			重要：添加和修改地址回调仅增加了一条数据做演示，实际开发中将回调改为请求后端接口刷新一下列表即可
		</text>-->

		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
import Api from '@/common/api';
export default {
	data() {
		return {
			source: 0,
			addressList: [],
		};
	},
	async onLoad(option) {
		this.source = option.source;
		this.getListAddress()
	},
	async onShow(){
		this.getListAddress()
	},
	methods: {
		async getListAddress(){
			let params = {};
			let addressList = await Api.apiCall('get', Api.order.listAddress, params);
			this.addressList = addressList.data;
		},
		//选择地址
		checkAddress(item) {
			if (this.source == 1) {
				//this.$api.prePage()获取上一页实例，在App.vue定义
				this.$api.prePage().addressData = item;
				this.$api.prePage().addressId = item.id;
				uni.navigateBack();
			}
		},
		addAddress(type, item) {
			uni.navigateTo({
				url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
			});
		},
		//添加或修改成功之后回调
		refreshList(data, type) {
			//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
			this.addressList.unshift(data);

			console.log(data, type);
		},
		// 删除地址
		async delAddress(item){
			console.log(item)
			// let params = {
			// 	id: item.id
			// }
			let data = await Api.apiCall('post', Api.order.deleteAddress, {id: item.id});
			if(data){
				uni.showToast({
					title: '删除成功',
				})
			}else{
				uni.showToast({
					title: '删除失败',
					icon: 'none'
				})
			}
			console.log("------删除-------",data)
		},
	}
};
</script>

<style lang="scss">
page {
	padding-bottom: 120upx;
}
.content {
	position: relative;
}
.list {
	display: flex;
	align-items: center;
	flex-direction: column;
	padding: 20upx;
	background: #fff;
	position: relative;
}
.wrapper {
	width: 100%;
	display: flex;
	flex-direction: column;
	flex: 1;
}
.address-box {
	display: flex;
	align-items: center;
	margin: 10upx 0;
	.tag {
		font-size: 24upx;
		color: $base-color;
		margin-right: 10upx;
		background: #fffafb;
		border: 1px solid #ffb4c7;
		border-radius: 4upx;
		padding: 4upx 10upx;
		line-height: 1;
	}
	.address {
		font-size: 28upx;
		color: $font-color-light;
	}
}
.u-box {
	font-size: 32upx;
	color: $font-color-000;
	// margin-top: 16upx;
	.name {
		margin-right: 30upx;
	}
}
.icon-bianji {
	// display: flex;
	// align-items: center;
	// height: 80upx;
	font-size: 36upx;
	color: $font-color-light;
	// padding-left: 30upx;
}

.add-btn {
	position: fixed;
	left: 30upx;
	right: 30upx;
	bottom: 16upx;
	z-index: 95;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 690upx;
	height: 80upx;
	font-size: 32upx;
	color: #fff;
	background-color: $base-color;
	border-radius: 10upx;
	box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
