## 使用说明：
| 属性名		| 类型			|  说明													|
| --------		| -----:		| :----:												|
| date			| String		|  当前日期，格式支持YYYY-MM							|
| list			| Array			|  已经签到的时间列表，格式支持YYYY-MM-DD、MM-DD、DD	|
| signin_fun	|   function	|  当天签到时调用，返回签到的日期信息					|
| repair		|    Boolean	|  是否开启补签											|
| rule			|    Boolean	|  补签规则开关，默认false，没有补签规则				|
| repair_fun	|    function	|  开启补签后，补签时调用，返回签到的日期信息			|
| choose_date	|    Boolean	|  是否可以选择日期										|
| date_change	|    function	|  当前日期改变时调用									|

``` html
<fl-signin 
	:date="date" 
	:list="list" 
	@signin_fun="signin_fun" 
	:repair="repair" 
	:rule="rule" 
	@repair_fun="repair_fun" 
	:choose_date="choose_date" 
	@date_change="date_change"
></fl-signin>
```

```javascript
data() {
	return {
		// 是否可以选择日期
		choose_date: false,
		// 当前日期
		date: "2019-03",
		// 签到成功列表
		list: ["2019-03-10", "03-15", "20"],
		// 是否开启补签
		repair: false,
		// 是否开启补签规则
		rule: false,
	}
},
methods: {
	// 签到时触发
	signin_fun(res) {
		console.log(res)
		this.list.push(res.day)
		uni.showToast({
			title: "签到成功",
			icon: "none"
		})
	},
	// 补签成功时触发
	repair_fun(res) {
		console.log(res)
		this.list.push(res.day)
		uni.showToast({
			title: "补签成功",
			icon: "none"
		})
	},
	// 当月份改变时触发
	date_change(date) {
		console.log(date);
		// 更新当前日期
		this.date = date;
		// 更新签到列表
		this.list = ["01", "02"];
	},
}
```

Tips:
  * 有啥问题和建议或者错误不足之处，还望各位大神指出，急的话+QQ：806834390。


### 历史版本
----
#### V1.0.0   2019/03/22
只有最简单的签到和补签功能。
#### V1.1.0   2019/03/23
经大神指点，新增签到按钮和提示，新增补签规则：只能从补签的第一个日期开始补签。
#### V1.2.0   2019/03/24
经大神反馈，修改后的新版本已兼容微信小程序。
#### V1.3.0   2019/03/25
新增补签规则开关rule。
#### V1.4.0   2019/04/02
修复一个重大BUG(日期的计算有问题)，感谢那位发现问题的大神Ｏ(≧∇≦)Ｏ
#### V1.5.0   2019/04/06
优化了部分代码，新增日期选择功能，现在可以查看上n月的签到信息了。
#### V1.6.0   2019/04/10
修复了一个BUG。
#### V1.7.0   2019/04/11
修复了一个样式上的问题，当窗口正好处于某些宽度时，星期天会因为宽度不够，被挤到下一行。感谢Tonybo通过QQ邮箱告诉我。
#### V1.8.0   2019/04/11
修复了一个渲染时判断不对的问题，啊——！还以为不会有问题了！！！咳咳，感谢那些告诉我问题的人。
#### V1.9.0   2019/05/16
我的错，虽然我已经不知道item.index是用来做什么用的了，删掉就行，不然小程序上会出现undefined，感谢安雨忻的反馈。
#### V2.0.0   2019/05/27
根据同事的反馈，所有事件都阻止了冒泡，防止触发其它的自定义事件。
#### V2.1.0   2019/05/31
修复了日期不能选择或出错的问题，顺便把代码重新看了一遍，感谢Await的反馈，也在这里向那些下载了插件的人说声“对不起”，是我没有做好。
