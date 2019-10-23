import http from '../api/index'
import global from '../global/global'
export default new Vuex.Store({
  state: {
    projectSort: [],
    branch: [],
    baseBranch: [],
    commonInfo: {} // 公共信息,首页调用
  },
  mutations: {
    changeProjectSort(state, data) {
      state.projectSort = data
    },
    changeBranch(state, data) {
      state.branch = data
      state.baseBranch = global.dataBase(data)
    },
    changeCommonInfo(state, data) {
      state.commonInfo = data[0]
    }
  },
  actions: {
    async changeProjectSort({ commit }, data = {}) { // 产品分类
      const res = await http.post('querySort', data)
        .then(res => res.data.item)
        .catch((e) => console.error(e))
      if (res) {
        commit("changeProjectSort", res)
      }
    },
    async getBranch({ commit }, data = {}) { // 部门
      const res = await http.post('queryBranch', data)
        .then(res => res.data.item)
        .catch((e) => console.error(e))
      if (res) {
        commit("changeBranch", res)
      }
    },
    async getCommonInfo({ commit }, data = {}) { // 公共信息
      const res = await http.post('commonInfo', data)
        .then(res => res.data.item)
        .catch((e) => console.error(e))
        if (res) {
          commit("changeCommonInfo", res)
        }
    }
  }
})