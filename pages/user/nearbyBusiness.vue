<template>
	<view class="content">
		<!-- 顶部搜索 -->
		<view class="getPosition">
			<image src="http://muyingshop.eonfox.com/icon/position.png" @click="openMap()" style="width: 50upx;height: 50upx;" mode=""></image>
			<text @click="toAddressList()">{{Address.details}}</text>
		</view>
		<!-- 头部 -->
		<view class="title-box">
			<view @click="scanCode()" class="scan">
				<image
					src="http://rs.eonfox.cc/clzy/static/scan-ico.png"
					mode=""
					style="width:40upx; height:40upx;  "
				></image>
			</view>
			<view class="input-box" @click="openSearch">
				<view style="float: left;">
					<image src="../../static/search.png" mode=""
					style="width:40upx; height:40upx; margin-left: 10upx; margin-right: 10upx; margin-top: 10upx; "
					></image>
				</view>
				<view style=" float:left; height:100%;"><input type="text" value="" placeholder="输入关键字搜索" class="input" /></view>
			</view>
		</view>
		
		<!-- <view class="topTitle">
			<view class="allStore">
				<view><image src="http://rs.eonfox.cc/clzy/static/star-ico.png" mode="" style="width:68upx;height:68upx;float:left;margin-right: -10upx;"></image></view>
			</view>
			<view class="discountStore">
				<text style="margin-right:20upx;">全部商家</text>
				<text>活动商家</text>
			</view>
		
			
		</view> -->
		<view class="classification">
			<view class="allClassification typeList" @click="gosort">
				<uni-icon type="bars" size="22" class="bars" color="8e8e8e"></uni-icon>
				<text>全部分类</text>
			</view>
			<view class="city typeList" @click="load">
				<uni-icon type="refreshempty" size="25" color="8e8e8e"></uni-icon>
				<text>加载全部</text>
			</view>
			
		</view>
		<!-- <view class="place" @click="load">
			<text>点击刷新</text>
			<uni-icon type="refreshempty" size="25" class="refreshempty" color="8e8e8e"></uni-icon>
		</view> -->
		
		<view class="shop-box">
		<view v-if="!sjnumber[0]" style="text-align: center; color:#5C5C5C; font-size: 30upx;">
			暂无商家记录
		</view>
		<view  class="shop" v-for="(item,index) in sjnumber" @click="gobrand" :data-Businessid="item.id" :key="index">
			<image :src="address+item.logo_img_id+'?imageView2/1/w/200/h/200'" mode="" class="image" width="100%" height="100%"></image>
			<view class="shopText">
				<text class="name">{{item.name}}</text>
				<view class="evaluate">
					<uni-icon type="star-filled" size="15" class="star-filled" color="8e8e8e"></uni-icon>
					<uni-icon type="star-filled" size="15" class="star-filled" color="8e8e8e"></uni-icon>
					<uni-icon type="star-filled" size="15" class="star-filled" color="8e8e8e"></uni-icon>
					<uni-icon type="star-filled" size="15" class="star-filled" color="8e8e8e"></uni-icon>
					<uni-icon type="star-filled" size="15" class="star-filled" color="8e8e8e"></uni-icon>
					<text class="garde" style="margin-right:10upx; color:#666666; ">{{item.comments}} </text>
				</view>
				<view class="bottomInformation">
					<text class="crux" style="margin-top: 30upx; color:#666666; overflow: hidden; display: inline-block; height: 40upx; text-overflow:ellipsis;">{{item.type_name}}</text>
					<text class="distance" style=" color:#666666;">{{item.distance}}</text>
					
				</view>
			</view>
		</view>
		<uni-load-more :loadingType="loadingType"  :contentText="contentrefresh"></uni-load-more>
	</view>
	<view class="mask" v-show="display" @click="Colse">
		
	</view>
	<view class="sortBox" v-show="display">
		<view class="sortBox-title" >
			<view >请选择商家类别</view> 
			<view @click="Colse">
				<uni-icon type="closeempty" size="30" ></uni-icon>
			</view> 
		</view>
		<view class="sortBoxBox" v-for="(items, index1) in Parent" :key='index1'>
			<view class="sortRight">
				<text   v-for="(item,index2) in items.son"  :key='index2' @click="sublevel(item.type_id)">{{item.name}}</text>
			</view>
		</view>
		
	</view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import uniIcon from "@/components/uni-icon/uni-icon.vue";
	import eonfox from '@/components/eonfox/eonfox.js';
	import fns from '@/components/eonfox/fns.js';
	import QQMapWX from '@/components/eonfox/qqmap-wx-jssdk.js';
	var qqmapsdk=new QQMapWX({
			key: '5XABZ-AQ764-SMHUQ-DABAC-R7E4H-37FM2'
		});
	// #ifdef H5
	let jweixin = require('jweixin-module');
	// #endif
	var ef = new eonfox();
	export default {
		data() {
			return {
				sjnumber:[],
				name:'',
				address:'',
				page:10,
				Longitude:"",
				Latitude:'',
				merchant:[],
				loadingType: 0,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				Parent:[],
				display:false,
				Address:'',//默认收货地址
				addressID:''//地址id
			};
		},
		components:{
			uniIcon,uniLoadMore
		},
        onShow: function () {
// 			this.page=1
			this.Latitude='',
			this.Longitude=''
			this.load();
	    },
		onLoad:function(){
			var that=this;
			// #ifdef APP-PLUS||MP-WEIXIN
			uni.getSetting({
				success(res) {
					if (!res.authSetting['scope.userLocation']) {
						uni.authorize({
							scope: 'scope.userLocation',
							success() {
								console.log('getLocation(near...)已同意授权');
								// 用户已经同意
							}
						})
					}else{
							console.log('getLocation(near...)已授权');
					}
				}						
			})
			// #endif
			
			
			
			if(that.sjnumber){
				that.load();
				console.log('第一次刷新')
			}
// 			if(that.merchant){
// 				setTimeout(function (){
// 				that.load();
// 				console.log('自动刷新')
// 			},1000);
// 			}
		},
	   onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;
			var _this=this;
			
			_this.page=_this.page+10;
			
			uni.showLoading({
				title:'正在加载',
				success() {
					ef.submit({
						request: {
							s: ['MERCHANTLIST',[{lon:_this.Longitude,lat:_this.Latitude,size:_this.page}]],
						},
						callback: function(data){
							var res=fns.checkError(data,'s',function(errno,error){
								fns.err(error)
							})
							console.log(res);
							// fns.success('数据加载完成',function(){
								if(res.s.data && res.s.data.length){
									// _this.merchant=res.s.data;
									_this.sjnumber=res.s.data; //获取商家数量
									if(res.s.row_count<10){
										_this.loadingType=2
										setTimeout(function () {
											uni.hideLoading();
										}, 1000);
									}
									
								else{
									 _this.loadingType=0
									 console.log('aa')
									 setTimeout(function () {
									 	uni.hideLoading();
									 }, 1000);
									
									}
									}
								else{
									_this.loadingType=2
									setTimeout(function () {
										uni.hideLoading();
									}, 1000);
									 console.log('bb')
								}
							// })
						},
						 error: function(err){
						         fns.err('加载失败',err,1)
						},
					});
				}
			})
	   },
		methods:{
			Colse(){
				this.display=!this.display;
			},
			toAddressList(){
				var type = "99"//不知道这个type有什么值，取大一点
				uni.navigateTo({
					url: '../../pagesA/address/address?type=' + type
				})
			},
			gobrand:function(e){
				console.log(e)
				// return
				var sjid=e.currentTarget.dataset.businessid;
				console.log("目标",sjid);
				uni.navigateTo({
					url:'../../pagesA/BusinessDetails/BusinessDetails?id='+sjid  
					// 参数的传递 newsid 
				});
			},
			gosort(){
				this.display=!this.display;
			},
			load(){
				var that=this;
				that.addressID=uni.getStorageSync('nearByBusinessAddressID')
				console.log('nearByAddressId222',that.addressID)
				var condition=''
				if(that.addressID){
					condition=[{id:that.addressID}]
				}
				uni.showLoading({
					title:'加载中',
					success() {
						ef.submit({
							request:{
								address:['USERADDRESSSELFGET',condition], // 收货地址
							},
							callback:function(data){
								var res = fns.checkError(data,'address',function(errno,error){
									fns.err(error)
								});
								console.log('默认收货地址',res.address)
								if(res.address){
									that.Address=res.address
									that.Longitude=res.address.longitude
									that.Latitude=res.address.latitude
									ef.submit({
										request: {
											config: ['APPLICATIONCONFIG'],
											s: ['MERCHANTLIST',[{lon:that.Longitude,lat:that.Latitude,size:that.page}]],
											lb:["APPLICATIONTYPEoption",[{"module":"merchant_type"}]],
										},
										callback: function(data){
											console.log('ss',data)
											var res = fns.checkError(data,'s',function(errno,error){
												fns.err(error)
											});
											if( !res ){
												return false;
											}
											console.log(res);
											if( res.lb ){
												that.Parent = res.lb;
												console.log('aa',that.Parent)
											}
											
											fns.success('数据加载完成',function(){
												if(res.s.data && res.s.data.length){
													// that.merchant=res.s.data;
													that.sjnumber=res.s.data; //获取商家数量
													that.address=res.config.qiniu_domain;//获取七牛的域名
													if(res.s.data.length<10){
														that.loadingType=2
													}else{
														that.loadingType=0
													}
												}else{
													that.loadingType=2
												}
												
											});
											
										},
										 error: function(err){
												 fns.err('加载失败',err,1)
										},
									});
								}
								else{
								// #ifdef APP-PLUS || MP-WEIXIN
								
								// #endif
								}
							},
							error(err){
								fns.err('err',err,1)
							}
						})
						// // #ifdef APP-PLUS || MP-WEIXIN
						// uni.getLocation({ 							
						//    type: 'wgs84',
						//    success: function (res){
						// 	   console.log('res:',res);
						// 	   uni.showLoading({
						// 		title:'获取地理位置',
						// 		success() {
						// 			that.Latitude=res.latitude;
						// 			that.Longitude=res.longitude;
						// 			ef.submit({
						// 				request: {
						// 					config: ['APPLICATIONCONFIG'],
						// 					s: ['MERCHANTLIST',[{lon:that.Longitude,lat:that.Latitude,size:that.page}]],
						// 					lb:["APPLICATIONTYPEoption",[{"module":"merchant_type"}]],
						// 				},
						// 				callback: function(data){
						// 					console.log('ss',data)
						// 					var res = fns.checkError(data,'s',function(errno,error){
						// 						fns.err(error)
						// 					});
						// 					if( !res ){
						// 						return false;
						// 					}
						// 					console.log(res);
						// 					if( res.lb ){
						// 						that.Parent = res.lb;
						// 						console.log('aa',that.Parent)
						// 					}
						// 					
						// 					fns.success('数据加载完成',function(){
						// 						if(res.s.data && res.s.data.length){
						// 							// that.merchant=res.s.data;
						// 							that.sjnumber=res.s.data; //获取商家数量
						// 							that.address=res.config.qiniu_domain;//获取七牛的域名
						// 							if(res.s.data.length<10){
						// 								that.loadingType=2
						// 							}else{
						// 								that.loadingType=0
						// 							}
						// 						}else{
						// 							that.loadingType=2
						// 						}
						// 						
						// 					});
						// 					
						// 				},
						// 				 error: function(err){
						// 						 fns.err('加载失败',err,1)
						// 				},
						// 			});
						// 		}
						// 	   })
						// 	},
						//  });
						//  // #endif
						//  
						//  // #ifdef H5
						//  jweixin.ready(function(){
						// 	 jweixin.getLocation({
						// 		type: 'wgs84',
						// 		success: function (res){
						// 		   console.log('res:',res);
						// 		   uni.showLoading({
						// 			title:'获取地理位置',
						// 			success() {
						// 				that.Latitude=res.latitude;
						// 				that.Longitude=res.longitude;
						// 				ef.submit({
						// 					request: {
						// 						config: ['APPLICATIONCONFIG'],
						// 						s: ['MERCHANTLIST',[{lon:that.Longitude,lat:that.Latitude,size:that.page}]],
						// 						lb:["APPLICATIONTYPEoption",[{"module":"merchant_type"}]],
						// 					},
						// 					callback: function(data){
						// 						console.log('ss',data)
						// 						var res = fns.checkError(data,'s',function(errno,error){
						// 							fns.err(error)
						// 						});
						// 						if( !res ){
						// 							return false;
						// 						}
						// 						console.log(res);
						// 						if( res.lb ){
						// 							that.Parent = res.lb;
						// 							console.log('aa',that.Parent)
						// 						}
						// 						
						// 						fns.success('数据加载完成',function(){
						// 							if(res.s.data && res.s.data.length){
						// 								// that.merchant=res.s.data;
						// 								that.sjnumber=res.s.data; //获取商家数量
						// 								that.address=res.config.qiniu_domain;//获取七牛的域名
						// 								if(res.s.data.length<10){
						// 									that.loadingType=2
						// 								}else{
						// 									that.loadingType=0
						// 								}
						// 							}else{
						// 								that.loadingType=2
						// 							}
						// 							
						// 						});
						// 						
						// 					},
						// 					 error: function(err){
						// 							 fns.err('加载失败',err,1)
						// 					},
						// 				});
						// 			}
						// 		   })
						// 		 },
						// 	  });
						// })
						//  // #endif
					}
				})
			},
			//点击查询商家分类
			sublevel(id){
				var that=this;
				that.display=!that.display
				ef.submit({
					request: {
						s:["MERCHANTLIST",[{lon:that.Longitude,lat:that.Latitude,search:{type_id:id}}]],  //子级
						},
						callback: function(data){
							var res=fns.checkError(data,'s',function(errno,error){
								fns.err(error)
							})
							
								that.sjnumber=data.data.s.data.data;
							
							console.log('分类',data);
						},
						error: function(err){
						         fns.err('加载失败',err,1)
						}
						});
			},
			
// 			next(){
// 						  var that=this;	
// 							ef.submit({
// 								request: {
// 									qiniu_domain: ['APPLICATIONCONFIGQINIUDOMAIN'],
// 									s: ['MERCHANTLIST',[{lon:that.Longitude,lat:that.Latitude,page:"all"}]],
// 								},
// 								callback: function(data){
// 									console.log(data);
// 									// that.merchant=data.data.s.data.data;
// 									that.sjnumber=data.data.s.data.data; //获取商家数量
// 									that.address=data.data.qiniu_domain.data;//获取七牛的域名
// 									if(data){
// 										setTimeout(function (){
// 											uni.showToast({
// 												title:'已刷新',
// 												icon:'none'
// 											})
// 										},2000);
// 										
// 									}
// 									
// 									
// 								},
// 								 error: function(err){
// 								         console.log("出错啦", err);
// 								},
// 							});
// 							
// 							
// 						   
// 						},
// 			place(){
// 				var that=this;
// 				uni.setStorage({
// 				key: 'merchant',
// 				data: that.merchant,
// 				success: function () { 
// 				console.log('商家信息',that.merchant);
// 				       }
// 				    });
// 			},
			
			//二维码
			scanCode(){
				var _this=this
				uni.showToast({
					// #ifdef APP-PLUS
					title:'这是APP',
					icon:'none',
					// #endif
					// #ifdef H5
					title:'这是H5',
					icon:'none',
					// #endif
					// #ifdef MP-WEIXIN
					title:'这是小程序',
					icon:'none',
					// #endif
					success(){
						setTimeout(function(){
							
						},1500)
					}
				})
				uni.scanCode({
					onlyFromCamera: true,
					success: function (res) {
						if(res.result){
							var data=JSON.parse(res.result);
							console.log('res:',data);
							if(!data.errno){
								if(data.type!='merchant_money_plus'){
									uni.showToast({
										title:'该二维码非收款二维码'
									})
								}else if(data.data.merchant_id){
									_this.merchant_id=data.data.merchant_id
									
									if(data.data && data.data.user_id){
										var user_id = data.data.user_id;
									}else{
										var user_id = '';
									}
									uni.navigateTo({
										url:'../../pagesB/payUser/payUser?mch_id='+data.data.merchant_id+'&user_id='+data.data.user_id
									})
								}else{
									uni.showToast({
										title:'扫码失败',
										icon:'none'
									})
								}
							}else{
								uni.showToast({
									title:data.error,
									icon:'none'
								})
							}
						}
					}
				});
			}
			
		}
	}
	
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
	.content
		width 100%
		overflow hidden
		
		.title-box
			display flex
			justify-content center // 水平居中
			align-items center // 垂直居中
			flex-direction row//左到右
			width 710upx
			padding 0 20upx
			height 100upx
			.scan
				width 40upx
				height 40upx
			.input-box
				margin-left 20upx
				width 650upx
				height 58upx
				border 1upx solid #d3d3d3
				.search
					display inline-block
					position absolute
					top 0
					left 0
				.input
					width 80%
					display inline-block
					font-size 28upx
					text-align left
					line-height 100%
					height 100%
			.chat
				flex 1
		.topTitle
			width 100%
			height 80upx
			display flex
			align-items center   // 垂直居中
			flex-direction row
			padding 0 20upx
			color #333
			font-size 30upx
			.allStore
				vertical-align middle
				line-height 80upx
				color #e7313a
			.discountStore
				line-height 100upx
				padding-left 20upx
			.leftBox
				width 300upx
				text-align right
		.classification	
			height 80upx
			display flex
			align-items center   
			justify-content center// 垂直居中
			flex-direction row
			font-size 28upx
			.typeList
				text-align center
				line-height 80upx
				border 1px solid #d3d3d3
				width 50%
				height 100%
		.place
			font-size 30upx
			height 100upx
			text-align left
			line-height 100upx
			border-bottom 1px solid #d3d3d3
			padding-left 20px
		.shop-box
		     width 100%
			 height auto
		.shop
			height 200upx
			border-bottom 1px solid #d3d3d3
			display flex
			align-items center   
			justify-content flex-start
			flex-direction row
		
			.image
				width 180upx
				height 180upx
				margin-left 15upx
				border-radius 15upx
			.shopText
				width 500upx
				height 220upx
				margin-left 25upx
				padding-top 20upx
				
				.name
					color #333
					font-weight 600
					font-size 30upx
					width 100%
					height 30px
					
				.evaluate
					font-size 20upx
					margin-top 20upx
				.bottomInformation
					align-items center   
					justify-content space-between
					flex-direction row
					width 100%
					color #333
					font-size 28upx
					.crux
						width 240upx
						display inline-block
					.distance
						width calc(100% - 250upx)
						float right
						text-align right
						margin-top 30upx
				    .icoimg
					width 48upx
					height 48upx
			
</style>
<style>
	.sortBox{
		position: fixed;
		width :650upx;
		height: auto;
		padding-top :20upx;
		padding-bottom:40upx;
		top :25vh;
		background-color: #FFFFFF;
		margin-left: 50upx;
		font-size: 28upx;
		border: #E3E3E3 solid 3upx;
		border-radius: 25upx;
		z-index: 1000;
	}
	.sortBox-title{
		width:610upx;
		padding: 20upx 20upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.mask {  
		position: fixed;  
		top:0;  
		left:0;  
		z-index:4;  
		width:100%;  
		height:100vh;  
		background:rgba(0,0,0,0.4);  
	}  
	.sortBoxBox{
		width:610upx;
		padding: 20upx 20upx;
		display: flex;
		flex-wrap: wrap;
	}
	.sortRight{
		width:auto;
		padding-bottom: 20upx;
		height: auto;
	}
	.sortRight text{
		padding:10upx;
		border: #CCCCCC solid 1upx;
		border-radius: 10upx;
		color:#DD524D;
		margin-left: 20upx;
		float: left;
		margin-bottom: 10upx;
	}
	.getPosition{
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
		background-color: #FFF;
	}
</style>
