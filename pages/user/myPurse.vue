<template>
	<view class="conten">
		<view class="conten-top">
			<view class="conten-top-title">
				<text>{{money/100}}</text>
			</view>
			<view class="conten-top-text">
				<text>可提现金额</text>
			</view>
		</view>
		<view class="detail" @click="goDetail">
			<text>提现明细</text>
			<view class="detailedRight">
				<image src="http://rs.eonfox.cc/clzy/static/Arrow_right02.png" class="detailedRightImg"></image>
			</view>
		</view>
		<view class="withdrawDeposit" v-show="!display">
			<view class="withdrawDeposit-title">
				<text>请输入提现金额</text>
			</view>
			<text class="abposin">￥</text>
			<view class="withdrawDeposit-box">
				<input type="digit"  v-model="moneyTx" placeholder="此处金额在100~10000间且每日提现不能超过三次"/>
			</view>
			<view class="withdrawDeposit-text">
				<text>请选择提现账户</text>
			</view>
			
		</view>
		 <view class="BopBox" v-show="display">
			<view class="informationBox">
				<view class="infor-title">
					<text>支付宝账号:</text>
				</view>
				<view class="infor-input">
					<input type="text" value="" @input="inpID" :placeholder="ID" />
				</view>
			</view>
			<view class="informationBox">
				<view class="infor-title">
					<text>真实姓名:</text>
				</view>
				<view class="infor-input">
					<input type="text" value="" @input="inpName"  :placeholder="name"/>
				</view>
			</view>
			<view class="affirmBut">
				<button type="primary" @click="next()">确认</button>
			</view>				
		</view>
		<!-- <view class="payw">
			<image src="http://rs.eonfox.cc/clzy/static/ali_pay.png" mode=""></image>
			<text class="txt" @click="payAli">支付宝</text>
			<text style="float: right; padding-right:40upx;color: #598fc7;" @click="addpayAli">添加支付宝账号信息</text>
		</view>
		<view class="pay" @click="payWx">
			<image src="http://rs.eonfox.cc/clzy/static/wechat.png" mode=""></image>
			<text class="txt">微信</text>
		</view> -->
         <view style="float:left;" v-show="!display">
			    <view class="payw">
			     	<image src="http://rs.eonfox.cc/clzy/static/ali_pay.png" mode=""></image>
			     	<text class="txt" @click="popBox">支付宝</text>  <!-- @click="payAli" -->
					 <label class="radio"><radio value="r1" :checked="choice"  @click="xz('z')"/></label>
			    </view>
               <view class="pay">
				   <image src="http://rs.eonfox.cc/clzy/static/wechat.png" mode="" ></image>
				   <text class="txt">微信</text>
               	<label class="radio"><radio value="r2" :checked="!choice"  @click="xz('w')" /></label>
               </view>
         </view>
		 <button class="confirm-btn" @click="WithdrawBut" v-show="!display">
		 	提现
		 </button>
	</view>
</template>

