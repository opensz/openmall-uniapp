<template>
	<view>
		<exam-widght :dataList='QuestionList' :index="index" @select='selectItem' @selectFinish='selectFinish' @finish='finish'>
		</exam-widght>
	</view>
</template>

<script>
	import examWidght from '@/components/Li-ExamWidght.vue';
	var _this;
	export default {
		components: {
			examWidght
		},
		data() {
			return {
				fldTestPaperID: undefined,
				fldTestRecordID: undefined,
				items: [],
				index: 0,
				QuestionList: [],
			}
		},
		onLoad(opt) {
			console.log(111)
			_this = this;
			_this.getTestPaper();
		},
		onUnload() {},
		methods: {
			finish(item) {
				console.log("-----finish------")
				console.log(item)
			},
			selectItem(item) {
				console.log("-----selectItem------")
				console.log(item)
			},
			selectFinish(item) {
				console.log("-----selectFinish------")
				console.log(item)
				item.index++
				let title = item.index + '/' + item.total

				if (item.question.questionType == 0)
					title += "  单选题";
				else if (item.question.questionType == 1)
					title += "  多选题";
				else
					title += "  填选题";
				uni.setNavigationBarTitle({
					title: title
				});
			},
			getTestPaper() {
				let data = require('../../static/data.json')  ;
				console.log(data.QuestionList)
				_this.QuestionList = data.QuestionList;
				if (_this.QuestionList.length > 0) {
					let title = '1/' + _this.QuestionList.length
					if (_this.QuestionList[0].questionType == 0)
						title += "  单选题";
					else if (_this.QuestionList[0].questionType == 1)
						title += "  多选题";
					else
						title += "  填空题";
					uni.setNavigationBarTitle({
						title: title
					});
				}
			}
		}
	}
</script>

<style>

</style>
