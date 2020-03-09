import eonfoxObject from '@/components/eonfox/eonfox.js';
var eonfox = new eonfoxObject();
var websocket_app = false;
//#ifdef APP-PLUS
websocket_app = true;
//#endif

var websocket = function(config){};
websocket.prototype = {
	
	// url :'wss://developer.eapie.eonfox.com:9997',//测试版
	url :'wss://eapie.eonfox.com:9999',//正式版
	connect_type : 0,//连接类型。0是安卓，1是非安卓
	debug: false,//是否调试
	close_type : 0,//1是手动关闭，不会再尝试连接
	token:'',//websocket令牌
	open:false,//打开状态
	client_id:'',//连接ID
	server_time: 0,//websocket 服务器时间
	messages:[],//接受的websocket消息的集合
	message_max_number:10,//最大消息个数
	messages_change:function(){},//变动时执行的函数
	
	heartbeat_interval_id: null,//心跳检测的定时器ID
	heartbeat_ms: 15000,//心跳检测毫秒
	heartbeat_messages:[],//心跳检测的信息集合
	heartbeat_message_max_number:10,//最大消息个数
	heartbeat_messages_change:function(){},//变动时执行的函数
	
	
	connect_parameter: null,//连接websocket的参数
	
	
	/* 调试信息 */
	debug_message:function(message, fn){
		if( !websocket.prototype.debug ){
			return false;
		}
		
		console.log(message);
		
		uni.showToast({
			title: message,
			icon: 'none',
			duration: 3000
		});
		
		if(typeof fn == 'function'){
			fn();
		}
	},
	
	/* 获取 websocket 数据 */
	get_data : function(res){
		if( !res.data ){
			return false;
		}
		return JSON.parse( res.data );
	},
	
	
	
	/* 设置心跳检测的信息集合 */
	set_heartbeat_messages: function(message){
		if( this.heartbeat_messages.length >= this.heartbeat_message_max_number ){
			this.heartbeat_messages.pop();//删除最后一个元素
		}
		
		//往前面添加
		this.heartbeat_messages.unshift(message);
		if(typeof websocket.prototype.heartbeat_messages_change == 'function') websocket.prototype.heartbeat_messages_change();
	},
	
	
	/* 设置心跳检测的信息集合 */
	set_messages: function(message){
		if( this.messages.length >= this.message_max_number ){
			this.messages.pop();//删除最后一个元素
		}
		
		//往前面添加
		this.messages.unshift(message);
		if(typeof websocket.prototype.messages_change == 'function') websocket.prototype.messages_change();
	},
	
	messages_change_function: function(fn){
		websocket.prototype.messages_change = fn;
	},
	
	heartbeat_messages_change_function: function(fn){
		websocket.prototype.heartbeat_messages_change = fn;
	},
	
	
	/**
	 * 获取左 websocket_token
	 * 如果没用传入回调函数，那么则直接返回当前左令牌，但是有可能会出现左令牌失效
	 * 正常操作是，传入一个回调函数，左令牌始终是保持最新的。
	 * 
	 * @param	{Function}	#fn
	 */
	session_websocket_token : function(fn){
		if(typeof fn != "function"){
			var storage_token = eonfox.token();
			if( (function(){try{ return storage_token['session_websocket_token'];}catch(e){return false;}}()) ){
				return storage_token['session_websocket_token'];
				}else{
					return '';
				} 
		}else{
			eonfox.submit({
				callback: function(){
					//从本地缓存中同步获取指定 key 对应的内容。
					var websocket_token = "";
					var storage_token = eonfox.token();
					if( (function(){try{ return storage_token['session_websocket_token'];}catch(e){return false;}}()) ){
						websocket_token = storage_token['session_websocket_token'];
						}
					fn(websocket_token);
				}
			});
			return true;
		}
	},		
	
	/* 
	 * 获取 websocket 令牌
	 * 传入一个回调函数
	 */
	get_token : function(fn){
		var websocket_token  = websocket.prototype.session_websocket_token();
		if( websocket_token ){
			console.log('get_websocket_token 已存在', websocket_token);
			fn(websocket_token);
		}else{
			console.log('get_websocket_token 不存在，异步获取');
			websocket.prototype.session_websocket_token(function(websocket_token){
				fn(websocket_token);
			});
		}
	},	
	
	
	
	/*  连接 websocket */
	connect: function(connectParameter){
		websocket.prototype.connect_type = 1;//连接类型。0是安卓，1是非安卓
		websocket.prototype.not_android_connect(connectParameter);
		// if( websocket_app && plus.os.name == 'Android'){
		// 	websocket.prototype.connect_type = 0;//连接类型。0是安卓，1是非安卓
		// 	websocket.prototype.android_connect(connectParameter);
		// }else{
		// 	websocket.prototype.connect_type = 1;//连接类型。0是安卓，1是非安卓
		// 	websocket.prototype.not_android_connect(connectParameter);
		// }
	},
	
	//安卓程序
	android_connect: function(connectParameter){},
	
	
	//非安卓程序
	//data.onSocketOpen
	not_android_connect: function(connectParameter){
		var _this = this;
		websocket.prototype.debug_message('websocket.connect 连接 websocket');
		websocket.prototype.connect_parameter = connectParameter;
		websocket.prototype.get_token(function(token){
			if( !token ){
				//这里弹出错误消息
				websocket.prototype.debug_message('websocket.connect 连接失败！没有获取到 websocket token');
			}
			
			//链接
		    uni.connectSocket({
				url: websocket.prototype.url,
			    success(){
					_this.set_messages({
						state:true,
						content:'连接webscoket成功',
					});
				    websocket.prototype.token = token;
					websocket.prototype.debug_message(' uni.connectSocket 连接webscoket成功!token:'+token);
			    },
			    fail(){
					_this.set_messages({
						state:false,
						content:'连接webscoket失败',
					});
					
					websocket.prototype.debug_message(' uni.connectSocket 连接webscoket失败!token:'+token);
			    }
		   });
		   
		});
		
		//WebSocket连接打开监听
		uni.onSocketOpen(function () {
			websocket.prototype.close_type = 0;
			websocket.prototype.open = true;
			websocket.prototype.debug_message('uni.onSocketOpen WebSocket连接已经打开监听!');
			if(connectParameter && typeof connectParameter.onSocketOpen == 'function'){
				connectParameter.onSocketOpen();
			}
		});
		
		uni.onSocketClose(function (res) {
			websocket.prototype.token = '';
			websocket.prototype.open = false;
			websocket.prototype.client_id = '';
			//关闭心跳检测
			if( websocket.prototype.heartbeat_interval_id ){
				clearInterval( websocket.prototype.heartbeat_interval_id );
			}
			
			if(connectParameter && typeof connectParameter.onSocketClose == 'function'){
				connectParameter.onSocketClose(res);
			}
			
			//开启心跳检测
			if( websocket.prototype.close_type == 0){
				websocket.prototype.debug_message('uni.onSocketClose 非手动关闭，开启心跳守护');
				setTimeout(function(){
					websocket.prototype.connect(connectParameter);
				}, websocket.prototype.heartbeat_ms);
				
			}
			websocket.prototype.debug_message('uni.onSocketClose WebSocket 已关闭！');
		});
		
		//收到服务器内容
		uni.onSocketMessage(function (res) {
			console.log('onSocketMessage!!!!!!!!');
			//给一个超时器
			setTimeout(function(){
				console.log('setTimeout!!!!!!!!');
				websocket.prototype.debug_message('onSocketMessage 获取 websocket 数据:' + JSON.stringify(res));
				var websocket_token  = eonfox.websocketToken();
				var r = websocket.prototype.get_data(res);
				//websocket 检查连接ID值(旧-新)
				if( (r.data && r.data.client_id && websocket.prototype.client_id != r.data.client_id) || 
				(r.data && r.data.server_time && websocket.prototype.server_time != r.data.server_time) || 
				(websocket.prototype.token != websocket_token) ){
					if(r.data && r.data.client_id && websocket.prototype.client_id != r.data.client_id){
						websocket.prototype.debug_message('websocket 连接ID 不一致',function(){
							console.log('websocket.prototype.client_id != r.data.client_id', websocket.prototype.client_id, r.data.client_id);
						});
					}
					if(r.data && r.data.server_time && websocket.prototype.server_time != r.data.server_time){
						websocket.prototype.debug_message('websocket 服务器时间 不一致',function(){
							console.log('websocket.prototype.server_time != r.data.server_time', websocket.prototype.server_time, r.data.server_time);
						});
					}
					if(websocket.prototype.token != websocket_token){
						websocket.prototype.debug_message('websocket_token 不一致',function(){
							console.log('websocket.prototype.token != websocket_token', websocket.prototype.token, websocket_token);
						});
					}
					return websocket.prototype.init( r.data.client_id, r.data.server_time, websocket_token, connectParameter, function(){
						if(typeof connectParameter.onSocketMessage == 'function'){
							connectParameter.onSocketMessage(res);
						}
					});//初始化
				}else{
					if(connectParameter && typeof connectParameter.onSocketMessage == 'function'){
						connectParameter.onSocketMessage(res);
					}
				}
				
			}, 0);
			
		});
		
		uni.onSocketError(function (res) {
			//开启心跳检测
			setTimeout(function(){
				websocket.prototype.connect(connectParameter);
			}, websocket.prototype.heartbeat_ms);
			if(connectParameter && typeof connectParameter.onSocketError == 'function'){
				connectParameter.onSocketError(res);
			}
			_this.set_messages({
				state:false,
				content:'连接webscoket失败',
				error: res
			});
			
			websocket.prototype.debug_message('uni.onSocketError WebSocket连接打开失败，请检查!error:'+res);
		});
	},
	
	
		
	/* 初始化 */
	init : function( client_id, server_time, token, connectParameter, callback){
		var errorData = {
			open : websocket.prototype.open,
			token : websocket.prototype.token,
			client_id : client_id
		};
		
		if( !websocket.prototype.open || !client_id ){
			_this.set_messages({
				state:false,
				content:'websocket 初始化失败',
				error: ''
			});
			websocket.prototype.debug_message('websocket 初始化失败！');
		};
		
		eonfox.submit({
			request: {
				s: ['SESSIONWEBSOCKETSELFCLIENT', [{
					client_id: client_id, //连接id
					server_time: server_time // 服务器时间
					}]]
			},
			callback: function(){
				//必须是在初始化成功之后 才更新连接ID值
				websocket.prototype.client_id = client_id;
				websocket.prototype.server_time = server_time;
				//再次重置 websoket 令牌
				websocket.prototype.token = token;
				//开启心跳检测
				if( websocket.prototype.heartbeat_interval_id ){
					clearInterval( websocket.prototype.heartbeat_interval_id );
				}
				websocket.prototype.heartbeat_interval_id = setInterval(function(){
					websocket.prototype.debug_message('websocket init 心跳检测');
					websocket.prototype.heartbeat(function(errorData){
						websocket.prototype.debug_message('websocket init 心跳检测失败', function(){
							console.log('websocket_init 心跳检测失败返回值：', errorData);
						});
						clearInterval( websocket.prototype.heartbeat_interval_id );
						websocket.prototype.connect(connectParameter);
					});
				}, websocket.prototype.heartbeat_ms);
				
				if(typeof connectParameter.initSuccess != 'function') connectParameter.initSuccess = function(){};
				connectParameter.initSuccess();
				websocket.prototype.debug_message('websocket init 初始化成功');
				websocket.prototype.set_heartbeat_messages({
					state:true,
					content:'websocket init 初始化成功！'
				});
				if(typeof callback != 'function') callback = function(){};
				callback();
			},
			error : function(errorData){
				websocket.prototype.debug_message('websocket init 初始化错误');
				websocket.prototype.set_heartbeat_messages({
					state:false,
					content:'websocket init 初始化错误！',
					error:errorData
				});
				return connectParameter.initError(errorData);
			}
		});
	},
	
	
	/* 发送心跳 */
	heartbeat: function(errorFunction){
		var errorData = {
			open : websocket.prototype.open,
			token : websocket.prototype.token,
			client_id : websocket.prototype.client_id
		};
		if( !websocket.prototype.open || !websocket.prototype.token ){
			if(typeof errorFunction != 'function') errorFunction = function(){};
			websocket.prototype.debug_message('websocket heartbeat 初始化失败！');
			websocket.prototype.set_heartbeat_messages({
				state:false,
				content:'websocket 初始化失败！'
			});
			return errorFunction(errorData);
		};
		
		var heartbeat  = JSON.stringify({
			module:'heartbeat',
			application: eonfox.application,
			token: websocket.prototype.token
		});
		
		uni.sendSocketMessage({
			data: heartbeat,
			success: function(res){
				websocket.prototype.debug_message('websocket heartbeat 保持心跳成功！');
				websocket.prototype.set_heartbeat_messages({
					state:true,
					content:'websocket heartbeat 保持心跳成功！'
				});
			},
			fail: function(data){
				websocket.prototype.debug_message('websocket heartbeat 保持心跳失败！');
				websocket.prototype.set_heartbeat_messages({
					state:false,
					content:'websocket heartbeat 保持心跳失败！',
					error: data
				});
				return errorFunction(errorData);
			}
		});
		
	},
	
		
	
	//重启 websocket
	restart : function(){
		websocket.prototype.close();
		//重启
		websocket.prototype.connect(websocket.prototype.connect_parameter);
		websocket.prototype.debug_message('重启 websocket');
	},
	
	//关闭
	close : function(){
		//关闭
		if( websocket.prototype.open ){
			//连接类型。0是安卓，1是非安卓
			if( websocket.prototype.connect_type == 1 ){
				uni.closeSocket();
			}else{
				//
			}
		}
		
		websocket.prototype.close_type = 1;
		websocket.prototype.token = '';
		websocket.prototype.open = false;
		websocket.prototype.client_id = '';
		//关闭心跳检测
		if( websocket.prototype.heartbeat_interval_id ){
			clearInterval( websocket.prototype.heartbeat_interval_id );
		}
		
	},
	
	
	
		
	/* 用户向用户推送 */
	user_push : function(user_id, message, errorFunction){
		var data = {
			open : websocket.prototype.open,
			token : websocket.prototype.token
		}
		if( !websocket.prototype.open || !websocket.prototype.token ){
			if(typeof errorFunction != 'function') errorFunction = function(){};
			return errorFunction(data);
		}
		var user_push  = JSON.stringify({
			module:'user_push',
			application: eonfox.application,
			token: websocket.prototype.token,
			user_id:user_id,
			message: message,
		});
		
		uni.sendSocketMessage({
			data: user_push,
			success: function(res){
				websocket.prototype.debug_message('websocket 消息推送成功！', function(){
					 console.log('user_push', res)
				});
				websocket.prototype.set_messages({
					state:true,
					content:'websocket user_push 消息推送成功！',
				});
			},
			fail: function(faildata){
				websocket.prototype.debug_message('websocket 消息推送失败！', function(){
					 console.log('user_push', faildata)
				});
				websocket.prototype.set_messages({
					state:false,
					content:'websocket user_push 消息推送失败！',
					error:faildata
				});
			
				return errorFunction(errorData);
			}
		});
		
	},
	
	
	/* 用户向后台推送 */
	admin_push : function(message, errorFunction){
		var data = {
			open : websocket.prototype.open,
			token : websocket.prototype.token
		}
		if( !websocket.prototype.open || !websocket.prototype.token ){
			if(typeof errorFunction != 'function') errorFunction = function(){};
			return errorFunction(data);
		}
		var admin_push  = JSON.stringify({
			module:'admin_push',
			application: eonfox.application,
			token: websocket.prototype.token,
			message: message,
		});
		
		uni.sendSocketMessage({
			data: admin_push,
			success: function(res){
				websocket.prototype.debug_message('websocket 消息推送成功！', function(){
					 console.log('admin_push', res)
				});
				websocket.prototype.set_messages({
					state:true,
					content:'websocket admin_push 消息推送成功！',
				});
				
			},
			fail: function(faildata){
				websocket.prototype.debug_message('websocket 消息推送失败！', function(){
					 console.log('admin_push', faildata)
				});
				websocket.prototype.set_messages({
					state:false,
					content:'websocket admin_push 消息推送失败！',
					error:faildata
				});
			   
				return errorFunction(errorData);
			}
		});
	},
	
	
	
	
	
};

export default websocket;


