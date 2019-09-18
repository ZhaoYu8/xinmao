import http from '../api/index'
import global from '../global/global'
export default new Vuex.Store({
  state: {
    projectSort: [],
    branch: [],
    baseBranch: []
  },
  mutations: {
    changeProjectSort (state, data) {
      state.projectSort = data
    },
    changeBranch (state, data) {
      state.branch = data
      state.baseBranch = global.dataBase(data)
    }
  },
  actions: {
    async changeProjectSort ({ commit }, data = {}) { // 币种信息
      const res = await http.post('querySort', data)
        .then(res => res.data.item)
        .catch((e) => console.error(e))
      if (res) {
        commit("changeProjectSort", res)
      }
    },
    async getBranch ({ commit }, data = {}) { // 部门
      const res = await http.post('queryBranch', data)
        .then(res => res.data.item)
        .catch((e) => console.error(e))
      if (res) {
        commit("changeBranch", res)
      }
    }
  }
})