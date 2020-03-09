import store from '../store/index';
export default {

	//  BASEURI:'http://www.yjlive.cn:8085/api/',
	BASEURI: 'http://localhost:8080/',
	ESURI: 'http://localhost:8085/',

	es: {
		searchList: 'search',
	},
	/**
	 * 接口名称
	 */
	index: {
		submitLocaltion:'single/home/submitLocaltion',
		login: 'api-uaa/oauth/user/ums/token',
		appletLogin_by_weixin: 'applet/login_by_weixin', // 登录(手机号:phone 密码:password)
		currentUser: "api-uaa/oauth/member/userinfo",
		simpleReg: 'api-uaa/oauth/user/reg/token', // 登录(手机号:phone 密码:password)

		updatePassword: 'notAuth/home/updatePassword',
		loginByCode: 'notAuth/home/loginByCode', // 手机和验证码登录
		reg: 'notAuth/home/reg', // 注册
		sendCodes: 'notAuth/home/sms/codes', // 获取验证码
	},
	member: {
		memberDetail: 'api-member/notAuth/member/detail', // 查询商品详情信息username
		schoolList: 'api-member/notAuth/user/school/list', // 查询学校列表
		getAreaByPid: 'api-member/notAuth/user/getAreaByPid', // 根据pid查询区域
		bindSchool: 'api-member/notAuth/user/bindSchool', // 会员绑定学校
		bindArea: 'api-member/notAuth/user/bindArea', // 会员绑定区域

	},
	goods: {
		storeList: 'api-goods/notAuth/store/list', // 查询学校列表
		storeDetail: 'api-goods/notAuth/storeDetail', // 查询拼团商品详情信息
		schoolList: 'api-goods/notAuth/school/list', // 查询学校列表
		schoolDetail: 'api-goods/notAuth/schoolDetail', // 查询拼团商品详情信息
		groupGoodsDetail: 'api-goods/notAuth/goodsGroup/detail', // 查询拼团商品详情信息
		groupGoodsList: 'api-goods/notAuth/groupGoods/list', // 查询拼团商品列表
		groupHotGoodsList: 'api-goods/notAuth/groupHotGoods/list', // 查询生效拼团商品列表
		giftDetail: 'api-goods/notAuth/gift/detail', // 查询商品详情信息
		giftList: 'api-goods/notAuth/gift/list', // 查询商品列表
		typeGiftList: 'api-goods/notAuth/typeGiftList', //查询商品类型下的商品列表

		addView: 'api-goods/auth/addView', // 查询商品详情信息
		viewList: 'api-goods/auth/viewList', // 查询商品列表

		home: 'api-goods/notAuth/content',
		goodsDetail: 'api-goods/notAuth/goods/detail', // 查询商品详情信息
		goodsList: 'api-goods/notAuth/goods/list', // 查询商品列表
		categoryList: 'api-goods/notAuth/productCategory/list', // 查询商品分类列表
		createGoods: 'api-goods/notAuth/createGoods', //创建商品
		brandList: 'api-goods/notAuth/brand/list', // 根据条件查询所有品牌表列表
		consultList: 'api-goods/notAuth/consult/list', // 取某个商品的评价
		categoryAndGoodsList: 'api-goods/notAuth/categoryAndGoodsList/list', // 查询商品分类列表(带商品)
		typeGoodsList: 'api-goods/notAuth/typeGoodsList', //查询商品类型下的商品列表
		typeList: 'api-goods/notAuth/typeList', //查询商品类型下的商品列表

		recommendBrand: 'api-goods/notAuth/pms/recommendBrand/list', // 查询首页推荐品牌
		newProductList: 'api-goods/notAuth/pms/newProductList/list', //查询首页新品
		hotProductList: 'api-goods/notAuth/pms/hotProductList/list', // 查询热销商品
		listCollect: 'api-goods/collection/listCollect', // 显示关注列表
		deleteCollect: 'api-goods/collection/delete', // 删除收藏中的某个商品
		favoriteSave: 'api-goods/collection/favoriteSave', // 添加/商品收藏

		secskillDetail: 'api-goods/notAuth/pms/secskill/detail', // 查询秒杀商品详情信息
		paiMaiDetail: 'api-goods/notAuth/pms/paimai/detail', // 查询商品详情信息
		updatePaiMai: 'api-goods/notAuth/pms/updatePaiMai', // 参与竞价
	},
	order: {
		addGroup: 'api-order/auth/addGroup', // 发起拼团
		acceptGroup: 'api-order/auth/acceptGroup', // 提交拼团

		orderList: 'api-order/auth/order/list', // 查询订单列表
		orderDetail: 'api-order/auth/detail', // 查询订单列表

		preOrder: 'api-order/auth/submitPreview', // 预览订单
		bookOrder: 'api-order/auth/generateOrder', //  生成订单
		addCart: 'api-order/auth/addCart', // 添加商品到购物车
		cartList: 'api-order/auth/cartList', // 获取某个会员的购物车列表
		promotionCartList: 'api-order/auth/cart/list/promotion', // 获取某个会员的购物车列表,包括促销信息
		updateQuantity: 'api-order/cart/update/quantity', //修改购物车中某个商品的数量
		deleteCart: 'api-order/auth/delete', // 删除购物车中的某个商品
		clearCart: 'api-order/auth/clear', // 清空购物车

		listAddress: 'api-order/auth/listAddress', // 显示所有收货地址
		deleteAddress: 'api-order/auth/deleteAddress', // 删除
		addressSave: 'api-order/auth/saveAddress', // 添加
		setDefaultAddress: 'api-order/auth/address-set-default', // 设为默认地址


		balancePay: 'api-order/api/pay/balancePay', // 余额支付
		weixinAppletPay: 'api-order/api/pay/weixinAppletPay', // 微信小程序支付


		preGroupActivityOrder: 'api-order/auth/preGroupActivityOrder', // 预览订单团购
		jifenPay: 'api-order/api/pay/jifenPay', // 余额支付

		applyRefund:'api-order/auth/applyRefund',
		paymentlist: 'api-order/api/pay/paymentlist', // 查询订单列表
		allPay: 'api-order/api/pay/allPay', // 支付宝支付
		//支付宝
		aliAppPay: 'api-order/api/aliPay/appPay', // 支付宝app支付
		aliWapPay: 'api-order/api/aliPay/wapPay', // 支付宝支付
		wapPayNoSdk: 'api-order/api/aliPay/wapPayNoSdk', // 支付宝支付
		pcPay: 'api-order/api/aliPay/pcPay', // 支付宝支付
		aliPay: 'api-order/api/aliPay/tradePay', // 支付宝支付 String authCode,  String scene
		aliPrecreatePay: 'api-order/api/aliPay/tradePrecreatePay', // 支付宝扫码支付
		aliRefund: 'api-order/api/aliPay/tradePrecreatePay', // 支付宝退款
		//微信
		wapPay:'api-order/api/wxPay/wapPay', //微信H5 支付 注意：必须再web页面中发起支付且域名已添加到开发配置中
		webPay:'api-order/api/wxPay/webPay',//公众号支付
		scanCode1:'api-order/api/wxPay/scanCode1',//扫码支付模式一 已测试
		scanCode2:'api-order/api/wxPay/scanCode2',//扫码支付模式二 已测试
		appPay:'api-order/api/wxPay/appPay',//微信APP支付
		micropay:'api-order/api/wxPay/micropay',//微信刷卡支付
		miniAppPay:'api-order/api/wxPay/miniAppPay',//微信小程序支付
		refund:'api-order/api/wxPay/refund',//微信退款 String transactionId,String outTradeNo
		authCodeToOpenid:'api-order/api/wxPay/authCodeToOpenid',//openId，采用 网页授权获取 access_token API：SnsAccessTokenApi获取

		//银联支付
		frontConsume:'unionPay/frontConsume', //PC网关支付 B2C跟B2B查询区别就在于bizType的不同
		frontConsume2:'unionPay/frontConsume2',//B2B的网关支付 B2C跟B2B查询区别就在于bizType的不同
		wapConsume:'unionPay/wapConsume',//WAP支付 请在手机paymentlist端访问此action
		appConsume:'unionPay/appConsume',//APP支付获取tn
		frontrefund:'unionPay/refund',//

		//京东
		jdappPay:'JDPay/appPay', //App 支付
		saveOrder:'JDPay/saveOrder',//String payType PC H5 支付
		customerPay:'JDPay/customerPay',//商户二维码支付
		fkmPay:'JDPay/fkmPay',//刷卡支付 String token, String amount
		jdrefund:'JDPay/refund',//微信APP支付

	},
	marking: {
		groupActivityDetail: 'single/sms/group.activity.getdetial', // 查询团购详情信息
		groupActivityList: 'single/sms/groupActivityList', // 查询商品团购列表
		acceptCoupon: 'api-sms/auth/acceptCoupon', // 获取优惠券
		listMemberCoupon: 'single/sms/listMemberCoupon', // 优惠券列表
		couponList: 'api-sms/notAuth/coupon/list', //  可领取的优惠券

	},
	cms: {
		subjectList: 'api-cms/notAuth/cms/subject/list', //  查询文章列表
		subjectCategoryList: 'api-order/notAuth/cms/subjectCategory/list', //  查询文章分类列表
		subjectCommentList: 'api-order/notAuth/cms/subjectComment/list', //  查询文章评论列表
		recommendSubjectList: 'api-order/notAuth/cms/recommendSubjectList/list', //查询首页推荐文章
		topicList: 'api-order/notAuth/cms/topic/list', //  查询专题列表
		topicDetail: 'api-order/notAuth/cms/topic/detail', // 专题详情
		subjectDetail: 'api-order/notAuth/cms/subject/detail', // 文章详情
		createSubject: 'api-order/notAuth/cms/createSubject', // 创建文章
	},

	/**
	 * 封装请求（async await 封装uni.request）
	 * method	   post/get
	 * endpoint    接口方法名
	 * data		   所需传递参数
	 * load		   是否需要loading
	 */
	async apiCall(method, endpoint, data, load) {
		if (!load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}
		let fullurl = this.BASEURI + endpoint;
		let Authorization;
		const userToken = uni.getStorageSync('userToken');
		if (userToken) {
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo && userInfo.id) {
				let mid = userInfo.id;
				if (mid) {
					data.memberId = mid;
					Authorization = userToken.token_type + " " + userToken.access_token;
				}
			}

		}
		console.log(userToken);
		if (endpoint == 'api-uaa/oauth/user/ums/token') {
			let [error, res] = await uni.request({
				url: fullurl,
				data: data,
				method: method,
				header: {

					'client_id': 'app',
					'client_secret': 'app',
					'storeid': 1,
					//	'Content-Type': 'application/x-www-form-urlencoded',
					// 'content-type': 'application/json',
					'Authorization': Authorization || ''
				},
			});
			if (!load) {
				uni.hideLoading();
			}
			console.log(res);
			if (res.data.message == 'User token expired!') {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				uni.navigateTo({
					url: `/pages/public/login`
				})
			}
			if (res.data.message == '请先登录') {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				uni.navigateTo({
					url: `/pages/public/login`
				})
			}
			return res.data;
		} else {
			let [error, res] = await uni.request({
				url: fullurl,
				data: data,
				method: method,
				header: {
					//      'content-type': 'application/x-www-form-urlencoded',
					'client_id': 'app',
					'client_secret': 'app',
					'storeid': 1,
					'Content-Type': 'application/x-www-form-urlencoded',
					// 'content-type': 'application/json',
					'Authorization': Authorization || ''
				},
			});
			if (!load) {
				uni.hideLoading();
			}

			console.log(fullurl);
					console.log(res);
			if (res.data.resp_code == 401) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				uni.navigateTo({
					url: `/pages/public/login`
				})
			}
			if (res.data.message == '请先登录') {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				uni.navigateTo({
					url: `/pages/public/login`
				})
			}
			return res.data;
		}




	},
	/**
	 * 封装请求（async await 封装uni.request）
	 * method	   post/get
	 * endpoint    接口方法名
	 * data		   所需传递参数
	 * load		   是否需要loading
	 */
	async apiEsCall(method, endpoint, data, load) {
		if (!load) {
			uni.showLoading({
				title: '请稍候',
				mask: true
			});
		}

		let fullurl = this.ESURI + endpoint;
		//let fullurl = 'http://localhost:8085/api/' + endpoint;
		let Authorization = `${store.state.userInfo.tokenHead}${store.state.userInfo.token}`;
		let [error, res] = await uni.request({
			url: fullurl,
			data: data,
			method: method,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				// 'content-type': 'application/json',
				'Authorization': Authorization || ''
			},
		});
		console.log(error);
		if (!load) {
			uni.hideLoading();
		}
		return res.data;

	},
}
