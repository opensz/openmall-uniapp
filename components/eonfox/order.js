import eonfox from '@/components/eonfox/eonfox.js';
var ef = new eonfox();

var order = {
	
	/* 检查支付状态 
		order_id  	要检查的订单ID
		frequency	检查的次数，当等于0时，则返回回调
		callback	回调。成功时：callback.success  失败时：callback.fail
		因为有 frequency 次数，所以每次进来 -1 。如果不等于0，那么要继续递归
		
		order.checkPayState({
			order_id: order_id,
			frequency: 3,
			success:function(){
				
			},
			fail:function(){
				
			}
		})
	*/
	checkPayState : function(data){
		var _this = this;
		if(typeof data.success != 'function') data.success = function(){};
		if(typeof data.fail != 'function') data.fail = function(){};
		if( typeof data.frequency != 'number') data.frequency = 3;
		
		if( !data.frequency || !data.order_id ){
			return data.fail('参数不正确', data);
		}
		
		
		//如果不等于0，那么要继续递归
		data.frequency --;
		
		//开始查询状态  0表示未支付；1表示支付成功。
		ef.submit({
			request:{
				s:['APPLICATIONORDERSELFPAYSTATE',[{order_id: data.order_id}]]
			},
			callback: function(r){
				console.log('order.checkPayState:::',r);
				// console.log('支付查询回调成功',r.data.s.data) ;return r.data.s.data;
				if( !r.errno && !r.data.s.errno && r.data.s.data){
					console.log('支付成功');
					//获取成功，无错误信息时
					return data.success();
				} else {
					console.log('支付状态查询失败或者未支付');
					if( !data.frequency ){
						return data.fail();
					}else{
						setTimeout(function() {
							return _this.checkPayState(data);
						}, 2000);
					}
				}
			},
			error(err){
				data.fail(err);
			}
		})
		
	}
	
	
	
	
};

export default order;