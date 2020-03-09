import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo:''
	},
	mutations: {
		login(state, provider) {
			/*if (provider && provider!=undefined){
                state.hasLogin = true;
                state.userInfo = provider.data;
                			uni.setStorage({//缓存用户登陆状态
                			    key: 'userInfo',
                			    data: provider.data
                			})
			}*/
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = '';
			uni.removeStorage({  
                key: 'userInfo'  
            })
		}
	},
	 action:{
        commitUserInfo:({commit},userInfo)=>commit('setUserInfo',userInfo)
    }
})

export default store