<script>
	import uniIcon from "@/components/uni-icon/uni-icon.vue"
	import fns from '@/components/eonfox/fns.js';
	import eonfox from '@/components/eonfox/eonfox.js';
	var ef = new eonfox();
	export default {
		data() {
			return {
				money:'0.00',
				moneyTx:'',
				Sofar:'',
				code:'',
				openid:'',
				ID:'',  //支付宝账号
				name:'', //支付宝真实姓名
				choice:true,
				display:false,
				isAuth:false
			};
		},
		onShow() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#ff5252',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
			this.moneyQuery();
			var that=this;
			ef.submit({
					request: {
						u:['USERSELFCONFIGALIPAY'],
						balance:['MERCHANTMONEYSELF'],
					},
					callback: function(data){
						console.log("用户支付宝信息",data);
						var ulist=fns.checkError(data,'u',function(errno,error){
							 uni.showToast({
							 	title:error,
								icon:'none'
							 })
						})
						if(ulist.balance){
							that.balance=ulist.balance
						}
						console.log("ulist.u",ulist.u.account);
						if(ulist.u.account){
							that.ID=ulist.u.account;
							that.name=ulist.u.realname;
							that.isAuth=true
						}
					
						console.log('ID',that.ID);
						console.log('name',that.name);
					},
					 error: function(err){
							 console.log("出错啦", err);
					},
				});
		},
		methods:{
			goDetail(){
				uni.navigateTo({
					url: '../../pagesA/transactionDetail/transactionDetail?method=user_money_earning'
				})
			},
			payAli(){
				var _this=this
				var money=_this.moneyTx*100
				ef.submit({
					request:{s:['APPLICATIONORDERSELFUSERMONEYEARNINGWITHDRAW',[{
						money_fen:money,
						withdraw_method:"alipay",
// 						// #ifdef MP-WEIXIN
// 						weixin_login_code:_this.code,
// 						weixin_trade_type:"JSAPI",
// 						// #endif
// 						// #ifdef APP-PLUS
// 						weixin_login_openid:"用户OpenID，当weixin_login_code参数不存在时需要",
// 						weixin_trade_type:"APP"
// 						// #endif
                       alipay_account:_this.ID,//支付宝账号
					   alipay_realname:_this.name,//真实姓名
					}]]},
					callback(data){
						console.log(data);
						var re=fns.checkError(data,'s',function(errno,error){
							uni.showToast({
								title:error,
								icon:'none'
							})
						})
					if(data.data.s.errno==0){
						uni.showToast({
							title:'提现成功',
							
						});
						setTimeout(function(){
							uni.navigateBack({
								url:'../../pages/me/me'
							})
						},2000);
					}
						
					},error(err){
						fns.err('调用提现错误',err,1)
					}
				})
			this.moneyQuery();
			},
			addpayAli(){
				uni.navigateTo({
					url: '../../pagesA/addpayAli/addpayAli'
				})
			},
			payWx(){
				var _this=this
				var money=_this.moneyTx*100
				console.log('提现金额',money);
				console.log('我的账户',_this.money);
				console.log(money<=0,money>_this.money);
				if(money<=0||money>_this.money||!/^\d+(\.\d+)?$/.test(money)){
					uni.showToast({
						title:'提现金额错误',
						icon:'none'
					})
				}else{
					// #ifdef MP-WEIXIN
					
					_this.wxMp()
					// #endif
					// #ifdef APP-PLUS
					_this.wxApp()
					// #endif
				}
			},
			wxMp(){
				var _this=this
				wx.login({
					//微信小程序登录获取code
					success(res) {
						_this.code = res.code;
						if (res.code) {
							//获取到code生成订单
							// 发起网络请求
							console.log('发起网络请求');
							_this.tiXian()
						} else {
							_this.isDisable = false;
							console.log('登录失败！' + res.errMsg)
							uni.showToast({
								title: '登录失败！' + res.errMsg,
								icon: 'none'
							})
						}
					}
				})
			},
			wxApp(){
				var _this=this
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
					  console.log('loginres:',typeof loginRes);
					  if (loginRes.errMsg=='login:ok') {
								// 获取用户信息
								uni.getUserInfo({
								  provider: 'weixin',
								  success: function (infoRes) {
									 console.log('info',JSON.stringify(infoRes.userInfo));
									 var openid=infoRes.userInfo.openId
									 _this.tiXian(openid)
									},
								  fail(err){
									 fns.err('err',err,1)
								  }
								});
							
					  }else{
						  fns.err('err','err',1)
					  }
				  },
				  fail(err) {
				  	fns.err('err','login',1)
				  }
				});
			},
			tiXian(openid){
				var _this=this
				var money=_this.moneyTx*100
				ef.submit({
					request:{s:['APPLICATIONORDERSELFUSERMONEYEARNINGWITHDRAW',[{
						money_fen:money,
						comment:"赠送收益提现",
						withdraw_method:"weixinpay",
						// #ifdef MP-WEIXIN
						weixin_login_code:_this.code,
						weixin_trade_type:"JSAPI",
						// #endif
						// #ifdef APP-PLUS
						weixin_login_openid:openid,
						weixin_trade_type:"APP"
						// #endif
					}]]},
					callback(data){
						var re=fns.checkError(data,'s',function(errno,error){
							fns.err('err',error)
						})
						if (data.data.s && data.data.s.data ){
							uni.showToast({
								title:'提现成功',
								success() {
									setTimeout(function(){
										uni.redirectTo({
											url:'../../pagesB/profit/profit'
										})
									},2000)
								}
							})
						}
						console.log('tixian',data);
					},error(err){
						fns.err('调用提现错误',err,1)
					}
				})
				
			},
			moneyQuery(){
				var _this=this
				ef.submit({
					request:{s:['USERMONEYSELFEARNING']},
					callback(data){
						console.log('我的预付款查询结果·',data);
						var re=fns.checkError(data,'s',function(errno,error){
							uni.showToast({
								title:error
							})
						})
						console.log('filter',re);
						if(re){
							_this.money=re.s
						}
					},
					error(err){
						fns.err('接口调用失败',err)
					}
				})
			},
			xz(fun){
				var that=this;
				if(fun=='z'){
					that.choice=true;
				}else{
					that.choice=false;
				}
		
			},
			popBox(){
				var that=this;
				that.display=!that.display;
			},
			inpID:function(event){
				var that=this;
				that.ID = event.detail.value;
			},
			inpName:function(event){
				var that=this;
				that.name = event.detail.value;
			},
			next(){
				var that=this;
				that.display=!that.display;
				ef.submit({
						request: {
							u:['USERSELFCONFIGALIPAY',[{account:that.ID,realname:that.name}]]
						},
						callback: function(data){
							console.log("用户支付宝信息",data);
							var ulist=fns.checkError(data,'u',function(errno,error){
								 uni.showToast({
								 	title:error,
									icon:'none'
								 })
							})
							if(ulist.u){
								uni.showToast({
									title:'保存成功',
									icon:'none',
									success() {
										that.isAuth=true
									}
								})	
							}
							
						},
						 error: function(err){
								 console.log("出错啦", err);
						},
					});
				},
		WithdrawBut(){
			console.log('点击提现按钮')
			var that=this;
			// true支付宝
// 			if(that.choice==true){
// 				that.payAli();
// 			}
// 			// false微信
			if(that.moneyTx<100){
				fns.err('提现金额必须大于等于100元');
				return
			}
// 			
			if(that.choice){
				console.log('提现支付宝',that.isAuth);
				
// 				if(!that.isAuth){
// 					uni.showToast({
// 						title:'请设置支付宝信息',
// 						icon:'none',
// 						success() {
// 							that.display=!that.display;
// 						}
// 					});
// 					return;
// 					
// 				}
				if(that.ID==""){
					 that.display=!that.display;
				}
				else{
					uni.showModal({
						title:'提示',
						content:'你是否要提现'+that.moneyTx+'元到'+that.ID+'账号',
						 success: function (res) {
                       if (res.confirm) {
                        that.payAli();
                       } else if (res.cancel) {
                        that.display=!that.display;
                      }
                     }
					})
				}
				
				
			}else{
				console.log('提现微信');
				that.payWx();
			}
		}
		//-----	
		}
	}
