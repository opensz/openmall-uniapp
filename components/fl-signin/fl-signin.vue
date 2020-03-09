<template>
	<view id="fl_signin">
		<view class="header">
			<!-- 月份 -->
			<template v-if="choose_date">
				<view class="left" @click.stop="date_change('last')">
					<text>上月</text>
				</view>
				<view class="right false" v-if="is_today_date">
					<text>下月</text>
				</view>
				<view class="right" @click.stop="date_change('next')" v-else>
					<text>下月</text>
				</view>
			</template>
			<view class="center title">
				<text>{{year}}年{{get_month}}月</text>
			</view>
		</view>
		<view class="section">
			<!-- 周 -->
			<view class="weeks">
				<block v-for="(item,index) in weeks" :key="index">
					<view class="week_li">
						<text>{{item}}</text>
					</view>
				</block>
			</view>
			<view class="days">
				<block v-for="(item,index) in days" :key="index">
					<!-- 上月日期 -->
					<template v-if="index<first_index">
						<view class="day last_month">
							<text>{{item.day}}</text>
						</view>
					</template>
					<!-- 这月日期 -->
					<template v-else-if="index<last_index">
						<!-- 如果这月日期是今天的日期 -->
						<template v-if="is_today_date">
							<!-- 这月,今天之前 -->
							<template v-if="index<day_index">
								<template v-if="item.click">
									<view class="day true">
										<text>{{item.day}}</text>
										<text>已签</text>
									</view>
								</template>
								<template v-else-if="repair">
									<view class="day repair" @click.stop="repair_fun(item,index)">
										<text>{{item.day}}</text>
										<text>补签</text>
									</view>
								</template>
								<template v-else>
									<view class="day false">
										<text>{{item.day}}</text>
										<text>漏签</text>
									</view>
								</template>
							</template>
							<!-- 这月,今天 -->
							<template v-else-if="index==day_index">
								<template v-if="item.click">
									<view class="day true">
										<text>{{item.day}}</text>
										<text>已签</text>
									</view>
								</template>
								<template v-else>
									<view class="day today" @click.stop="signin_fun(item)">
										<text>{{item.day}}</text>
										<text>未签</text>
									</view>
								</template>
							</template>
							<!-- 这月,今天之后 -->
							<template v-else-if="index<last_index">
								<view class="day">
									<text>{{item.day}}</text>
								</view>
							</template>
						</template>
						<!-- 如果不是 -->
						<template v-else>
							<template v-if="item.click">
								<view class="day true">
									<text>{{item.day}}</text>
									<text>已签</text>
								</view>
							</template>
							<template v-else-if="repair">
								<view class="day repair" @click.stop="repair_fun(item,index)">
									<text>{{item.day}}</text>
									<text>补签</text>
								</view>
							</template>
							<template v-else>
								<view class="day false">
									<text>{{item.day}}</text>
									<text>漏签</text>
								</view>
							</template>
						</template>
					</template>
					<!-- 下月日期 -->
					<template v-else-if="index>=last_index">
						<view class="day next_month">
							<text>{{item.day}}</text>
						</view>
					</template>
				</block>
			</view>
		</view>
		<view class="footer">
			<view class="tip">
				<text>小提示：点击日期即可进行签到{{repair?"或补签":""}}哦。</text>
			</view>
			<view class="signin" v-if="is_today_date">
				<view class="btn false" v-if="days[day_index].click">
					<text>已签到</text>
				</view>
				<view class="btn true" @click.stop="signin_fun(days[day_index])" v-else>
					<text>签到</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			// 签到的日期列表
			list: {
				type: Array,
				default: Array
			},
			// 是否开启补签
			repair: {
				type: Boolean,
				default: false
			},
			// 是否开启补签规则
			rule: {
				type: Boolean,
				default: false
			},
			// 当前时间YYYY-MM
			date: {
				type: String,
				default: "",
			},
			// 是否可以选择日期
			choose_date: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// 年
				year: "",
				// 月
				month: "",
				// 日
				day: "",
				// 月份
				months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
				// 周
				weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周天"],

				// 当前日期是否就是今天的日期，默认不是
				is_today_date: false,
				// 当前的日期
				current_date: this.date,

				// 当前月第一天的下标
				first_index: 0,
				// 今天的下标
				day_index: "",
				// 当前月最后一天的下标
				last_index: 0,

				// 开启补签规则后，补签日期中的第一个日期
				repair_date: "",

				// 这个月的签到表数据
				days: [],
			};
		},
		created() {
			this.ready();
		},
		computed: {
			get_month() {
				return this.get_str(this.month + 1);
			},
		},
		watch: {
			// 签到列表更新时触发
			list(res) {
				this.current_date = this.date;
				this.ready();
			},
			// 当前日期改变时触发
			date(res) {
				this.current_date = res;
				this.ready();
			},
		},
		methods: {
			// 签到
			signin_fun(obj) {
				if (obj) {
					this.$emit('signin_fun', obj);
				} else {
					return this.days[this.day_index];
				}
			},
			// 补签
			repair_fun(obj) {
				// 是否开启补签规则
				if (this.rule) {
					// 如果选中的补签日期，是补签日期中的第一个日期
					if (this.repair_date == obj.year_month_day) {
						this.$emit('repair_fun', obj);
					} else {
						uni.showToast({
							title: "请按照顺序补签",
							icon: "none"
						})
					}
				} else {
					this.$emit('repair_fun', obj);
				}
			},
			// 日期改变时触发
			date_change(str) {
				let year = this.year,
					month = this.month + 1;
				if (str == "last") {
					if (month == 1) {
						year -= 1;
						month = 12;
					} else {
						month = this.get_str(month - 1);
					}
				} else {
					if (month == 12) {
						year += 1;
						month = "01";
					} else {
						month = this.get_str(month + 1);
					}
				}
				this.$emit('date_change', year + "-" + month);
			},
			// 准备
			ready() {
				let new_date = new Date(),
					// 今天的年
					year = new_date.getFullYear(),
					// 今天的月
					month = new_date.getMonth() + 1,
					// 今天的天
					day = new_date.getDate(),
					// 当前日期是否就是今天的日期，默认不是
					is_today_date = false,
					// 获取当前的日期
					current_date = this.current_date;
				// 判断当前的日期，如果没有，则为今天的日期
				if (current_date) {
					let arr = current_date.split('-');
					// 判断当前日期是否就是今天的日期
					if (arr[0] == year && arr[1] - 0 == month) {
						is_today_date = true;
						current_date = [arr[0], arr[1] - 0, day];
					} else {
						current_date = [arr[0], arr[1] - 0, 1];
					}
				} else {
					current_date = [year, month, day];
					is_today_date = true;
				}
				this.current_date = current_date;
				this.is_today_date = is_today_date;
				// 开始
				this.start();
			},
			// 开始
			start() {
				// 重置补签日期中的第一个日期
				this.repair_date = "";
				// 获取当前的日期
				let current_date = this.current_date;
				// 当前月的签到表数据
				let days = [],
					// 当前日期的时间对象
					new_date = new Date(current_date[0], current_date[1] - 1, current_date[2]),
					// 当前日期的年
					year = new_date.getFullYear(),
					// 当前日期的月
					month = new_date.getMonth(),
					// 当前日期的日
					day = new_date.getDate();
				// 记录当前日期的年月日
				this.year = year;
				this.month = month;
				this.day = day;
				// 判断这个月的第一天是周几
				let first_day = new Date(year, month, 1).getDay();
				// 如果是0,代表是星期天
				first_day = first_day ? first_day : 7;
				// 记录这个月第一天的下标
				this.first_index = first_day - 1;
				// 记录今天的下标
				this.day_index = this.first_index - 1 + day;
				//如果这个月的第一天不是周一，日历表上要显示上个月的部分日期
				if (first_day != 1) {
					// 上个月的天数
					let last_month_days;
					// 如果当前月不是第一月
					if (month) {
						last_month_days = new Date(year, month, 0).getDate();
					} else {
						last_month_days = 31;
					}
					days = this.get_arr(last_month_days - first_day + 2, last_month_days);
				}
				// 获取这个月的天数
				let month_days = new Date(year, month + 1, 0).getDate();
				days = days.concat(this.get_arr(1, month_days, true));
				// 判断这个月的最后一天是周几
				let last_day = new Date(year, month, month_days).getDay();
				// 记录这个月最后一天的下标
				this.last_index = this.first_index + month_days;
				// 如果这个月的最后一天不是周天
				if (last_day) {
					days = days.concat(this.get_arr(1, (7 - last_day)));
				}
				this.days = days;
			},
			// 获取字符串
			get_str(num) {
				num = num - 0;
				return num < 10 ? '0' + num : '' + num;
			},
			// 获取数组
			get_arr(start, end, br = false) {
				let arr = [],
					list = this.list;
				for (var i = start; i <= end; i++) {
					let day = this.get_str(i);
					if (br) {
						let month = this.get_str(this.month + 1);
						let month_day = month + "-" + day,
							year_month_day = this.year + "-" + month + "-" + day,
							click = false;
						if (list.length) {
							if (list.some((item) => {
									return item == day || item == month_day || item == year_month_day;
								})) {
								click = true;
							}
						}
						let obj = {
							day: day,
							month_day: month_day,
							year_month_day: year_month_day,
							click: click,
						};
						// 如果该天没有签到，并且没有记录补签第一天的日期
						if (!click && !this.repair_date) {
							// 记录补签第一天的日期
							this.repair_date = year_month_day;
						}
						arr.push({
							day: day,
							month_day: month_day,
							year_month_day: year_month_day,
							click: click,
						});
					} else {
						arr.push({
							day: day,
						})
					}
				}
				return arr;
			},
		},
	}
</script>
<style scoped>
	@import "./fl-signin.scss";
</style>
