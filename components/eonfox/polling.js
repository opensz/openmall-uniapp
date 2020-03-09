var polling = {
	
	//定时器ID
	_interval_id : null,
	_switch : false,
	
	//关闭
	close : function(){
		clearInterval(this._interval_id);
		this._interval_id = null;
	},
	
	//暂停
	stop : function(){
		this._switch = false;
	},
	
	//启动
	start : function(){
		this._switch = true;
	},
	
	
	/**
	 * 开启
	 * 
	 * @param	{Time}		ms	毫秒数
	 * @param	{Function}	fn	回调函数
	 */
	run : function(ms, fn){
		if( !ms || typeof ms != 'number'){
			ms = 3000;//默认3秒
		}
		if(!fn || typeof fn != 'function'){
			fn = function(){};
		}
		
		var _this = this;
		//如果已经存在，则要关闭轮询
		if( _this._interval_id ){
			_this.start();
			return true;
		}
		
		var i = 0;
		_this._switch = true;
		_this._interval_id = setInterval(function(){
			if( !_this._switch ){
				return false;
			}
			
			i ++;
			fn(i);
		}, ms);
		
		return true;
	}
	
};

export default polling;