import Vue from 'vue'
import Vuex from 'vuex'

//2.创建对象
const store = new Vuex.Store({
  state:{
    userName: ''
  },
  mutations:{
    setUserName(state, username) {
      state.userName = username
    }
  },
  actions:{

  },
  getters:{
    getUserName(state){
      return state.userName
    }
  },
  modules:{

  }
})
//3.导出使用
export default store
