import http from '../api/index'
export default new Vuex.Store({
  state: {
    projectSort: []
  },
  mutations: {
    changeProjectSort (state, data) {
      state.projectSort = data
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
    }
  }
})