<template>
	<view class="page">
		<view class="section">
			<fl-signin :date="date" :list="list" @signin_fun="signin_fun" :repair="repair" :rule="rule" @repair_fun="repair_fun"
			 :choose_date="choose_date" @date_change="date_change"></fl-signin>
		</view>

		<view class="footer">
			<view class="repair" @click="repair=!repair">
				<text>{{repair?"关闭补签":"开启补签"}}</text>
			</view>
			<view class="repair" @click="rule=!rule">
				<text>{{rule?"关闭补签规则":"开启补签规则"}}</text>
			</view>
			<view class="repair" @click="choose_date=!choose_date">
				<text>{{choose_date?"关闭日期选择":"开启日期选择"}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import flSignin from '../../components/fl-signin/fl-signin.vue'
	export default {
		components: {
			flSignin,
		},
		data() {
			return {
				// 是否可以选择日期
				choose_date: false,
				// 当前日期
				date: "2019-05",
				// 签到成功列表
				list: ["2019-03-10", "03-15", "20"],
				// 是否开启补签
				repair: false,
				// 是否开启补签规则
				rule: false,
			}
		},
		methods: {
			// 签到时触发
			signin_fun(res) {
				this.list.push(res.day)
				uni.showToast({
					title: "签到成功",
					icon: "none"
				})
			},
			// 补签成功时触发
			repair_fun(res) {
				this.list.push(res.day)
				uni.showToast({
					title: "补签成功",
					icon: "none"
				})
			},
			// 当月份改变时触发
			date_change(date) {
				// 更新当前日期
				this.date = date;
				// 更新签到列表
				let list = ["01", "02"];
				this.list = list;
			},
		}
	}
</script>

<style scoped>
	.footer {
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin: 40upx auto 0;
	}

	.footer .repair {
		margin: 20upx auto 0;
		padding: 20upx 50upx;
		border: 1px solid #ccc;
		border-radius: 10upx;
	}
</style>
