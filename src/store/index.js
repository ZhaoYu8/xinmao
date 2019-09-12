export default new Vuex.Store({
  state: {
    projectSort: []
  },
  mutations: {
    changeProjectSort (state, data) {
      state.projectSort = data
    }
  }
})