</script>

<style>
	.conten{
		width: 100%;
		height: 100%;
		
	}
	.conten-top{
		width: 100%;
		height: 250upx;
		background-color: #FF5252;
		padding-top: 80upx;
		color: #ffff;
	}
	.conten-top-text{
		width: 100%;
		height: 50upx;
		text-align: center;
		font-size:32upx;
		margin-top: 30upx;
	}
	.conten-top-text text{
		font-size:32upx;
		color:#FFFFFF;
	}
	.conten-top-title{
		width: 100%;
		height: 50upx;
		text-align: center;
		
	}
	.conten-top-title text{
		font-size:56upx;
		color:#FFFFFF;
	}
	.detail{
		float: left;
		width: 100%;
		height: 100upx;
		border-bottom:1px solid #dedbdb;
		line-height: 100upx;
		padding-left: 20upx;
		font-size: 32upx;
	}
	.withdrawDeposit{
		width: 100%;
		height: 300upx;
		font-size: 28upx;
		float: left;
	}
	.withdrawDeposit-title{
		width:90%;
		color: #666666;
		margin-left: 10%;
		line-height: 100upx;
		height: 100upx;
	}
	.withdrawDeposit-box{
		width: 90%;
		height: 70upx;
		background-color: #E8E8E8;
		margin-left: 10%;
		margin-top:10upx;
		line-height: 70upx;
	}
	.withdrawDeposit-text{
		width: 100%;
		height: 70upx;
		text-align: center;
		line-height: 70upx;
		margin-top: 30upx;
	}
	.payw{
		float: left;
		width: 100%;
		height: 100upx;
		border: 1px #DEDBDB solid;
		line-height: 100upx;
		font-size: 28upx;
		padding-left: 30upx;
	}
	.pay{
		float: left;
		width: 100%;
		height: 100upx;
		border-bottom: 1px #DEDBDB solid;
		line-height: 100upx;
		font-size: 28upx;
		padding-left: 30upx;
		margin-bottom: 80upx;
	}
	.abposin{
		position:absolute;
		width: 40upx;
		height: 40upx;
		margin-left: 15upx;
		font-size: 48upx;
		margin-top: 8upx;
	}
	image{
		width: 48upx;
		height: 48upx;
		margin: 20upx 20upx;
		float: left;
	}
	.txt{
		width: 510upx;
		height: 100upx;
		line-height: 100upx;
		float: left;
	}
	.radio{
		float: right;
		padding-right:50upx;
	}
	.confirm-btn{
		width :95%;
		height :55px;
		color: #fff;
        margin-left: 2.5%;
		background-color: #F8A0A0;
		border-radius :4px;
	}
	
	/* 弹出框样式 */
	.BopBox{
		width:100%;
		height: 400upx;
		position: absolute;
		background-color: #FFFFFF;
	}	
	
	.BopBox-title {
		width: 100%;
		height: 60upx;
		font-size: 32upx;
		text-align: center;
	}
	.informationBox{
		width:100%;
		padding: 5upx;
		height: 80upx;
		line-height: 80upx;
		border-bottom: #eee 1px solid;
		font-size:28upx;
	}
	.infor-title{
		float: left;
		width: 25%;
		height: 80upx;
		text-align: right;
	}
	.infor-input{
		padding-left: 10upx;
		width: 70%;
		height: 50upx;
		float: left;
	}
	.infor-input input{
		width: 100%;
		float: left;
		height: 80upx;
		line-height: 80upx;
	}
	.affirmBut{
		width: 95%;
		height: 60upx;
		margin-top: 80upx;
		margin-left: 2.5%;
	}
	.detailedRight{
		width :44px;
		position:relative;
		right :10px;
		top: 5px;
		float: right;
		text-align :right;
	}
		
		.detailedRightImg{
		  width: 20px;
		   height :20px;	
		}
			
		
</style>
