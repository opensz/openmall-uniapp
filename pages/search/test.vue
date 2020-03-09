<template>
	<view class="content">
		<view class="history-section icon">

        				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="城市选择" @eventClick="navTo('/pages/search/citySelect')"></list-cell>
        				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="评论" @eventClick="navTo('/pages/search/comment')"></list-cell>
        				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="优惠券" @eventClick="navTo('/pages/search/coupon')"></list-cell>
        				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="考试" @eventClick="navTo('/pages/search/exam_testing')"></list-cell>
        				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="搜索" @eventClick="navTo('/pages/search/sh1')"></list-cell>
        				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="标签选择" @eventClick="navTo('/pages/search/tagSelect')"></list-cell>
        				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="树" @eventClick="navTo('/pages/search/tkitree')"></list-cell>
        				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="跳转" @eventClick="navTo('/pages/test/bcForDirect')"></list-cell>
        				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="跳转" @eventClick="navTo('/pages/user/sign')"></list-cell>
        			</view>
	</view>
</template>

<script>
import listCell from '@/components/mix-list-cell';
	export default {
	components: {
    		listCell
    	},
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			navTo(url) {

            			uni.navigateTo({
            				url: url
            			});
            		},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
