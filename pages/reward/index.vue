<template>
	<view class="conbox">
		<view class="container">
			<!-- 背景 -->
			<image src="/static/img/bg.png" class="cont" mode=""></image>
			<image src="/static/img/caidai.png" class="caidai" mode=""></image>
			<view class="header">
				<view class="header-title">
					<view class="left">
						次数： <text style="color: #E4431A;">{{chishu}}</text>
					</view>
					<view class="right" @click="getmyPrize">
						我的奖品 >
					</view>
				</view>
			</view>
			<view class="main">
				<view class="canvas-container">

					<view :animation="animationData" class="canvas-content" id="zhuanpano" style="">
					<!-- <view :animation="animationData" class="canvas-content" id="zhuanpano"  :style="[{transform:'rotate('+runDeg+')'}]"> -->
						<!-- <canvas class="canvas" canvas-id="canvas"></canvas> -->
						<view class="canvas-line">
							<view class="canvas-litem" v-for="(item,index1) in awardsList" :key="index1" :style="[{transform:'rotate('+item.lineTurn+')'}]"></view>
						</view>

						<view class="canvas-list">
							<view class="canvas-item" :style="[{zIndex:index2}]" v-for="(iteml,index2) in awardsList" :key="index2">
								<view class="canvas-item-text" :style="[{transform:'rotate('+iteml.turn+')'}]">
									<text>{{iteml.award}}</text>
									<image class="canvas-item-text-img" src="/static/img/xiaolian.png" v-if="iteml.type == 3"></image>
									<image class="canvas-item-text-img" src="/static/img/youhuiquan.png" v-if="iteml.type == 2"></image>
									<image class="canvas-item-text-img" src="/static/img/jingyan.png" v-if="iteml.type == 1"></image>
									<image class="canvas-item-text-img" src="/static/img/jifenimg.png" v-if="iteml.type == 0"></image>
								</view>
							</view>
						</view>
					</view>

					<view @tap="playReward" class="canvas-btn" v-bind:class="btnDisabled">开始 </view>
				</view>
			</view>
			<!-- 现金抽奖 -->
			<view class="typecheckbox">
				<view :class="mold==1?'left active':'left'" @click="choosetype(1)">
					幸运抽奖
				</view>
				<view :class="mold==2?'left active':'left' " @click="choosetype(2)">
					现金抽奖
				</view>
			</view>
			<!-- 规则 -->
			<view class="guize">
				<view class="title">
					规则说明
				</view>
				<view class="g_item">
					1.用户每天登录即送1次抽奖机会，分享好友则多赠1次机会
				</view>
				<view class="g_item">
					2.用户点击大转盘抽奖按钮，有积分和现金两种方式可参与抽奖，没抽一次消耗1次抽奖机会
				</view>
				<view class="g_item">
					3.用户获得的奖品，可在我的道具里查看
				</view>
			</view>
			<!-- 我的奖品 -->
			<view class="shadowbox" v-if="r_flg" @click="closeshadow">
				<view class="myrewards" @click.stop="openshadow">
					<view class="title">
						我的奖品
					</view>
					<view class="itembox">
						<view class="item" v-for="(items,i) in myPrizelist" :key="i">
							<text class="left">{{items.name}}</text>
							<text class="right">{{items.createtime}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				awardsConfig: {
					chance: true, //是否有抽奖机会
					lists: [], //奖品列表 
				},
				awardsList: {},
				animationData: {},
				btnDisabled: '',
				thanksarr: [], //存储谢谢参与的索引
				chishu: 0,
				mold: 1,
				r_flg: 0,
				myPrizelist:[]
			}
		},
		onLoad: function() {
			// 获取奖品列表
			this.initdata(this)
		},
		onReady: function(e) {

		},
		methods: {
			// 查看奖品
			getmyPrize(){
				var that = this
				that.requestFun('/api/Turntable/myPrize', {
					page: 1,
					num:1000
				}, 1).then(function(data) {
					data.lists.forEach(function(element,index){
						element.createtime=that.dateformat(element.createtime)
					})
					that.myPrizelist = data.lists

					that.r_flg=1
				})
			},
			openshadow(){
				this.r_flg=1
			},
			closeshadow(){
				this.r_flg=0
			},
			// 选择抽奖方式
			choosetype(val) {
				this.mold = val
				this.initdata(this)
			},
			// 初始化抽奖数据
			initdata:function(that){
				that.requestFun('/api/Turntable/integralLucky', {
					mold: that.mold
				}, 1).then(function(data) {
					that.awardsConfig = data
					that.chishu = data.luckdraw;
					// 获取奖品的个数
					let awarrlength = that.awardsConfig.lists.length
					// push 谢谢参与奖项
					for (var i = 0; i <= 3 * 2; i++) {
						if (i % 3 == 0) {
							that.thanksarr.push(i)
							that.awardsConfig.lists.splice(i, 0, {
								name: '谢谢参与',
								type: 0
							});
						}
					}
					// 为每一项追加index属性
					that.awardsConfig.lists.forEach(function(element, index) {
						element.index = index
					})
				
					// 画转盘
					that.drawAwardRoundel();
				})
			},
			//画抽奖圆盘  
			drawAwardRoundel: function() {
				// 拿到奖品列表
				var awards = this.awardsConfig.lists;
				var awardsList = [];
				// 每份奖品所占角度
				var turnNum = 1 / awards.length * 360; // 文字旋转 turn 值  
				// 奖项列表  
				for (var i = 0; i < awards.length; i++) {
					awardsList.push({
						turn: i * turnNum + 'deg', //每个奖品块旋转的角度
						lineTurn: i * turnNum + turnNum / 2 + 'deg', //奖品分割线的旋转角度
						award: awards[i].name, //奖品的名字,
						type: awards[i].type,
						id:awards[i].type,
					});
				}
				this.btnDisabled = this.chishu ? '' : 'disabled';
				this.awardsList = awardsList;
			},
			//发起抽奖  
			playReward: function() {
				var that = this
				
				// that.runDeg = 60*Math.random()
				if (this.chishu == 0) {
					uni.showToast({
						title: '抽奖次数已经用完',
						icon: 'none'
					})
					return
				}

				// 获取奖品
				that.requestFun('/api/Turntable/winningPrize', {
					mold: that.mold
				}, 1).then(function(data) {
					var awardIndex = 3
					that.awardsList.forEach(function(element, index) {
						if (element.award == data.name) {
							awardIndex = index
						}
					})
					//中奖index  
					var awardsNum = that.awardsConfig.lists;
					// var awardIndex = 1 || Math.round(Math.random() * (awardsNum.length - 1)); //随机数  
					var runNum = 4; //旋转8周  
					var duration = 4000; //时长  
				
					// 旋转角度  
					that.runDeg = that.runDeg || 0;
					let preDeg = that.runDeg
					that.runDeg = that.runDeg + (360 - that.runDeg % 360) + (360 * runNum - awardIndex * (360 / awardsNum.length)) +1
					//创建动画  
					if(process.env.VUE_APP_PLATFORM == 'h5'){
						// document.styleSheets[0]
						document.getElementById('zhuanpano').style='animation:rotate_before 4s 0ms ease forwards;'
						if(document.styleSheets[0].cssRules.length>0){
							Array.from(document.styleSheets[0].cssRules).forEach(function(element,index){
								if(element.name == 'rotate_before'){
									// 删除上次插入的动画
									document.styleSheets[0].deleteRule(index)
								}
							})
						}
						
						// console.log(document.styleSheets[0].cssRules)
						// console.log("@keyframes rotate_before{from{ transform: rotate("+preDeg+"deg); }to{ transform: rotate("+that.runDeg+"deg);}}")
						// 插入定义的动画
						document.styleSheets[0].insertRule("@keyframes rotate_before{from{ transform: rotate("+preDeg+"deg); }to{ transform: rotate("+that.runDeg+"deg);}}",8);
						
					}else{
						var animationRun = uni.createAnimation({
							duration: duration,
							timingFunction: 'ease'
						})
						animationRun.rotate(that.runDeg).step();
						that.animationData = animationRun.export();
					}
// 					// #ifndef H5
// 					console.log(document.styleSheets)
// 					document.getElementById('zhuanpano')
// 					// #endif
					that.btnDisabled = 'disabled';

					// 中奖提示  
					var awardsConfig = that.awardsConfig;
					var awardType = awardsConfig.lists[awardIndex].type;
					that.chishu = that.chishu - 1;
					if (awardType != 0) {
						setTimeout(function() {
							uni.showModal({
								title: '恭喜',
								content: '获得' + (awardsConfig.lists[awardIndex].name),
								showCancel: false,
								success:function(){
									// 置空style  否则动画不生效
									setTimeout(function(){
										document.getElementById('zhuanpano').style=''
									},1000)
								}
							});
							that.btnDisabled = '';
						}.bind(that), duration);
					} else {
						setTimeout(function() {
							uni.showModal({
								title: '很遗憾',
								content: '没中奖 ' + (awardsConfig.lists[awardIndex].name),
								showCancel: false,
								success:function(){
									// 置空style  否则动画不生效
									setTimeout(function(){
										document.getElementById('zhuanpano').style=''
									},1000)
								}
							});
							that.btnDisabled = '';
						}.bind(that), duration);
					}
					
				})

			},

		}

	}
