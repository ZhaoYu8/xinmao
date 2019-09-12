let state = {
  _loading: false,
  commonInfo: {} // 基础信息
}

const mutations = {
  getCommonInfo(state, data) { // 获取临时选择数据
    state.commonInfo = data
  }
}
const actions = {
  async getCommonInfo({ commit }, data) { // 币种信息
    const res = await this.$post('querySort', {})
      .then(data => data.data.item)
      .catch((e) => console.error(e))
    if (res) {
      commit("getCommonInfo", res)
    }
  }
}
export default {
  state,
  actions,
  mutations
}