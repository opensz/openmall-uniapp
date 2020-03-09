<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">欢迎回来！</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" v-model="username" placeholder="请输入手机号码" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" placeholder="请输入密码" v-model="password" @confirm="toLogin" />
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
			<view class="forget-section">忘记密码?</view>
			<!-- #ifdef APP-PLUS -->
			<button class="confirm-btn" @click="appLogin">APP微信授权登录</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button class="confirm-btn" open-type="getUserInfo" @getuserinfo="wxGetUserInfo" withCredentials="true">微信登录</button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<button type="primary" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">微信登录</button>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<button type="primary" open-type="getUserInfo" @click="getuserinfoh5appwx" withCredentials="true">微信登录</button>
			<!-- #endif -->
		</view>
		<view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import Api from '@/common/api';
import store from '@/store/index';
export default {
	data() {
		return {
			username: '13146587722',
			password: '123456',
			logining: false
		};
	},
	onLoad() {},

	methods: {
		...mapMutations(['login']),
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		navBack() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		toRegist() {
			uni.navigateTo({
				url: '/pages/public/reg'
			});
		},
		wxGetUserInfo: function(res) {
			if (!res.detail.iv) {
				uni.showToast({
					title: '您取消了授权,登录失败',
					icon: 'none'
				});
				return false;
			}
			// this.login(res.detail.rawData);
			const that = this;
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					wx.request({
						url: Api.BASEURI + Api.index.appletLogin_by_weixin,
						data: {
							code: loginRes.code,
							userInfo: res.detail.rawData,
							cloudID: res.detail.cloudID,
							encrypted_data: res.detail.encryptedData,
							iv: res.detail.iv,
							type: 1,
							signature: res.detail.signature
						},
						method: 'post',
						success: function(info) {
							console.log(info.data.data);
							that.login(info.data.data);
							uni.switchTab({
								url: '/pages/index/index'
							});
						},
						fail: function(e) {
							console.log(e);
						}
					});
				}
			});
		},
		appLogin: function() {
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					console.log(res.provider);
					//支持微信、qq和微博等
					if (~res.provider.indexOf('weixin')) {
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								console.log('-------获取openid(unionid)-----');
								console.log(JSON.stringify(loginRes));
								// 获取用户信息
								uni.getUserInfo({
									provider: 'weixin',
									success: function(infoRes) {
										console.log('-------获取微信用户所有-----');
										console.log(JSON.stringify(infoRes.userInfo));
									}
								});
							}
						});
					}
				}
			});
		},
		async toLogin() {
			let phoneReg = /^1[1-9][0-9]\d{8}$/;
			try {
				if (this.username == '') {
					throw '请填写手机号';
				}
				if (!phoneReg.test(this.username)) {
					throw '手机号格式有误';
				}
				if (this.password == '') {
					throw '请填写密码';
				}
			} catch (err) {
				this.$api.msg(err);
				return;
			}
			this.logining = true;
			let params = { username: this.username, password: this.password };
			let data = await Api.apiCall('post', Api.index.login, params);
			this.logining = false;
			console.log(data);
			if (data) {
				uni.setStorageSync('userToken', data);
				let params = { username: this.username };
				let data1 = await Api.apiCall('get', Api.member.memberDetail, params);

				uni.setStorageSync('userInfo', data1);
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		},
		getuserinfoh5appwx: function() {
			uni.login({
				success: function(res2) {
					console.log(JSON.stringify(res2) + '2');
					uni.getUserInfo({
						success: function(res3) {
							console.log(JSON.stringify(res3) + '3');
						}
					});
				}
			});
		},
		getuserinfo: function(res1) {
			console.log(JSON.stringify(res1) + '1');
			//如果只需要opendid 和非加密数据至此登录完成
			//此处连接数据库利用openid 就可以进行登录环节
			//免费的视频教程 http://www.hcoder.net/tutorials/info_141.html
			uni.login({
				success: function(res2) {
					console.log(JSON.stringify(res2) + '2');
					//获取 sessionKey
					uni.request({
						url: 'https:///hoa.hcoder.net/xcxencode/?c=sk&appid=wxbb7f9f1f2c6f4f33&secret=739b970b832f0df158f54c494a08e440&code=' + res2.code,
						success: function(res3) {
							console.log(JSON.stringify(res3) + '3');
							//记录到本地
							try {
								uni.setStorageSync('sk', res3.data.session_key);
								uni.setStorageSync('openid', res3.data.openid);
							} catch (e) {
								//TODO handle the exception
							}
							uni.hideLoading();
							//以下步骤可以获取加密信息，需要授权
							//获取加密信息
							if (!res1.detail.iv) {
								uni.showToast({
									title: '您取消了授权,登录失败',
									icon: 'none'
								});
								return false;
							}
							try {
								var sessionKey = uni.getStorageSync('sk');
								console.log(sessionKey);
							} catch (e) {
								//TODO handle the exception
							}
							uni.request({
								/**
        * $appid         = $_POST['appid'];
         $sessionKey    = $_POST['sessionKey'];
         $encryptedData = $_POST['encryptedData'];
         $iv            = $_POST['iv'];
        */
								method: 'POST',
								url: 'https:///hoa.hcoder.net/xcxencode/',
								header: { 'content-type': 'application/x-www-form-urlencoded' },
								data: {
									appid: 'wxbb7f9f1f2c6f4f33',
									sessionKey: sessionKey,
									iv: res1.detail.iv,
									encryptedData: res1.detail.encryptedData
								},
								success: function(res4) {
									//"﻿﻿﻿{"openId":"oS6of0V0rdp9nY_BuvCnQUasOHYc","nickName":"深海",
									//"gender":1,"language":"zh_CN","city":"Xi'an","province":"Shaanxi",
									//"country":"China","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/7iags6YD4enyU"
									console.log(JSON.stringify(res4) + '4');
									//至此登录完成
								}
							});
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}
.container {
	padding-top: 115px;
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #fff;
}
.wrapper {
	position: relative;
	z-index: 90;
	background: #fff;
	padding-bottom: 40upx;
}
.back-btn {
	position: absolute;
	left: 40upx;
	z-index: 9999;
	padding-top: var(--status-bar-height);
	top: 40upx;
	font-size: 40upx;
	color: $font-color-dark;
}
.left-top-sign {
	font-size: 120upx;
	color: $page-color-base;
	position: relative;
	left: -16upx;
}
.right-top-sign {
	position: absolute;
	top: 80upx;
	right: -30upx;
	z-index: 95;
	&:before,
	&:after {
		display: block;
		content: '';
		width: 400upx;
		height: 80upx;
		background: #b4f3e2;
	}
	&:before {
		transform: rotate(50deg);
		border-radius: 0 50px 0 0;
	}
	&:after {
		position: absolute;
		right: -198upx;
		top: 0;
		transform: rotate(-50deg);
		border-radius: 50px 0 0 0;
		/* background: pink; */
	}
}
.left-bottom-sign {
	position: absolute;
	left: -270upx;
	bottom: -320upx;
	border: 100upx solid #d0d1fd;
	border-radius: 50%;
	padding: 180upx;
}
.welcome {
	position: relative;
	left: 50upx;
	top: -90upx;
	font-size: 46upx;
	color: #555;
	text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
	padding: 0 60upx;
}
.input-item {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding: 0 30upx;
	background: $page-color-light;
	height: 120upx;
	border-radius: 4px;
	margin-bottom: 50upx;
	&:last-child {
		margin-bottom: 0;
	}
	.tit {
		height: 50upx;
		line-height: 56upx;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
	}
	input {
		height: 60upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		width: 100%;
	}
}

.confirm-btn {
	width: 630upx;
	height: 76upx;
	line-height: 76upx;
	border-radius: 50px;
	margin-top: 70upx;
	background: $uni-color-primary;
	color: #fff;
	font-size: $font-lg;
	&:after {
		border-radius: 100px;
	}
}
.forget-section {
	font-size: $font-sm + 2upx;
	color: $font-color-spec;
	text-align: center;
	margin-top: 40upx;
}
.register-section {
	position: absolute;
	left: 0;
	bottom: 50upx;
	width: 100%;
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	text-align: center;
	text {
		color: $font-color-spec;
		margin-left: 10upx;
	}
}
</style>
