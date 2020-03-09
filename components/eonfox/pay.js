import eonfox from '@/components/eonfox/eonfox.js';
var ef=new eonfox()
import f from '@/components/eonfox/fns.js';
var pay= {
	set_password:function(pass,pass_confirm,fun){
		ef.submit({
			request:{
				set_pass:['setpass',[{password:pass}]]
			},
			callback:function(data){
				if(data=f.checkError(data,'set_pass',function(errno,error){
					f.err(error)
				})){
					fun()
				}else{
					f.err('设置失败')
				}
				console.log('支付结果');
			},
			error(err){
				f.err('',err,1)
			}
		})
	},
		shoppingCar:function(id,method,pass,fun){
			ef.submit({
				request:{
					s:['SHOPORDERSELFPAYMENT',[{order_id:id,pay_method:method,pay_password:pass}]]
				},
				callback:function(data){
				    const dataList=(data=f.checkError(data,'s',function(errno,error){
						f.err(error)
						
					}))
					console.log('da...',dataList)
					if(dataList.s.order_id){
						
					f.err('支付成功')
					return ok
					}
					
					console.log('支付结果');
				},
				error(err){
					f.err('',err,1)
				}
			})
		},
		//取消订单
		cancel_order:function(id,fun){
			ef.submit({
				request:{
					cancel_order:['SHOPORDERSELFCANCEL',[{id:id}]]
				},
				callback:function(data){
					if(data=f.checkError(data,'cancel_order',function(errno,error){
						f.err(error)
					})){
						fun()
					}else{
						f.err('订单取消失败')
					}
				},
				error(err){
					f.err('',err,1)
				}
			})
		},
}
export default pay;