</script>
<style scoped>
	.conbox {
		width: 750upx;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.container,
	image.cont {
		width: 750upx;
		min-height: 100vh;
		height: auto;
		position: relative;
	}

	image.cont {
		height: 100%;
		position: absolute;
		z-index: 0;
	}

	image.caidai {
		position: absolute;
		top: 0;
		left: 0;
		width: 750upx;
		height: 1024upx;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* height: 246upx; */
		padding-top: 48upx;
		padding-bottom: 40upx;
		box-sizing: border-box;
		position: relative;
		z-index: 3;
	}

	.header-title {
		width: 100%;
		height: 60upx;
		display: flex;
		align-items: center;
		padding: 0 48upx;
		box-sizing: border-box;
		justify-content: space-between;
	}

	.header-title>view {
		padding: 8upx 16upx;
		border: 1px solid #d89720;
		color: #d89720;
		font-size: 28upx;
		border-radius: 26upx;
	}

	/* 转盘 */
	.canvas-container {
		margin: 0 auto;
		position: relative;
		width: 600upx;
		height: 600upx;
		background: url(/static/img/circle.png) no-repeat;
		background-size: cover;
		border-radius: 50%;
	}

	.canvas {
		width: 100%;
		height: 100%;
		display: block !important;
		border-radius: 50%;
	}

	.canvas-content {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		display: block;
		width: 600upx;
		height: 600upx;
		border-radius: inherit;
		/* background-clip: padding-box; */
		/* background-color: #ffcb3f; */
	}

	.canvas-element {
		position: relative;
		z-index: 1;
		width: inherit;
		height: inherit;
		border-radius: 50%;
	}

	.canvas-list {
		position: absolute;
		left: 0;
		top: 0;
		width: inherit;
		height: inherit;
		z-index: 9999;
	}

	.canvas-item {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		color: #e4370e;
		/* text-shadow: 0 1upx 1upx rgba(255, 255, 255, 0.6); */
	}

	.canvas-item-text {
		position: relative;
		display: block;
		padding-top: 46upx;
		margin: 0 auto;
		text-align: center;
		-webkit-transform-origin: 50% 300upx;
		transform-origin: 50% 300upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #FB778B;
	}

	.canvas-item-text text {
		font-size: 30upx;
	}

	.canvas-item-text-img {
		width: 50upx;
		height: 50upx;
		padding-top: 30upx;
	}

	/* 分隔线 */
	.canvas-line {
		position: absolute;
		left: 0;
		top: 0;
		width: inherit;
		height: inherit;
		z-index: 99;
	}

	.canvas-litem {
		position: absolute;
		left: 300upx;
		top: 0;
		width: 3upx;
		height: 300upx;
		background-color: rgba(228, 55, 14, 0.4);
		overflow: hidden;
		-webkit-transform-origin: 50% 300upx;
		transform-origin: 50% 300upx;
	}

	/**  
* 抽奖按钮  
*/
	.canvas-btn {
		position: absolute;
		left: 260upx;
		top: 260upx;
		z-index: 400;
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		color: #f4e9cc;
		background-color: #e44025;
		line-height: 80upx;
		text-align: center;
		font-size: 26upx;
		text-shadow: 0 -1px 1px rgba(0, 0, 0, 0.6);
		box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
		text-decoration: none;
	}

	.canvas-btn::after {
		position: absolute;
		display: block;
		content: ' ';
		left: 12upx;
		top: -44upx;
		width: 0;
		height: 0;
		overflow: hidden;
		border-width: 30upx;
		border-style: solid;
		border-color: transparent;
		border-bottom-color: #e44025;
	}

	.canvas-btn.disabled {
		pointer-events: none;
		background: #b07a7b;
		color: #ccc;
	}

	.canvas-btn.disabled::after {
		border-bottom-color: #b07a7b;
	}

	.canvas-btn-table {
		color: #A83FDB;
		width: 120upx;
		text-align: center;
		position: absolute;
		left: 240upx;
		top: 360upx;
		font-size: 26upx;
		background-color: #FFFFFF;
		opacity: 0.9;
	}

	.typecheckbox {
		width: 100%;
		position: relative;
		z-index: 3;
		display: flex;
		justify-content: space-between;
		padding: 20upx;
		box-sizing: border-box;
		color: #fff;
		font-size: 28upx;
		top: -120upx;
		flex-direction: column;
		height: 180upx;
		align-items: flex-end;
		/* padding-top: 46upx; */
	}

	.typecheckbox view {
		border: 1px solid #FF3637;
		background: transparent;
		color: #FF3637;
		display: flex;
		height: 60upx;
		width: 140upx;
		border-radius: 50upx;
		align-items: center;
		justify-content: center;
		display: flex;
		margin-left: 20upx;
	}

	.typecheckbox view.active {
		background: #FF3637;
		color: #fff;
	}

	.guize {
		width: 502upx;
		min-height: 300upx;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 3;
		background-image: linear-gradient(-180deg, #F48549 0%, #F2642E 100%);
		border: 18upx solid #E4431A;
		border-radius: 16px;
		margin: 0 auto;
		margin-top: -104upx;
		padding: 48upx;
		/* box-sizing: border-box; */
		color: #fff;
	}

	.guize .title {
		text-align: center;
		margin-bottom: 28upx;
	}

	.guize .g_item {
		font-family: PingFang-SC-Medium;
		font-size: 24upx;
		color: #FFFFFF;
		letter-spacing: 0.5px;
		text-align: justify;
		line-height: 20px;
	}

	.shadowbox {
		width: 750upx;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
		background: rgba(0, 0, 0, .6);
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.myrewards {
		width: 600upx;
		min-height: 80upx;
		background: #FFEEDF;
		border: 10upx solid #F2692F;
		color: #333;
		font-size: 24upx;
		font-family: PingFang-SC-Medium;
		border-radius: 40upx;
		padding-bottom: 20upx;
	}

	.myrewards .title {
		font-family: PingFang-SC-Bold;
		font-size: 16px;
		color: #E4431A;
		letter-spacing: 0.57px;
		display: flex;
		padding-top: 36upx;
		justify-content: center;
	}

	.myrewards .itembox {

		max-height: 320upx;
		overflow-y: auto;
	}

	.myrewards .item {
		width: 100%;
		height: 66upx;
		padding: 0 32upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
