var fns = {
	//--------------
	//api接口验证
	checkError: function(data, ids, error){
		if(typeof(error)!='function'){
			error=function(){
			}
		}
		if(data.errno){
			error(data.errno, data.error);
			return false;
		}
		if(!data.data){
			error(1, "未知错误");
			return false;
		}
		if(ids){
			if(typeof ids =='object'){
				for( var i in ids){
					if(typeof ids[i] != "undefined"){
						var id = ids[i];
						if( data.data[id] && data.data[id].errno ){
							error(data.data[id].errno, data.data[id].error);
							return false;
						}
					}else{
						error(1, "“"+ids[i]+"”目标，未知错误");
						return false;
					}
				}
			}else if(typeof ids =='string' || typeof ids == 'number'){
				if(typeof data.data[ids] != "undefined" ){
					if( data.data[ids].errno ){
						error(data.data[ids].errno, data.data[ids].error);
						return false;
					}
				}else{
					error(1, "“"+ids+"”目标，未知错误");
					return false;
				}
			}else{
				error(1, "“"+ids+"”目标，未知错误");
				return false;
			}
			
		}
		
		var data_list = {};
		
		if(data.data){
			for(var i in data.data){
				if(typeof data.data[i].data != "undefined"){
					data_list[i] = data.data[i].data;
				}
			}
		}
		return data_list;
	},
	//数据处理 ceil向上取整
		number_pre:function(number,pre){
			switch(pre){
				case 'ceil':
					return Math.ceil(number)
				break;
			}
		},
		//保留两位小数
		number_floor_2:function(number){
			var number = number * 100;
			number = Math.floor(number)
			number = number/100;
			return number.toFixed(2);
		},
		//错误信息处理
		err:function(title,data,_json,fun){
			
			if(data){
				if(_json){
					data=JSON.stringify(data)
				}
				console.log(title+' :',data)
				uni.showToast({
					title:title+' : '+data,
					icon:'none',
					duration:1500,
					success() {
						if(fun){
							fun();
						}
					}
				})
			}else{
				console.log(title)
				uni.showToast({
					title:title,
					icon:'none',
					duration:1500,
					success() {
						if(fun){
							fun();
						}
					}
				})
			}
			
		},
		//成功信息处理
		success(title,fun){
			if(fun){
				fun();
			}
			uni.hideLoading();
			/* uni.showToast({
				title:title,
				icon:'success',
				success() {
					if(fun){
						fun();
					}
				}
			}) */
		},
		//敬请期待
		waiting:function(){
			uni.showToast({
				title:'敬请期待',
				icon:'none'
			})
		},
		//授权验证
		oauth_:function(){
			uni.setStorage({
				key:'oauth',
				data:true
			})
		},
		noauth:function(){
			uni.setStorage({
				key:'oauth',
				data:false
			})
		},
		//绑定验证
		unionid:function(){
			uni.setStorage({
				key:'unionid',
				data:true
			})
		},
		nunionid:function(){
			uni.setStorage({
				key:'unionid',
				data:false
			})
		},
		//绑定
		bind:function(){
			console.log('oauth');
			uni.getStorage({
				key:'oauth',
				success(re) {
					console.log('oauth',re);
				}
			})
		},
		//获取指定url参数
		getUrlQuery:function (urlStr) {
			// var urlStr = location.search.substr(1) ? location.search.substr(1) : "";
			var urlArr = [];
			for(var i = 0; i < urlStr.split("&").length; i++) {
				urlArr.push(urlStr.split("&")[i].split("=")[0] ? urlStr.split("&")[i].split("=")[0] : "");
				urlArr.push(urlStr.split("&")[i].split("=")[1] ? urlStr.split("&")[i].split("=")[1] : "onlyKey")
			}
			if(urlStr == "") {
				return;
			} else {
				var urlObj = {}
				for(var i = 0; i < urlArr.length; i += 2) {
					if(urlArr[i] != "") {
						urlObj[urlArr[i]] = decodeURIComponent(urlArr[i + 1]);
					}
				}
				return urlObj;
			}
		}
		,
		// url参数解析
		 getUrlkey:function(url) {
		  var params = {};
		  var urls = url.split("?");                  console.log('1_分割url:', urls)
		  var arr = urls[1].split("&");               console.log('2_分割urls[1]:', arr)
		  for (var i = 0, l = arr.length; i < l; i++) {
			var a = arr[i].split("=");                console.log('3_遍历 arr 并分割后赋值给a:', a[0], a[1])
			params[a[0]] = a[1];                      console.log('4_a给params对象赋值:', params)
		  }                                           console.log('5_结果:', params)
		  return params;
		}
		,
		toast(tit,url,time){
			if(!time){
				time=1500
			}
			uni.showToast({
				title:tit,
				success() {
					setTimeout(function(){
						uni.reLaunch({
							url:url
						})
					},time)
				}
			})
		},
		setSystemInfoSync(){
					uni.getStorage({
						key:'SystemInfoSync',
						fail(err) {
							console.log('设置缓存');
							try {
								console.log('star');
								const res = uni.getSystemInfoSync();
									console.log('config'+JSON.stringify(res));
									uni.setStorage({
										key:'SystemInfoSync',
										data:res
									})
									console.log('ok');
								} catch (e) {
									console.log('catch+'+JSON.stringify(e));
									// error
								}	
						},
						
					})		
		},
		getCompare(Version,newVersion,fun){
			if(Version==newVersion){
				console.log('没有更新');
				return
			}
			console.log('接收到参数');
			uni.getStorage({
				key:'SystemInfoSync',
				success(res) {
						console.log('缓存:'+JSON.stringify(res));
					if(res.data){
						var SystemInfoSync=res.data;
							console.log('json:'+JSON.stringify(SystemInfoSync));
							console.log('设备:'+SystemInfoSync.platform);
							if(SystemInfoSync.platform=='android'){
								console.log('设备:安卓');
								fun();
							}
					}else{
						return this.setSystemInfo();
					}
				},
				fail(err) {
					console.log('缓存获取失败'+JSON.stringify(err));
					const res = uni.getSystemInfoSync();
						console.log('config'+JSON.stringify(res));
						uni.setStorage({
							key:'SystemInfoSync',
							data:res,
							success() {
								if(res.platform=='android'){
									console.log('设备:安卓');
									fun();
								}
							}
						})
					
				},
				complete() {
					console.log('获取缓存');
				}
			})
			
					
			
		}
		//------------------------
};

export default fns;
