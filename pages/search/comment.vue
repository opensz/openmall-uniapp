<template>
	<view class="content">
		<uni-evaluate :list-data="evaluateData" :rate="rateData"/>
	</view>
</template>

<script>
import uniEvaluate from '../../components/xiujun-evaluate/uni-evaluate.vue';
import evaluateData from '../../common/list.js';
export default {
	components: {
		uniEvaluate
	},
	data() {
		return {
			evaluateData:evaluateData,
			rateData:4.6
		};
	},
	onLoad() {},
	methods: {}
};
</script>

<style>
.content {
	text-align: center;
	height: 400upx;
}
.logo {
	height: 200upx;
	width: 200upx;
	margin-top: 200upx;
}
.title {
	font-size: 36upx;
	color: #8f8f94;
}
</style>
