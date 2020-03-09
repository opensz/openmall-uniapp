import eonfox from '@/components/eonfox/eonfox.js';
var ef=new eonfox()
import f from '@/components/eonfox/fns.js';
var pay= {
		shoppingCar:function(groupId,method,pass,fun){
			ef.submit({
				request:{
					s:['SHOPGROUPGOODSSELFPAY',[{id:groupId,pay_method:method,pay_password:pass}]]
				},
				callback:function(data){
				    const dataList=(data=f.checkError(data,'s',function(errno,error){
						f.err(error)
						
					}))
					console.log('da...',dataList)
					if(dataList.s==true){
						fun()
					}
					
// 					var dataList=data.s
// 					if(dataList.data){
// 						if(dataList.data==true){
// 							f.err('支付成功')
// 						}else{
// 							f.err('支付失败')
// 						}
// 						
// 					}
					
					console.log('支付结果');
				},
				error(err){
					f.err('',err,1)
				}
			})
		}

}
export default pay;